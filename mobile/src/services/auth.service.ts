import { apiClient } from "./api";
import { AUTH_ENDPOINTS } from "../config/api";
import { User, AuthResult } from "../types";

interface GoogleExchangeResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

interface AppleSignInResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export const authService = {
  /**
   * Exchange Google authorization code for tokens
   */
  async googleExchange(
    code: string,
    codeVerifier?: string,
    redirectUri?: string
  ): Promise<AuthResult> {
    const response = await apiClient.post<GoogleExchangeResponse>(
      AUTH_ENDPOINTS.googleExchange,
      {
        code,
        codeVerifier,
        redirectUri,
      }
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    // Store tokens
    await apiClient.setTokens({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
    });

    return response.data;
  },
  /**
   * Apple Sign In - exchange identity token for app tokens
   */
  async appleSignIn(
    identityToken: string,
    user?: {
      name?: { firstName?: string; lastName?: string };
      email?: string;
    }
  ): Promise<AuthResult> {
    const response = await apiClient.post<AppleSignInResponse>(
      AUTH_ENDPOINTS.appleSignIn,
      {
        identityToken,
        user,
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
    const response = await apiClient.get<User>(AUTH_ENDPOINTS.me);

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("No user data received");
    }

    return response.data;
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
   * Logout - revokes refresh token on server
   */
  async logout(): Promise<void> {
    const refreshToken = apiClient.getRefreshToken();
    if (refreshToken) {
      await apiClient.post(AUTH_ENDPOINTS.logout, { refreshToken });
    }
    await apiClient.clearTokens();
  },

  /**
   * Delete account - permanently deletes user account and all data
   */
  async deleteAccount(): Promise<void> {
    const response = await apiClient.delete("/auth/account");

    if (response.error) {
      throw new Error(response.error);
    }

    await apiClient.clearTokens();
  },
};
