/**
 * API Configuration
 * Update API_BASE_URL to match your backend
 */

// For development, use your local machine's IP address
// In production, this would be your actual API URL
export const API_BASE_URL = __DEV__
  ? "http://localhost:3000/api/" // Add /api here
  : "https://api.wordshelf.app/api";

export const AUTH_ENDPOINTS = {
  googleExchange: "/auth/google/exchange",
  appleSignIn: "/auth/apple/signin",
  emailStart: "/auth/email/start",
  emailVerify: "/auth/email/verify",
  refresh: "/auth/refresh",
  logout: "/auth/logout",
  me: "/auth/me",
  devLogin: "/auth/dev-login",
} as const;

/**
 * Google Books API Configuration
 * Used for searching books when adding to library
 */
export const GOOGLE_BOOKS_API_KEY = "AIzaSyBzEGK8IFGJwDue_eSnJUXF3_qkE3bGGc4"; // TODO: Replace with your actual API key
export const GOOGLE_BOOKS_API_URL =
  "https://www.googleapis.com/books/v1/volumes";
