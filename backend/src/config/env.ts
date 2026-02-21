const isProd = process.env.NODE_ENV === "production";

function envVar(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

/** in prod required vars must be set (no fallback). */
function requiredInProd(key: string, fallback: string): string {
  const value = process.env[key] ?? fallback;
  if (isProd && (value === "" || value === fallback)) {
    throw new Error(
      `Missing required env for production: ${key}. Set it in your deployment environment.`,
    );
  }
  return value;
}

export const env = {
  isDev: !isProd,
  port: Number(envVar("PORT", "3000")),

  db: {
    get connectionString(): string {
      const url = process.env.DATABASE_URL;
      if (url) return url;
      const host = envVar("PGHOST", "localhost");
      const port = envVar("PGPORT", "5432");
      const database = envVar("PGDATABASE", "wordshelf");
      const user = envVar("PGUSER", "postgres");
      const password = envVar("PGPASSWORD", "postgres");
      return `postgresql://${user}:${encodeURIComponent(
        password,
      )}@${host}:${port}/${database}`;
    },
  },

  oauth: {
    google: {
      clientId: envVar("GOOGLE_CLIENT_ID", ""),
      clientSecret: envVar("GOOGLE_CLIENT_SECRET", ""),
    },
    apple: {
      // For Apple Sign In, the clientId is app's bundle ID (iOS) or Services ID (web)
      clientId: envVar("APPLE_CLIENT_ID", ""),
      teamId: envVar("APPLE_TEAM_ID", ""),
      keyId: envVar("APPLE_KEY_ID", ""),
      privateKey: envVar("APPLE_PRIVATE_KEY", ""),
    },
  },

  jwt: {
    // In production these must be set; no default to avoid insecure deploy
    accessSecret: requiredInProd("JWT_ACCESS_SECRET", "dev-access-secret"),
    refreshSecret: requiredInProd("JWT_REFRESH_SECRET", "dev-refresh-secret"),
    accessExpiry: envVar("JWT_ACCESS_EXPIRY", "15m"),
    refreshExpiry: envVar("JWT_REFRESH_EXPIRY", "7d"),
  },
} as const;
