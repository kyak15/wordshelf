import * as crypto from "crypto";
import jwt from "jsonwebtoken";
import axios from "axios";
import { pool } from "../db";
import { env } from "../config/env";
import { userService } from "./user.service";
import { verifyAppleToken } from "./apple.service";
import { User, GoogleUserInfo } from "../model/user.model";
import { TokenPair, AuthResult } from "../model/auth.model";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

// ============================================================
// Helpers
// ============================================================

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function parseExpiryToSeconds(expiry: string): number {
  const n = parseInt(expiry, 10);
  if (expiry.endsWith("m")) return 60 * n;
  if (expiry.endsWith("h")) return 3600 * n;
  if (expiry.endsWith("d")) return 86400 * n;
  return n;
}

function signAccessToken(userId: string): { token: string; expiresIn: number } {
  const expiry = env.jwt.accessExpiry;
  const secs = parseExpiryToSeconds(expiry);
  const token = jwt.sign(
    { sub: userId, type: "access" },
    env.jwt.accessSecret,
    { expiresIn: secs },
  );
  return { token, expiresIn: secs };
}

function signRefreshToken(): string {
  const expiry = env.jwt.refreshExpiry;
  const secs = parseExpiryToSeconds(expiry);
  return jwt.sign({ type: "refresh" }, env.jwt.refreshSecret, {
    expiresIn: secs,
  });
}

async function createRefreshToken(userId: string): Promise<string> {
  const refreshToken = signRefreshToken();
  const refreshSecs = parseExpiryToSeconds(env.jwt.refreshExpiry);
  const expiresAt = new Date(Date.now() + refreshSecs * 1000);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, hashToken(refreshToken), expiresAt],
  );

  return refreshToken;
}

function buildAuthResult(user: User, tokens: TokenPair): AuthResult {
  return {
    user: {
      user_id: user.user_id,
      email: user.email,
      display_name: user.display_name,
    },
    ...tokens,
  };
}

// ============================================================
// Google OAuth
// ============================================================

async function exchangeGoogleCode(
  code: string,
  redirectUri: string,
  codeVerifier?: string,
): Promise<GoogleUserInfo> {
  const params = new URLSearchParams({
    code,
    client_id: env.oauth.google.clientId,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  // Only add client_secret if it's provided
  if (env.oauth.google.clientSecret) {
    params.set("client_secret", env.oauth.google.clientSecret);
  }

  // NOTE: For iOS OAuth clients, Google doesn't use PKCE the same way
  // Don't send code_verifier - Google will reject it

  const tokenRes = await axios.post<{ access_token: string }>(
    GOOGLE_TOKEN_URL,
    params.toString(),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      validateStatus: () => true,
    },
  );

  if (tokenRes.status !== 200) {
    const err = tokenRes.data as { error?: string; error_description?: string };
    throw new Error(
      err.error_description ?? err.error ?? "Google token exchange failed",
    );
  }

  const accessToken = tokenRes.data.access_token;
  const userRes = await axios.get<GoogleUserInfo>(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (userRes.status !== 200)
    throw new Error("Failed to fetch Google user info");
  return userRes.data;
}

// ============================================================
// Auth Service
// ============================================================

export const authService = {
  // --------------------------------------------------------
  // Google OAuth code exchange
  // --------------------------------------------------------
  async googleExchange(
    code: string,
    redirectUri: string,
    codeVerifier?: string,
  ): Promise<AuthResult> {
    if (!env.oauth.google.clientId) {
      throw new Error("Google OAuth is not configured (GOOGLE_CLIENT_ID)");
    }

    const profile = await exchangeGoogleCode(code, redirectUri, codeVerifier);

    const user = await userService.findOrCreateByIdentity(
      "google",
      profile.id,
      {
        email: profile.email,
        displayName: profile.name ?? null,
      },
    );

    const { token: accessToken, expiresIn } = signAccessToken(user.user_id);
    const refreshToken = await createRefreshToken(user.user_id);

    return buildAuthResult(user, { accessToken, refreshToken, expiresIn });
  },

  // --------------------------------------------------------
  // Apple Sign In (identityToken verification)
  // --------------------------------------------------------
  async appleSignIn(
    identityToken: string,
    userInfo?: {
      name?: { firstName?: string; lastName?: string };
      email?: string;
    },
  ): Promise<AuthResult> {
    if (!env.oauth.apple.clientId) {
      throw new Error("Apple Sign In is not configured (APPLE_CLIENT_ID)");
    }

    const payload = await verifyAppleToken(identityToken);

    // Build display name from user info (Apple only sends name on first sign-in)
    let displayName: string | null = null;
    if (userInfo?.name) {
      const { firstName, lastName } = userInfo.name;
      displayName = [firstName, lastName].filter(Boolean).join(" ") || null;
    }

    // Apple may or may not return email in the token
    const email = payload.email ?? userInfo?.email ?? null;

    const user = await userService.findOrCreateByIdentity(
      "apple",
      payload.sub,
      {
        email,
        displayName,
      },
    );

    const { token: accessToken, expiresIn } = signAccessToken(user.user_id);
    const refreshToken = await createRefreshToken(user.user_id);

    return buildAuthResult(user, { accessToken, refreshToken, expiresIn });
  },

  // --------------------------------------------------------
  // Refresh tokens
  // --------------------------------------------------------
  async refreshTokens(refreshToken: string): Promise<AuthResult> {
    const decoded = jwt.verify(refreshToken, env.jwt.refreshSecret) as {
      type?: string;
    };
    if (decoded?.type !== "refresh") throw new Error("Invalid refresh token");

    const tokenHash = hashToken(refreshToken);

    // Find and revoke the refresh token (rotation)
    const res = await pool.query<{ user_id: string }>(
      `UPDATE refresh_tokens
       SET revoked_at = now()
       WHERE token_hash = $1 AND expires_at > now() AND revoked_at IS NULL
       RETURNING user_id`,
      [tokenHash],
    );

    if (res.rowCount === 0) {
      throw new Error("Invalid or expired refresh token");
    }

    const userId = res.rows[0].user_id;
    const user = await userService.findById(userId);
    if (!user) throw new Error("User not found");

    const { token: accessToken, expiresIn } = signAccessToken(user.user_id);
    const newRefreshToken = await createRefreshToken(user.user_id);

    return buildAuthResult(user, {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    });
  },

  // --------------------------------------------------------
  // Verify access token
  // --------------------------------------------------------
  verifyAccessToken(token: string): { userId: string } {
    const decoded = jwt.verify(token, env.jwt.accessSecret) as {
      sub: string;
      type?: string;
    };
    if (decoded.type !== "access") throw new Error("Invalid access token");
    return { userId: decoded.sub };
  },

  // --------------------------------------------------------
  // Dev Login (dev mode only — creates/finds a dev user)
  // --------------------------------------------------------
  async devLogin(): Promise<AuthResult> {
    if (!env.isDev) {
      throw new Error("Dev login is only available in development");
    }

    const devEmail = "dev@wordshelf.test";
    const user = await userService.findOrCreateByIdentity("email", devEmail, {
      email: devEmail,
      displayName: "Dev User",
    });

    const { token: accessToken, expiresIn } = signAccessToken(user.user_id);
    const refreshToken = await createRefreshToken(user.user_id);

    return buildAuthResult(user, { accessToken, refreshToken, expiresIn });
  },

  // --------------------------------------------------------
  // Logout (revoke refresh token)
  // --------------------------------------------------------
  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);
    await pool.query(
      `UPDATE refresh_tokens SET revoked_at = now()
       WHERE token_hash = $1 AND revoked_at IS NULL`,
      [tokenHash],
    );
  },

  // --------------------------------------------------------
  // Delete Account
  // --------------------------------------------------------
  async deleteAccount(userId: string): Promise<void> {
    // The CASCADE constraints will handle deleting:
    // - user_identities
    // - refresh_tokens
    // - library_books (which cascades to book_saved_words)
    // - word_lookups
    await pool.query(`DELETE FROM users WHERE user_id = $1`, [userId]);
  },
};
