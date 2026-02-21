import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createApiClient,
  setApiClient,
  type StorageAdapter,
} from "shared/services/api";
import { AUTH_ENDPOINTS } from "shared/config/api";

const BASE = process.env.EXPO_PUBLIC_API_URL || "";
const API_BASE_URL = BASE ? `${BASE.replace(/\/$/, "")}/api/` : "";

const mobileStorageAdapter: StorageAdapter = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
  removeItem: (key: string) => AsyncStorage.removeItem(key),
};

/**
 * Create the mobile API client (AsyncStorage) and register it for shared services.
 * Call once from AuthProvider on mount before using auth or data.
 */
export function initApiClientMobile(): void {
  const client = createApiClient(mobileStorageAdapter, {
    apiBaseUrl: API_BASE_URL,
    authEndpoints: AUTH_ENDPOINTS,
  });
  setApiClient(client);
}
