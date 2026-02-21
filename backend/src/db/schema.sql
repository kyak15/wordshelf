-- ============================================================
-- Wordshelf: PostgreSQL DDL (OAuth Google/Apple + Email OTP)
-- Domain: books, words, dictionary senses, saved words, SRS
-- ============================================================

-- ---- Extensions ----
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- Enums
-- ============================================================

DO $$ BEGIN
  CREATE TYPE reading_status AS ENUM ('planned', 'reading', 'paused', 'finished', 'abandoned');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE dict_provider AS ENUM ('wordnik', 'oxford', 'merriam_webster', 'wiktionary', 'custom');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE review_outcome AS ENUM ('again', 'hard', 'good', 'easy');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE review_mode AS ENUM ('srs', 'practice');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Auth providers (OAuth + email)
DO $$ BEGIN
  CREATE TYPE auth_provider AS ENUM ('google', 'apple', 'email');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- updated_at trigger helper
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 1) users
-- Notes:
-- - email is nullable to support Apple edge cases (hide-my-email / not returned later)
-- - uniqueness still enforced when present
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  user_id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text UNIQUE, -- nullable on purpose
  display_name  text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- 2) user_identities (links a Wordshelf user to auth providers)
-- - google/apple: provider_user_id = "sub" claim
-- - email: provider_user_id = normalized email (lowercase trimmed)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_identities (
  identity_id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

  provider          auth_provider NOT NULL,
  provider_user_id  text NOT NULL,

  email             text, -- optional copy (useful for debugging/auditing)
  created_at        timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_provider_user UNIQUE (provider, provider_user_id),
  CONSTRAINT uq_user_provider UNIQUE (user_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_user_identities_user ON user_identities(user_id);

-- ============================================================
-- 3) refresh_tokens (sessions)
-- Store only a hash so tokens are revocable and safe at rest.
-- ============================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
  refresh_token_id  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

  token_hash        text NOT NULL UNIQUE,
  created_at        timestamptz NOT NULL DEFAULT now(),
  expires_at        timestamptz NOT NULL,
  revoked_at        timestamptz,

  device_name       text,
  device_id         text
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_valid
  ON refresh_tokens(user_id, expires_at)
  WHERE revoked_at IS NULL;

-- ============================================================
-- 4) email OTP (for "sign in with email")
-- Store hashed code. You can also store a hashed "otp_id token" if you prefer.
-- ============================================================
CREATE TABLE IF NOT EXISTS email_otps (
  otp_id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL,
  code_hash     text NOT NULL,

  created_at    timestamptz NOT NULL DEFAULT now(),
  expires_at    timestamptz NOT NULL,
  consumed_at   timestamptz,

  attempts      integer NOT NULL DEFAULT 0,
  last_attempt_at timestamptz,

  -- Optional: to rate-limit per email, you can enforce only one active OTP if you want.
  -- We'll do it via query logic typically, but index helps.
  CONSTRAINT chk_attempts_nonnegative CHECK (attempts >= 0)
);

CREATE INDEX IF NOT EXISTS idx_email_otps_email_active
  ON email_otps(email, expires_at DESC)
  WHERE consumed_at IS NULL;

-- ============================================================
-- Domain tables
-- ============================================================

-- ============================================================
-- 5) books (canonical metadata)
-- ============================================================
CREATE TABLE IF NOT EXISTS books (
  book_id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  author          text,
  isbn13          text UNIQUE,
  cover_image_url text,
  language_code   text NOT NULL DEFAULT 'en',
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);

-- ============================================================
-- 6) library_books (user’s library entry + reading state)
-- ============================================================
CREATE TABLE IF NOT EXISTS library_books (
  library_book_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  book_id         uuid NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,

  status          reading_status NOT NULL DEFAULT 'reading',
  started_at      date,
  finished_at     date,

  current_chapter text,
  current_page    integer,

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_library_user_book UNIQUE (user_id, book_id)
);

CREATE INDEX IF NOT EXISTS idx_library_books_user ON library_books(user_id);
CREATE INDEX IF NOT EXISTS idx_library_books_book ON library_books(book_id);

DROP TRIGGER IF EXISTS trg_library_books_updated_at ON library_books;
CREATE TRIGGER trg_library_books_updated_at
BEFORE UPDATE ON library_books
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- 7) words (canonical tokens)
-- ============================================================
CREATE TABLE IF NOT EXISTS words (
  word_id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text          text NOT NULL,            -- e.g., "melancholy"
  lemma         text,                     -- optional normalized form
  language_code text NOT NULL DEFAULT 'en',
  created_at    timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_word_language_text UNIQUE (language_code, text)
);

CREATE INDEX IF NOT EXISTS idx_words_lemma ON words(language_code, lemma);

-- ============================================================
-- 8) dictionary_senses (definition options)
-- ============================================================
CREATE TABLE IF NOT EXISTS dictionary_senses (
  sense_id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word_id        uuid NOT NULL REFERENCES words(word_id) ON DELETE CASCADE,

  provider       dict_provider NOT NULL,
  provider_ref   text,           -- provider ID if available (nullable)

  part_of_speech text,
  definition     text NOT NULL,
  example        text,
  synonyms       text[],
  sense_rank     integer,

  created_at     timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_provider_ref UNIQUE (provider, provider_ref)
);

CREATE INDEX IF NOT EXISTS idx_senses_word ON dictionary_senses(word_id);
CREATE INDEX IF NOT EXISTS idx_senses_provider ON dictionary_senses(provider);

-- ============================================================
-- 9) book_saved_words (user's saved words per library book, SRS state)
-- ============================================================
CREATE TABLE IF NOT EXISTS book_saved_words (
  saved_word_id     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  library_book_id   uuid NOT NULL REFERENCES library_books(library_book_id) ON DELETE CASCADE,
  word_id           uuid NOT NULL REFERENCES words(word_id) ON DELETE CASCADE,
  chosen_sense_id   uuid REFERENCES dictionary_senses(sense_id) ON DELETE SET NULL,
  page_number       integer,
  chapter           text,
  context_snippet   text,
  saved_at          timestamptz NOT NULL DEFAULT now(),
  is_archived       boolean NOT NULL DEFAULT false,
  mastery_level     smallint NOT NULL DEFAULT 0,
  last_reviewed_at  timestamptz,
  next_review_at    timestamptz,
  interval_days     integer NOT NULL DEFAULT 1,
  ease_factor       real NOT NULL DEFAULT 2.3,
  saved_definition  text,
  saved_part_of_speech text,
  saved_example     text,
  saved_audio_url   text,
  CONSTRAINT uq_saved_word UNIQUE (user_id, library_book_id, word_id)
);

CREATE INDEX IF NOT EXISTS idx_book_saved_words_user ON book_saved_words(user_id);
CREATE INDEX IF NOT EXISTS idx_book_saved_words_library_book ON book_saved_words(library_book_id);
CREATE INDEX IF NOT EXISTS idx_book_saved_words_next_review
  ON book_saved_words(user_id, next_review_at)
  WHERE next_review_at IS NOT NULL AND is_archived = false;

-- ============================================================
-- 10) word_lookups (every lookup attempt)
-- ============================================================
CREATE TABLE IF NOT EXISTS word_lookups (
  lookup_id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

  query_text       text NOT NULL,
  word_id          uuid REFERENCES words(word_id) ON DELETE SET NULL,
  library_book_id  uuid REFERENCES library_books(library_book_id) ON DELETE SET NULL,

  looked_up_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lookups_user_time ON word_lookups(user_id, looked_up_at DESC);
CREATE INDEX IF NOT EXISTS idx_lookups_word ON word_lookups(word_id);

-- ============================================================
-- 11) word_reviews (review event log)
-- ============================================================
CREATE TABLE IF NOT EXISTS word_reviews (
  review_id     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  saved_word_id uuid NOT NULL REFERENCES book_saved_words(saved_word_id) ON DELETE CASCADE,

  mode          review_mode NOT NULL DEFAULT 'srs',
  outcome       review_outcome NOT NULL,

  reviewed_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_saved_word_time
  ON word_reviews(saved_word_id, reviewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_mode_time
  ON word_reviews(mode, reviewed_at DESC);

