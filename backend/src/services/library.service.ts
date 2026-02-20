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
      [userId],
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
    bookId: string,
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
      [userId, bookId],
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
    },
  ): Promise<LibraryBookWithDetails> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Update any existing "reading" books to "planned" status
      await client.query(
        `UPDATE library_books
         SET status = 'planned', updated_at = NOW()
         WHERE user_id = $1 AND status = 'reading'`,
        [userId],
      );

      // Try to find existing book by ISBN first, or insert new one
      let book_id: string;
      let book_created_at: Date;

      if (book.isbn13) {
        // If ISBN provided, try to find existing book or insert
        const bookRes = await client.query<{
          book_id: string;
          created_at: Date;
        }>(
          `INSERT INTO books (title, author, isbn13, cover_image_url, language_code)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (isbn13) DO UPDATE SET
             title = COALESCE(EXCLUDED.title, books.title),
             author = COALESCE(EXCLUDED.author, books.author),
             cover_image_url = COALESCE(EXCLUDED.cover_image_url, books.cover_image_url)
           RETURNING book_id, created_at`,
          [
            book.title,
            book.author ?? null,
            book.isbn13,
            book.cover_image_url ?? null,
            book.language_code,
          ],
        );
        book_id = bookRes.rows[0].book_id;
        book_created_at = bookRes.rows[0].created_at;
      } else {
        // No ISBN - always create new book (can't deduplicate without ISBN)
        const bookRes = await client.query<{
          book_id: string;
          created_at: Date;
        }>(
          `INSERT INTO books (title, author, isbn13, cover_image_url, language_code)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING book_id, created_at`,
          [
            book.title,
            book.author ?? null,
            null,
            book.cover_image_url ?? null,
            book.language_code,
          ],
        );
        book_id = bookRes.rows[0].book_id;
        book_created_at = bookRes.rows[0].created_at;
      }

      // insert a library_books entry linking the user to this book with "reading" status
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
         VALUES ($1, $2, 'reading')
         RETURNING library_book_id, status, started_at, finished_at, current_chapter, current_page, created_at, updated_at`,
        [userId, book_id],
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
  async getWordsFromBook(userId: string, libraryBookId: string) {
    const res = await pool.query(
      `SELECT
        bsw.saved_word_id,
        bsw.user_id,
        bsw.library_book_id,
        bsw.word_id,
        bsw.chosen_sense_id,
        bsw.page_number,
        bsw.chapter,
        bsw.context_snippet,
        bsw.saved_at,
        bsw.is_archived,
        bsw.mastery_level,
        bsw.last_reviewed_at,
        bsw.next_review_at,
        bsw.interval_days,
        bsw.ease_factor,
        bsw.saved_definition,
        bsw.saved_part_of_speech,
        bsw.saved_example,
        bsw.saved_audio_url,
        w.text,
        w.lemma,
        w.language_code
       FROM book_saved_words bsw
       JOIN words w ON w.word_id = bsw.word_id
       WHERE bsw.user_id = $1 AND bsw.library_book_id = $2
       ORDER BY bsw.saved_at DESC`,
      [userId, libraryBookId],
    );

    return res.rows;
  },

  async updateBook(
    userId: string,
    libraryBookId: string,
    updates: {
      status?: string;
      current_page?: number;
      is_favorite?: boolean;
    },
  ): Promise<LibraryBookWithDetails | null> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const setClauses: string[] = [];
      const values: any[] = [userId, libraryBookId];
      let paramIndex = 3;

      if (updates.status !== undefined) {
        setClauses.push(`status = $${paramIndex}`);
        values.push(updates.status);
        paramIndex++;

        // If setting to "finished", auto-promote most recent "planned" book to "reading"
        if (updates.status === "finished") {
          await client.query(
            `UPDATE library_books
             SET status = 'reading', updated_at = NOW()
             WHERE library_book_id = (
               SELECT library_book_id
               FROM library_books
               WHERE user_id = $1 AND status = 'planned'
               ORDER BY created_at DESC
               LIMIT 1
             )`,
            [userId],
          );
        }

        // If setting current "reading" book to "planned", auto-promote another "planned" book
        if (updates.status === "planned") {
          const currentBook = await client.query(
            `SELECT status FROM library_books WHERE library_book_id = $1`,
            [libraryBookId],
          );

          if (currentBook.rows[0]?.status === "reading") {
            await client.query(
              `UPDATE library_books
               SET status = 'reading', updated_at = NOW()
               WHERE library_book_id = (
                 SELECT library_book_id
                 FROM library_books
                 WHERE user_id = $1 
                   AND status = 'planned' 
                   AND library_book_id != $2
                 ORDER BY created_at DESC
                 LIMIT 1
               )`,
              [userId, libraryBookId],
            );
          }
        }
      }

      if (updates.current_page !== undefined) {
        setClauses.push(`current_page = $${paramIndex}`);
        values.push(updates.current_page);
        paramIndex++;
      }

      if (setClauses.length === 0) {
        await client.query("COMMIT");
        return this.getBookById(userId, libraryBookId);
      }

      setClauses.push(`updated_at = NOW()`);

      const res = await client.query<LibraryBookRow>(
        `UPDATE library_books lb
         SET ${setClauses.join(", ")}
         FROM books b
         WHERE lb.book_id = b.book_id
           AND lb.user_id = $1 
           AND lb.library_book_id = $2
         RETURNING 
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
           b.created_at AS book_created_at`,
        values,
      );

      await client.query("COMMIT");

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
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async deleteBook(userId: string, libraryBookId: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Delete all saved words for this library book first
      await client.query(
        `DELETE FROM book_saved_words
         WHERE user_id = $1 AND library_book_id = $2`,
        [userId, libraryBookId],
      );

      // Delete the library book entry
      const res = await client.query(
        `DELETE FROM library_books
         WHERE user_id = $1 AND library_book_id = $2`,
        [userId, libraryBookId],
      );

      await client.query("COMMIT");
      return (res.rowCount ?? 0) > 0;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async getPromotedBook(
    userId: string,
  ): Promise<LibraryBookWithDetails | null> {
    // Get the current "reading" book (the one that was just promoted)
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
       WHERE lb.user_id = $1 AND lb.status = 'reading'
       LIMIT 1`,
      [userId],
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
};
