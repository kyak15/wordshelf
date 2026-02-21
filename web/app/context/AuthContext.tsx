"use client";

import * as React from "react";
import { getApiClient } from "shared/services/api";
import { authService } from "shared/services/auth.service";
import { initApiClientWeb } from "@/lib/apiWeb";
import type { User } from "shared/types";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: string;
  provider?: "apple" | "google";
  exp?: number;
  cookieExpiration?: number;
}

export interface AuthErrorWeb {
  code?: string;
  message: string;
}

const AuthContext = React.createContext({
  user: null as AuthUser | null,
  signInWithGoogle: () => {},
  signOut: async () => {},
  fetchWithAuth: async (url: string, options?: RequestInit) =>
    Promise.resolve(new Response()),
  isLoading: false,
  status: "unauthenticated" as "loading" | "authenticated" | "unauthenticated",
  error: null as AuthErrorWeb | null,
});

function userToAuthUser(u: User): AuthUser {
  return {
    id: u.user_id,
    email: u.email ?? "",
    name: u.display_name ?? u.email ?? "User",
    provider: "google",
  };
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<AuthErrorWeb | null>(null);

  // Init web API client and restore user from stored tokens
  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        initApiClientWeb();
        const client = getApiClient();
        if (client.hasTokens()) {
          const me = await authService.getCurrentUser();
          if (!cancelled) setUser(userToAuthUser(me));
        }
      } catch {
        // No tokens or invalid session
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const signInWithGoogle = React.useCallback(() => {
    setError(null);
    window.location.href = "/auth/signin/google";
  }, []);

  const signOut = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error("Sign out error:", err);
      setError({
        code: "signout_failed",
        message: err instanceof Error ? err.message : "Sign out failed",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWithAuth = React.useCallback(
    async (url: string, options?: RequestInit) => {
      return fetch(url, options);
    },
    []
  );

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
