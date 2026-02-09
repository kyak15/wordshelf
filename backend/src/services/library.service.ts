import { pool } from "../db";
import {
  LibraryBookRow,
  LibraryBookWithDetails,
  ReadingStatus,
} from "../model/library.model";

export const libraryService = {
  async getAllBooks(userId: string): Promise<LibraryBookWithDetails[]> {
    const res = await pool.query<LibraryBookRow>(
      `SELECT 
        lb.library_book_id,
        lb.user_id,
        lb.book_id,
        lb.status,
        lb.started_at,
        lb.finished_at,
        lb.current_chapter,
        lb.current_page,
        lb.created_at,
        lb.updated_at,
        b.title,
        b.author,
        b.isbn13,
        b.cover_image_url,
        b.language_code,
        b.created_at AS book_created_at
       FROM library_books lb
       JOIN books b ON b.book_id = lb.book_id
       WHERE lb.user_id = $1
       ORDER BY lb.updated_at DESC`,
      [userId]
    );

    return res.rows.map((row) => ({
      library_book_id: row.library_book_id,
      user_id: row.user_id,
      book_id: row.book_id,
      status: row.status,
      started_at: row.started_at,
      finished_at: row.finished_at,
      current_chapter: row.current_chapter,
      current_page: row.current_page,
      created_at: row.created_at,
      updated_at: row.updated_at,
      book: {
        book_id: row.book_id,
        title: row.title,
        author: row.author,
        isbn13: row.isbn13,
        cover_image_url: row.cover_image_url,
        language_code: row.language_code,
        created_at: row.book_created_at,
      },
    }));
  },

  async getBookById(
    userId: string,
    bookId: string
  ): Promise<LibraryBookWithDetails | null> {
    const res = await pool.query<LibraryBookRow>(
      `SELECT 
        lb.library_book_id,
        lb.user_id,
        lb.book_id,
        lb.status,
        lb.started_at,
        lb.finished_at,
        lb.current_chapter,
        lb.current_page,
        lb.created_at,
        lb.updated_at,
        b.title,
        b.author,
        b.isbn13,
        b.cover_image_url,
        b.language_code,
        b.created_at AS book_created_at
       FROM library_books lb
       JOIN books b ON b.book_id = lb.book_id
       WHERE lb.user_id = $1 AND lb.library_book_id = $2`,
      [userId, bookId]
    );

    if (res.rows.length === 0) {
      return null;
    }

    const row = res.rows[0];
    return {
      library_book_id: row.library_book_id,
      user_id: row.user_id,
      book_id: row.book_id,
      status: row.status,
      started_at: row.started_at,
      finished_at: row.finished_at,
      current_chapter: row.current_chapter,
      current_page: row.current_page,
      created_at: row.created_at,
      updated_at: row.updated_at,
      book: {
        book_id: row.book_id,
        title: row.title,
        author: row.author,
        isbn13: row.isbn13,
        cover_image_url: row.cover_image_url,
        language_code: row.language_code,
        created_at: row.book_created_at,
      },
    };
  },
  async addNewBook(
    userId: string,
    book: {
      title: string;
      author?: string;
      isbn13?: string;
      cover_image_url?: string;
      language_code: string;
    }
  ): Promise<LibraryBookWithDetails> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // insert the book into the books table
      const bookRes = await client.query<{ book_id: string; created_at: Date }>(
        `INSERT INTO books (title, author, isbn13, cover_image_url, language_code)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING book_id, created_at`,
        [
          book.title,
          book.author ?? null,
          book.isbn13 ?? null,
          book.cover_image_url ?? null,
          book.language_code,
        ]
      );

      const { book_id, created_at: book_created_at } = bookRes.rows[0];

      // insert a library_books entry linking the user to this book
      const libraryRes = await client.query<{
        library_book_id: string;
        status: ReadingStatus;
        started_at: Date | null;
        finished_at: Date | null;
        current_chapter: string | null;
        current_page: number | null;
        created_at: Date;
        updated_at: Date;
      }>(
        `INSERT INTO library_books (user_id, book_id, status)
         VALUES ($1, $2, 'planned')
         RETURNING library_book_id, status, started_at, finished_at, current_chapter, current_page, created_at, updated_at`,
        [userId, book_id]
      );

      await client.query("COMMIT");

      const lb = libraryRes.rows[0];
      return {
        library_book_id: lb.library_book_id,
        user_id: userId,
        book_id,
        status: lb.status,
        started_at: lb.started_at,
        finished_at: lb.finished_at,
        current_chapter: lb.current_chapter,
        current_page: lb.current_page,
        created_at: lb.created_at,
        updated_at: lb.updated_at,
        book: {
          book_id,
          title: book.title,
          author: book.author ?? null,
          isbn13: book.isbn13 ?? null,
          cover_image_url: book.cover_image_url ?? null,
          language_code: book.language_code,
          created_at: book_created_at,
        },
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};
