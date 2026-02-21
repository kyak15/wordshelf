"use client";

import {
  createApiClient,
  setApiClient,
  type StorageAdapter,
} from "shared/services/api";
import { AUTH_ENDPOINTS } from "shared/config/api";
import { API_BASE_URL_WEB } from "@/config/apiWeb";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "@wordshelf/access_token",
  REFRESH_TOKEN: "@wordshelf/refresh_token",
} as const;

const webStorageAdapter: StorageAdapter = {
  getItem: (key: string) =>
    Promise.resolve(
      typeof window === "undefined" ? null : localStorage.getItem(key)
    ),
  setItem: (key: string, value: string) => {
    if (typeof window !== "undefined") localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    if (typeof window !== "undefined") localStorage.removeItem(key);
    return Promise.resolve();
  },
};

/**
 * Create the web API client (localStorage) and register it for shared services.
 * Call once from a client component (e.g. AuthProvider) before using auth or data.
 */
export function initApiClientWeb(): void {
  const client = createApiClient(webStorageAdapter, {
    apiBaseUrl: API_BASE_URL_WEB,
    authEndpoints: AUTH_ENDPOINTS,
  });
  setApiClient(client);
}
