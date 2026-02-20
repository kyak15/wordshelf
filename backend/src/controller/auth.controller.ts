import { Response } from "express";
import { authService } from "../services/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const authController = {
  // --------------------------------------------------------
  // Google OAuth code exchange
  // POST /api/auth/google/exchange
  // --------------------------------------------------------
  async googleExchange(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { code, codeVerifier, redirectUri } = req.body;

      if (!code || !redirectUri) {
        res.status(400).json({
          error: "Missing required fields: code, redirectUri",
        });
        return;
      }
      const result = await authService.googleExchange(
        code,
        redirectUri,
        codeVerifier,
      );

      res.json(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Google exchange failed";
      console.error("[Google Exchange] Error:", message);
      res.status(401).json({ error: message });
    }
  },

  // --------------------------------------------------------
  // Apple Sign In
  // POST /api/auth/apple/signin
  // --------------------------------------------------------
  async appleSignIn(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { identityToken, user } = req.body;
      if (!identityToken) {
        res.status(400).json({
          error: "Missing required field: identityToken",
        });
        return;
      }
      const result = await authService.appleSignIn(identityToken, user);
      res.json(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Apple sign in failed";
      res.status(401).json({ error: message });
    }
  },

  // --------------------------------------------------------
  // Refresh tokens
  // POST /api/auth/refresh
  // --------------------------------------------------------
  async refresh(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ error: "Missing refreshToken" });
        return;
      }
      const result = await authService.refreshTokens(refreshToken);
      res.json(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Refresh failed";
      res.status(401).json({ error: message });
    }
  },

  // --------------------------------------------------------
  // Logout (revoke refresh token)
  // POST /api/auth/logout
  // --------------------------------------------------------
  async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      res.json({ message: "Logged out" });
    } catch (e) {
      // Still return success even if token was invalid
      res.json({ message: "Logged out" });
    }
  },

  // --------------------------------------------------------
  // Dev Login (dev mode only)
  // POST /api/auth/dev-login
  // --------------------------------------------------------
  async devLogin(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await authService.devLogin();
      res.json(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Dev login failed";
      res.status(403).json({ error: message });
    }
  },

  // --------------------------------------------------------
  // Get current user
  // GET /api/auth/me
  // --------------------------------------------------------
  me(req: AuthRequest, res: Response): void {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    res.json({
      user_id: req.user.user_id,
      email: req.user.email,
      display_name: req.user.display_name,
    });
  },

  // --------------------------------------------------------
  // Delete account
  // DELETE /api/auth/account
  // --------------------------------------------------------
  async deleteAccount(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }
      await authService.deleteAccount(req.user.user_id);
      res.status(204).send();
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to delete account";
      res.status(500).json({ error: message });
    }
  },
};
