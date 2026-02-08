function envVar(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
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
        password
      )}@${host}:${port}/${database}`;
    },
  },
} as const;
