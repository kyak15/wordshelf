// ============================================================
// Enums
// ============================================================

export type ReadingStatus =
  | "planned"
  | "reading"
  | "paused"
  | "finished"
  | "abandoned";

export type DictProvider =
  | "wordnik"
  | "oxford"
  | "merriam_webster"
  | "wiktionary"
  | "custom";

export type ReviewOutcome = "again" | "hard" | "good" | "easy";

export type ReviewMode = "srs" | "practice";

export type AuthProvider = "google" | "apple" | "email";

// ============================================================
// User
// ============================================================

export interface User {
  user_id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Books & Library
// ============================================================

export interface Book {
  book_id: string;
  title: string;
  author: string | null;
  isbn13: string | null;
  cover_image_url: string | null;
  language_code: string;
  created_at: string;
}

export interface LibraryBook {
  library_book_id: string;
  user_id: string;
  book_id: string;
  status: ReadingStatus;
  started_at: string | null;
  finished_at: string | null;
  current_chapter: string | null;
  current_page: number | null;
  created_at: string;
  updated_at: string;
}

export interface LibraryBookWithDetails extends LibraryBook {
  book: Book;
}

// ============================================================
// Words & Dictionary
// ============================================================

export interface Word {
  word_id: string;
  text: string;
  lemma: string | null;
  language_code: string;
  created_at: string;
}

export interface DictionarySense {
  sense_id: string;
  word_id: string;
  provider: DictProvider;
  provider_ref: string | null;
  part_of_speech: string | null;
  definition: string;
  example: string | null;
  synonyms: string[] | null;
  sense_rank: number | null;
  created_at: string;
}

// ============================================================
// Saved Words (User's vocabulary)
// ============================================================

export interface SavedWord {
  saved_word_id: string;
  user_id: string;
  library_book_id: string;
  word_id: string;
  chosen_sense_id: string | null;
  page_number: number | null;
  chapter: string | null;
  context_snippet: string | null;
  saved_at: string;
  is_archived: boolean;
  mastery_level: number;
  last_reviewed_at: string | null;
  next_review_at: string | null;
  interval_days: number;
  ease_factor: number;
  saved_definition: string | null;
  saved_part_of_speech: string | null;
  saved_example: string | null;
  saved_audio_url: string | null;
}

export interface SavedWordWithDetails extends SavedWord {
  word: Word;
  book?: Book;
  library_book?: LibraryBook;
  chosen_sense?: DictionarySense;
}

// ============================================================
// Reviews (Flashcard history)
// ============================================================

export interface WordReview {
  review_id: string;
  saved_word_id: string;
  mode: ReviewMode;
  outcome: ReviewOutcome;
  reviewed_at: string;
}

// ============================================================
// Word Lookups
// ============================================================

export interface WordLookup {
  lookup_id: string;
  user_id: string;
  query_text: string;
  word_id: string | null;
  library_book_id: string | null;
  looked_up_at: string;
}

// ============================================================
// Input Types (for creating/updating)
// ============================================================

// --- Books ---

export interface CreateBookInput {
  title: string;
  author?: string;
  isbn13?: string;
  cover_image_url?: string;
  language_code: string;
}

// --- Library Books ---

export interface UpdateLibraryBookInput {
  status?: ReadingStatus;
  started_at?: string;
  finished_at?: string;
  current_chapter?: string;
  current_page?: number;
}

// --- Words ---

export interface CreateWordInput {
  library_book_id: string;
  text: string;
  language_code?: string;
  chosen_sense_id?: string;
  page_number?: number;
  chapter?: string;
  context_snippet?: string;
  saved_definition?: string;
  saved_part_of_speech?: string;
  saved_example?: string;
  saved_audio_url?: string;
}

export interface UpdateWordInput {
  library_book_id: string;
  chosen_sense_id?: string;
  page_number?: number;
  chapter?: string;
  context_snippet?: string;
  is_archived?: boolean;
  saved_definition?: string;
  saved_part_of_speech?: string;
  saved_example?: string;
  saved_audio_url?: string;
}

// --- Reviews ---

export interface SubmitReviewInput {
  quality: number; // 0-5 (SM-2 scale)
}
