import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { apiClient } from "../services/api";
import { authService, User, AuthResult } from "../services/auth.service";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  signInWithGoogle: (
    code: string,
    redirectUri: string,
    codeVerifier?: string
  ) => Promise<void>;
  signInWithApple: (
    identityToken: string,
    userInfo?: {
      name?: { firstName?: string; lastName?: string };
      email?: string;
    }
  ) => Promise<void>;
  signOut: () => Promise<void>;
  /** DEV ONLY: skip auth to test app features on iOS simulator */
  devSkipAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      await apiClient.initialize();

      if (apiClient.hasTokens()) {
        // Try to get current user - but don't fail if backend is unavailable
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setStatus("authenticated");
          return;
        } catch {
          // Backend unavailable or token invalid - clear and show login
          await apiClient.clearTokens();
        }
      }
      setStatus("unauthenticated");
    } catch {
      // Token invalid or expired
      setStatus("unauthenticated");
    }
  };

  const handleAuthResult = (result: AuthResult) => {
    setUser(result.user);
    setStatus("authenticated");
  };

  const signInWithGoogle = async (
    code: string,
    redirectUri: string,
    codeVerifier?: string
  ) => {
    const result = await authService.googleSignIn(
      code,
      redirectUri,
      codeVerifier
    );
    handleAuthResult(result);
  };

  const signInWithApple = async (
    identityToken: string,
    userInfo?: {
      name?: { firstName?: string; lastName?: string };
      email?: string;
    }
  ) => {
    const result = await authService.appleSignIn(identityToken, userInfo);
    handleAuthResult(result);
  };

  const signOut = async () => {
    await authService.logout();
    setUser(null);
    setStatus("unauthenticated");
  };

  const devSkipAuth = async () => {
    if (!__DEV__) return;
    try {
      const result = await authService.devLogin();
      handleAuthResult(result);
    } catch (err) {
      // If backend isn't running, fall back to fake user so UI is still testable
      console.warn("Dev login failed (is the backend running?):", err);
      setUser({
        user_id: "dev-user",
        email: "dev@wordshelf.test",
        display_name: "Dev User",
      });
      setStatus("authenticated");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        signInWithGoogle,
        signInWithApple,
        signOut,
        devSkipAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
