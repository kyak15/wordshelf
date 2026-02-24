import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  const schemaPath = join(__dirname, "../src/db/schema.sql");
  const sql = readFileSync(schemaPath, "utf8");
  pgm.sql(sql);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  // Drop tables in reverse dependency order (respecting FKs)
  pgm.sql(`
    DROP TABLE IF EXISTS word_reviews;
    DROP TABLE IF EXISTS word_lookups;
    DROP TABLE IF EXISTS book_saved_words;
    DROP TABLE IF EXISTS dictionary_senses;
    DROP TABLE IF EXISTS words;
    DROP TABLE IF EXISTS library_books;
    DROP TABLE IF EXISTS books;
    DROP TABLE IF EXISTS email_otps;
    DROP TABLE IF EXISTS refresh_tokens;
    DROP TABLE IF EXISTS user_identities;
    DROP TABLE IF EXISTS users;
    DROP FUNCTION IF EXISTS set_updated_at();
    DROP TYPE IF EXISTS review_outcome;
    DROP TYPE IF EXISTS review_mode;
    DROP TYPE IF EXISTS dict_provider;
    DROP TYPE IF EXISTS reading_status;
    DROP TYPE IF EXISTS auth_provider;
    DROP EXTENSION IF EXISTS pgcrypto;
  `);
};
