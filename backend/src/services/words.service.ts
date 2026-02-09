import { pool } from "../db";
import { SavedWordRow } from "../model/words.model";

const SAVED_WORD_SELECT = `
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
  w.language_code`;

const SAVED_WORD_FROM = `
  FROM book_saved_words bsw
  JOIN words w ON w.word_id = bsw.word_id`;

export const wordsService = {
  async getAllWords(
    userId: string,
    filters?: {
      library_book_id?: string;
      is_archived?: boolean;
      mastery_level?: number;
      search?: string;
    }
  ): Promise<SavedWordRow[]> {
    let query = `SELECT ${SAVED_WORD_SELECT} ${SAVED_WORD_FROM} WHERE bsw.user_id = $1`;
    const params: unknown[] = [userId];
    let paramIndex = 2;

    if (filters?.library_book_id) {
      query += ` AND bsw.library_book_id = $${paramIndex}`;
      params.push(filters.library_book_id);
      paramIndex++;
    }

    if (filters?.is_archived !== undefined) {
      query += ` AND bsw.is_archived = $${paramIndex}`;
      params.push(filters.is_archived);
      paramIndex++;
    }

    if (filters?.mastery_level !== undefined) {
      query += ` AND bsw.mastery_level = $${paramIndex}`;
      params.push(filters.mastery_level);
      paramIndex++;
    }

    if (filters?.search) {
      query += ` AND (w.text ILIKE $${paramIndex} OR bsw.saved_definition ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    query += ` ORDER BY bsw.saved_at DESC`;

    const res = await pool.query<SavedWordRow>(query, params);
    return res.rows;
  },

  async getDueWords(userId: string): Promise<SavedWordRow[]> {
    const res = await pool.query<SavedWordRow>(
      `SELECT ${SAVED_WORD_SELECT} ${SAVED_WORD_FROM}
       WHERE bsw.user_id = $1
         AND bsw.is_archived = false
         AND (bsw.next_review_at IS NULL OR bsw.next_review_at <= NOW())
       ORDER BY bsw.next_review_at ASC NULLS FIRST`,
      [userId]
    );
    return res.rows;
  },

  async getWordById(
    userId: string,
    savedWordId: string
  ): Promise<SavedWordRow | null> {
    const res = await pool.query<SavedWordRow>(
      `SELECT ${SAVED_WORD_SELECT} ${SAVED_WORD_FROM}
       WHERE bsw.user_id = $1 AND bsw.saved_word_id = $2`,
      [userId, savedWordId]
    );
    return res.rows[0] ?? null;
  },

  /**
   * Save a new word from a book.
   * Finds or creates the word in the words table, then inserts into book_saved_words.
   */
  async addWord(
    userId: string,
    input: {
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
  ): Promise<SavedWordRow> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Find or create the word in the shared words table
      const langCode = input.language_code ?? "en";
      const wordRes = await client.query<{ word_id: string }>(
        `INSERT INTO words (text, language_code)
         VALUES ($1, $2)
         ON CONFLICT (language_code, text) DO UPDATE SET text = EXCLUDED.text
         RETURNING word_id`,
        [input.text, langCode]
      );
      const wordId = wordRes.rows[0].word_id;

      // Insert into book_saved_words
      const savedRes = await client.query<SavedWordRow>(
        `INSERT INTO book_saved_words (
           user_id, library_book_id, word_id, chosen_sense_id,
           page_number, chapter, context_snippet,
           saved_definition, saved_part_of_speech, saved_example, saved_audio_url
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING saved_word_id, user_id, library_book_id, word_id, chosen_sense_id,
                   page_number, chapter, context_snippet, saved_at, is_archived,
                   mastery_level, last_reviewed_at, next_review_at, interval_days, ease_factor,
                   saved_definition, saved_part_of_speech, saved_example, saved_audio_url`,
        [
          userId,
          input.library_book_id,
          wordId,
          input.chosen_sense_id ?? null,
          input.page_number ?? null,
          input.chapter ?? null,
          input.context_snippet ?? null,
          input.saved_definition ?? null,
          input.saved_part_of_speech ?? null,
          input.saved_example ?? null,
          input.saved_audio_url ?? null,
        ]
      );

      await client.query("COMMIT");

      // Attach the word text fields to the result
      const row = savedRes.rows[0];
      return { ...row, text: input.text, lemma: null, language_code: langCode };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async updateWord(
    userId: string,
    savedWordId: string,
    updates: {
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
  ): Promise<SavedWordRow | null> {
    const setClauses: string[] = [];
    const params: unknown[] = [userId, savedWordId];
    let paramIndex = 3;

    const fields: [string, unknown][] = [
      ["chosen_sense_id", updates.chosen_sense_id],
      ["page_number", updates.page_number],
      ["chapter", updates.chapter],
      ["context_snippet", updates.context_snippet],
      ["is_archived", updates.is_archived],
      ["saved_definition", updates.saved_definition],
      ["saved_part_of_speech", updates.saved_part_of_speech],
      ["saved_example", updates.saved_example],
      ["saved_audio_url", updates.saved_audio_url],
    ];

    for (const [column, value] of fields) {
      if (value !== undefined) {
        setClauses.push(`${column} = $${paramIndex}`);
        params.push(value);
        paramIndex++;
      }
    }

    if (setClauses.length === 0) {
      return this.getWordById(userId, savedWordId);
    }

    const res = await pool.query<SavedWordRow>(
      `UPDATE book_saved_words bsw
       SET ${setClauses.join(", ")}
       FROM words w
       WHERE w.word_id = bsw.word_id
         AND bsw.user_id = $1 AND bsw.saved_word_id = $2
       RETURNING ${SAVED_WORD_SELECT}`,
      params
    );
    return res.rows[0] ?? null;
  },

  async deleteWord(userId: string, savedWordId: string): Promise<boolean> {
    const res = await pool.query(
      `DELETE FROM book_saved_words
       WHERE user_id = $1 AND saved_word_id = $2`,
      [userId, savedWordId]
    );
    return (res.rowCount ?? 0) > 0;
  },

  /**
   * Submit a flashcard review result using SM-2 spaced repetition.
   * quality: 0-5 (0-2 = forgot, 3-5 = remembered with varying ease)
   */
  async submitReview(
    userId: string,
    savedWordId: string,
    quality: number
  ): Promise<SavedWordRow | null> {
    // SM-2 algorithm:
    // If quality >= 3 (correct): advance interval
    //   interval_days: 1 -> 3 -> previous * ease_factor
    //   mastery_level: increment (cap at 5)
    // If quality < 3 (incorrect): reset interval to 1, mastery back to 0
    // Ease factor adjusts: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)), min 1.3
    const res = await pool.query<SavedWordRow>(
      `UPDATE book_saved_words bsw
       SET
         mastery_level = CASE
           WHEN $3 >= 3 THEN LEAST(mastery_level + 1, 5)
           ELSE 0
         END,
         interval_days = CASE
           WHEN $3 < 3 THEN 1
           WHEN mastery_level = 0 THEN 1
           WHEN mastery_level = 1 THEN 3
           ELSE GREATEST(ROUND(interval_days * ease_factor)::int, 1)
         END,
         ease_factor = GREATEST(
           ease_factor + (0.1 - (5 - $3) * (0.08 + (5 - $3) * 0.02)),
           1.3
         ),
         last_reviewed_at = NOW(),
         next_review_at = NOW() + (
           CASE
             WHEN $3 < 3 THEN 1
             WHEN mastery_level = 0 THEN 1
             WHEN mastery_level = 1 THEN 3
             ELSE GREATEST(ROUND(interval_days * ease_factor)::int, 1)
           END || ' days'
         )::interval
       FROM words w
       WHERE w.word_id = bsw.word_id
         AND bsw.user_id = $1 AND bsw.saved_word_id = $2
       RETURNING ${SAVED_WORD_SELECT}`,
      [userId, savedWordId, quality]
    );
    return res.rows[0] ?? null;
  },
};
