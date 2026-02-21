import { AuthError } from "expo-auth-session";
import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";
import { getApiClient } from "shared/services/api";
import { authService } from "shared/services/auth.service";
import { initApiClientMobile } from "../lib/apiMobile";
import useGoogleAuth from "../hooks/useGoogleAuth";

WebBrowser.maybeCompleteAuthSession();

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: string;
  provider?: string; // apple || google
  exp?: number;
  cookieExpiration?: number;
}

const AuthContext = React.createContext({
  user: null as AuthUser | null,
  signInWithGoogle: async () => {},
  signInWithApple: async () => {},
  isAppleSignInAvailable: false,
  signOut: async () => {},
  fetchWithAuth: async (url: string, options?: RequestInit) =>
    Promise.resolve(new Response()),
  isLoading: false,
  status: "unauthenticated" as "loading" | "authenticated" | "unauthenticated",
  error: null as AuthError | null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<AuthError | null>(null);
  const [isAppleSignInAvailable, setIsAppleSignInAvailable] =
    React.useState(false);

  // Init shared API client and restore user from stored tokens
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        initApiClientMobile();
        const client = getApiClient();
        await client.initialize();
        if (cancelled) return;
        if (client.hasTokens()) {
          const u = await authService.getCurrentUser();
          if (cancelled) return;
          setUser({
            id: u.user_id,
            email: u.email ?? "",
            name: u.display_name ?? u.email ?? "User",
            provider: "google",
          });
        }
      } catch {
        // No stored session or invalid tokens
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Check Apple Sign In availability on mount
  React.useEffect(() => {
    const checkAppleSignIn = async () => {
      if (Platform.OS === "ios") {
        const isAvailable = await AppleAuthentication.isAvailableAsync();
        setIsAppleSignInAvailable(isAvailable);
      }
    };
    checkAppleSignIn();
  }, []);

  // Google OAuth: set EXPO_PUBLIC_GOOGLE_CLIENT_ID and EXPO_PUBLIC_GOOGLE_REDIRECT_URI in .env
  const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "";
  const redirectUri =
    process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI || "com.kyak15.wordshelf:/";

  const googleAuth = useGoogleAuth({
    clientId,
    redirectUri,
  });

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Prompt user to sign in with Google
      const result = await googleAuth.promptAsync();

      if (result.type === "success" && result.code) {
        // Exchange authorization code for tokens with backend
        const authResult = await authService.googleExchange(
          result.code,
          result.codeVerifier,
          redirectUri,
        );

        // Set user from response
        if (authResult.user) {
          setUser({
            id: authResult.user.user_id,
            email: authResult.user.email || "",
            name:
              authResult.user.display_name || authResult.user.email || "User",
            provider: "google",
          });
        }
      } else if (result.type === "error") {
        throw new Error(result.error || "Google sign-in failed");
      }
      // If type is "dismiss", user cancelled - do nothing
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign in with Google";
      console.error("Google sign-in error:", errorMessage);
      setError({
        code: "google_signin_failed",
        message: errorMessage,
      } as AuthError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("No identity token received from Apple");
      }

      // Exchange identity token with backend
      const authResult = await authService.appleSignIn(
        credential.identityToken,
        {
          name: credential.fullName
            ? {
                firstName: credential.fullName.givenName ?? undefined,
                lastName: credential.fullName.familyName ?? undefined,
              }
            : undefined,
          email: credential.email ?? undefined,
        },
      );

      // Set user from response
      if (authResult.user) {
        setUser({
          id: authResult.user.user_id,
          email: authResult.user.email || "",
          name: authResult.user.display_name || authResult.user.email || "User",
          provider: "apple",
        });
      }
    } catch (err) {
      // Handle user cancellation gracefully
      if (
        err instanceof Error &&
        (err as any).code === "ERR_REQUEST_CANCELED"
      ) {
        // User cancelled, don't show error
        return;
      }

      const errorMessage =
        err instanceof Error ? err.message : "Failed to sign in with Apple";
      console.error("Apple sign-in error:", errorMessage);
      setError({
        code: "apple_signin_failed",
        message: errorMessage,
      } as AuthError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWithAuth = async (url: string, options?: RequestInit) => {
    // TODO: Implement authenticated fetch
    return fetch(url, options);
  };

  const status = isLoading
    ? "loading"
    : user
      ? "authenticated"
      : "unauthenticated";

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signInWithApple,
        isAppleSignInAvailable,
        signOut,
        fetchWithAuth,
        isLoading,
        status,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
