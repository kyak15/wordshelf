import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { AppleIdTokenPayload } from "../model/user.model";
import { env } from "../config/env";

const APPLE_JWKS_URL = "https://appleid.apple.com/auth/keys";
const APPLE_ISSUER = "https://appleid.apple.com";

const client = jwksClient({
  jwksUri: APPLE_JWKS_URL,
  cache: true,
  cacheMaxAge: 86400000, // 24 hours
});

function getSigningKey(kid: string): Promise<string> {
  return new Promise((resolve, reject) => {
    client.getSigningKey(kid, (err, key) => {
      if (err) return reject(err);
      if (!key) return reject(new Error("No signing key found"));
      const publicKey = key.getPublicKey();
      resolve(publicKey);
    });
  });
}

/**
 * Verify Apple's identityToken (JWT) and return the decoded payload.
 * Throws if invalid.
 */
export async function verifyAppleToken(
  identityToken: string,
): Promise<AppleIdTokenPayload> {
  // Decode header to get kid
  const decoded = jwt.decode(identityToken, { complete: true });
  if (!decoded || typeof decoded === "string") {
    throw new Error("Invalid Apple identity token");
  }

  const kid = decoded.header.kid;
  if (!kid) {
    throw new Error("Apple identity token missing kid");
  }

  const publicKey = await getSigningKey(kid);

  // Verify token
  const payload = jwt.verify(identityToken, publicKey, {
    algorithms: ["RS256"],
    issuer: APPLE_ISSUER,
    audience: env.oauth.apple.clientId,
  }) as AppleIdTokenPayload;

  return payload;
}

/**
 * Parse Apple identity token without verification (for debugging).
 */
export function decodeAppleToken(
  identityToken: string,
): AppleIdTokenPayload | null {
  const decoded = jwt.decode(identityToken);
  if (!decoded || typeof decoded === "string") return null;
  return decoded as AppleIdTokenPayload;
}
