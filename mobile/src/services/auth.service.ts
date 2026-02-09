import { apiClient } from "./api";
import { AUTH_ENDPOINTS } from "../config/api";

export interface User {
  user_id: string;
  email: string | null;
  display_name: string | null;
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const authService = {
  /**
   * Exchange Google OAuth code for tokens
   */
  async googleSignIn(
    code: string,
    redirectUri: string,
    codeVerifier?: string
  ): Promise<AuthResult> {
    const response = await apiClient.post<AuthResult>(
      AUTH_ENDPOINTS.googleExchange,
      {
        code,
        redirectUri,
        codeVerifier,
      }
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    await apiClient.setTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
    });

    return response.data;
  },

  /**
   * Apple Sign In
   */
  async appleSignIn(
    identityToken: string,
    userInfo?: {
      name?: { firstName?: string; lastName?: string };
      email?: string;
    }
  ): Promise<AuthResult> {
    const response = await apiClient.post<AuthResult>(
      AUTH_ENDPOINTS.appleSignIn,
      {
        identityToken,
        userInfo,
      }
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    await apiClient.setTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
    });

    return response.data;
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ user: User }>(AUTH_ENDPOINTS.me);

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data?.user) {
      throw new Error("No user data received");
    }

    return response.data.user;
  },

  /**
   * Dev login (dev mode only) — creates a real user + tokens
   */
  async devLogin(): Promise<AuthResult> {
    const response = await apiClient.post<AuthResult>(AUTH_ENDPOINTS.devLogin);

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    await apiClient.setTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
    });

    return response.data;
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.logout);
    await apiClient.clearTokens();
  },
};
