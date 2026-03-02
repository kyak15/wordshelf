/**
 * Shared API config (endpoint paths only).
 * Each app provides its own base URL when creating the API client.
 */
export const AUTH_ENDPOINTS = {
  googleExchange: "auth/google/exchange",
  appleSignIn: "auth/apple/signin",
  refresh: "auth/refresh",
  logout: "auth/logout",
  me: "auth/me",
  devLogin: "auth/dev-login",
} as const;

export const GOOGLE_BOOKS_API_URL =
  "https://www.googleapis.com/books/v1/volumes";

/** Optional. Set NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY (web) or EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY (mobile). */
export function getGoogleBooksApiKey(): string {
  return (
    process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY ??
    process.env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY ??
    ""
  );
}
