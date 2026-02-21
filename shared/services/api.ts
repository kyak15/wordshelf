import { AUTH_ENDPOINTS } from "../config/api";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "@wordshelf/access_token",
  REFRESH_TOKEN: "@wordshelf/refresh_token",
} as const;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

/** Storage adapter so the same client can run on web (localStorage) or mobile (AsyncStorage). */
export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export interface ApiClientConfig {
  apiBaseUrl: string;
  authEndpoints: typeof AUTH_ENDPOINTS;
}

export interface IApiClient {
  initialize(): Promise<void>;
  setTokens(tokens: TokenPair): Promise<void>;
  clearTokens(): Promise<void>;
  hasTokens(): boolean;
  getRefreshToken(): string | null;
  get<T>(endpoint: string): Promise<ApiResponse<T>>;
  post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>>;
  put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>>;
  patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>>;
  delete<T>(endpoint: string): Promise<ApiResponse<T>>;
}

class ApiClient implements IApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(
    private readonly storage: StorageAdapter,
    private readonly config: ApiClientConfig,
  ) {}

  async initialize(): Promise<void> {
    this.accessToken = await this.storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    this.refreshToken = await this.storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  async setTokens(tokens: TokenPair): Promise<void> {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    await this.storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    await this.storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  }

  async clearTokens(): Promise<void> {
    this.accessToken = null;
    this.refreshToken = null;
    await this.storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    await this.storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  hasTokens(): boolean {
    return !!this.accessToken && !!this.refreshToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.doRefresh();

    try {
      return await this.refreshPromise;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async doRefresh(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.config.apiBaseUrl}${this.config.authEndpoints.refresh}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        },
      );

      if (!response.ok) {
        await this.clearTokens();
        return false;
      }

      const data = await response.json();
      await this.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
      });
      return true;
    } catch {
      await this.clearTokens();
      return false;
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.apiBaseUrl}${endpoint}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.accessToken) {
      (headers as Record<string, string>)["Authorization"] =
        `Bearer ${this.accessToken}`;
    }

    try {
      let response = await fetch(url, { ...options, headers });

      if (response.status === 401 && this.refreshToken) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          (headers as Record<string, string>)["Authorization"] =
            `Bearer ${this.accessToken}`;
          response = await fetch(url, { ...options, headers });
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.message || `Request failed: ${response.status}`,
        };
      }

      if (response.status === 204) {
        return { data: undefined as T };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Singleton for shared services; set by each app (mobile or web) at startup.
let currentClient: IApiClient | null = null;

export function createApiClient(
  storage: StorageAdapter,
  config: ApiClientConfig,
): IApiClient {
  return new ApiClient(storage, config);
}

export function setApiClient(client: IApiClient): void {
  currentClient = client;
}

export function getApiClient(): IApiClient {
  if (!currentClient) {
    throw new Error(
      "API client not initialized. Call setApiClient() from your app entry (e.g. AuthProvider or layout) before using auth or data services.",
    );
  }
  return currentClient;
}
