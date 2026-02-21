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
  if (typeof process === "undefined") return "";
  const env = process.env as Record<string, string | undefined>;
  return env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY ?? env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY ?? "";
}
