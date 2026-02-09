import { useState, useEffect, useCallback } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "../context/AuthContext";

// Required for web browser to close after auth
WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_CLIENT_ID =
  "909601646307-9rfgs4qm8v6eek3qu8gd1tjs1frhnuln.apps.googleusercontent.com";

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

interface UseGoogleAuthResult {
  signIn: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useGoogleAuth = (): UseGoogleAuthResult => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectUri = AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_WEB_CLIENT_ID,
      redirectUri,
      scopes: ["openid", "profile", "email"],
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    discovery
  );

  const handleResponse = useCallback(async () => {
    if (!response) return;

    if (response.type === "success") {
      setLoading(true);
      setError(null);

      try {
        const code = response.params?.code;

        if (!code) {
          throw new Error("Authorization code not received from Google.");
        }

        await signInWithGoogle(code, redirectUri, request?.codeVerifier);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Google sign in failed");
      } finally {
        setLoading(false);
      }
    } else if (response.type === "error") {
      setError(response.error?.message || "Google sign in failed");
    }
  }, [response, request, redirectUri, signInWithGoogle]);

  useEffect(() => {
    handleResponse();
  }, [handleResponse]);

  const signIn = async () => {
    setError(null);
    try {
      await promptAsync();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start Google sign in"
      );
    }
  };

  return {
    signIn,
    loading,
    error,
  };
};
