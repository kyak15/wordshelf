/**
 * Web API config.
 * Set NEXT_PUBLIC_API_URL in .env (e.g. http://localhost:3001 for dev).
 */
const BASE = process.env.NEXT_PUBLIC_API_URL || "";
export const API_BASE_URL_WEB = BASE ? `${BASE.replace(/\/$/, "")}/api/` : "";

export const AUTH_ENDPOINTS_WEB = {
  googleExchange: "auth/google/exchange",
  appleSignIn: "auth/apple/signin",
  refresh: "auth/refresh",
  logout: "auth/logout",
  me: "auth/me",
  devLogin: "auth/dev-login",
} as const;
