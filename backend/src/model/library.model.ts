export type ReadingStatus =
  | "planned"
  | "reading"
  | "paused"
  | "finished"
  | "abandoned";

/** Book metadata (from books table) */
export interface Book {
  book_id: string;
  title: string;
  author: string | null;
  isbn13: string | null;
  cover_image_url: string | null;
  language_code: string;
  created_at: Date;
}

/** User's library entry (from library_books table) */
export interface LibraryBook {
  library_book_id: string;
  user_id: string;
  book_id: string;
  status: ReadingStatus;
  started_at: Date | null;
  finished_at: Date | null;
  current_chapter: string | null;
  current_page: number | null;
  created_at: Date;
  updated_at: Date;
}
export interface LibraryBookRow {
  library_book_id: string;
  user_id: string;
  book_id: string;
  status: ReadingStatus;
  started_at: Date | null;
  finished_at: Date | null;
  current_chapter: string | null;
  current_page: number | null;
  created_at: Date;
  updated_at: Date;
  title: string;
  author: string | null;
  isbn13: string | null;
  cover_image_url: string | null;
  language_code: string;
  book_created_at: Date;
}

/** Combined view for API responses */
export interface LibraryBookWithDetails extends LibraryBook {
  book: Book;
}
