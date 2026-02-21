import { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";

WebBrowser.maybeCompleteAuthSession();

interface UseGoogleAuthConfig {
  clientId: string;
  redirectUri: string;
}

interface GoogleAuthResult {
  type: "success" | "error" | "dismiss";
  code?: string;
  codeVerifier?: string;
  error?: string;
}

/**
 * Custom hook for Google OAuth using expo-auth-session
 * Implements PKCE (Proof Key for Code Exchange) for security
 */
export default function useGoogleAuth(config: UseGoogleAuthConfig) {
  const [request, setRequest] = useState<AuthSession.AuthRequest | null>(null);
  const [result, setResult] = useState<GoogleAuthResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Discovery endpoint for Google OAuth
  const discovery = AuthSession.useAutoDiscovery("https://accounts.google.com");

  // Initialize the auth request
  useEffect(() => {
    if (!discovery) return;

    const createRequest = async () => {
      try {
        // Generate code verifier for PKCE
        const codeVerifier = await generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        const authRequest = new AuthSession.AuthRequest({
          clientId: config.clientId,
          redirectUri: config.redirectUri,
          scopes: ["openid", "profile", "email"],
          responseType: AuthSession.ResponseType.Code,
          usePKCE: true,
          codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
          codeChallenge,
          extraParams: {
            access_type: "offline", // Request refresh token
            prompt: "select_account", // Always show account picker
          },
        });

        // Store code verifier in the request for later use
        (authRequest as any).codeVerifier = codeVerifier;

        setRequest(authRequest);
      } catch (error) {
        console.error("Failed to create auth request:", error);
      }
    };

    createRequest();
  }, [discovery, config.clientId, config.redirectUri]);

  /**
   * Prompt user to sign in with Google
   */
  const promptAsync = async (): Promise<GoogleAuthResult> => {
    if (!request || !discovery) {
      return {
        type: "error",
        error: "Auth request not initialized",
      };
    }

    setIsLoading(true);

    try {
      const response = await request.promptAsync(discovery);

      if (response.type === "success") {
        const code = response.params.code;
        const codeVerifier = (request as any).codeVerifier;

        if (!code) {
          setResult({
            type: "error",
            error: "No authorization code received",
          });
          return {
            type: "error",
            error: "No authorization code received",
          };
        }

        const successResult: GoogleAuthResult = {
          type: "success",
          code,
          codeVerifier,
        };

        setResult(successResult);
        return successResult;
      } else if (response.type === "error") {
        const errorResult: GoogleAuthResult = {
          type: "error",
          error: response.error?.message || "Authentication failed",
        };
        setResult(errorResult);
        return errorResult;
      } else {
        // User dismissed/cancelled
        const dismissResult: GoogleAuthResult = {
          type: "dismiss",
        };
        setResult(dismissResult);
        return dismissResult;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      const errorResult: GoogleAuthResult = {
        type: "error",
        error: errorMessage,
      };
      setResult(errorResult);
      return errorResult;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    request,
    promptAsync,
    result,
    isLoading,
  };
}

/**
 * Generate a random code verifier for PKCE
 */
async function generateCodeVerifier(): Promise<string> {
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  const codeVerifier = base64URLEncode(randomBytes);
  return codeVerifier;
}

/**
 * Generate code challenge from verifier
 */
async function generateCodeChallenge(verifier: string): Promise<string> {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    verifier,
  );
  return base64URLEncode(hexToBytes(digest));
}

/**
 * Convert hex string to bytes
 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Base64 URL encode (without padding)
 */
function base64URLEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...Array.from(buffer)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
