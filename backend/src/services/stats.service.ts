import { pool } from "../db";

interface OverviewStats {
  books: {
    total: number;
    by_status: Record<string, number>;
  };
  words: {
    total: number;
    archived: number;
    by_mastery_level: Record<number, number>;
    due_for_review: number;
  };
}

interface ActivityPoint {
  date: string;
  count: number;
}

export const statsService = {
  async getOverview(userId: string): Promise<OverviewStats> {
    // Run all 4 queries in parallel since they're independent
    const [booksTotal, booksByStatus, wordsAgg, dueCount] = await Promise.all([
      // Total books
      pool.query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM library_books WHERE user_id = $1`,
        [userId]
      ),

      // Books grouped by status
      pool.query<{ status: string; count: string }>(
        `SELECT status, COUNT(*) AS count
         FROM library_books
         WHERE user_id = $1
         GROUP BY status`,
        [userId]
      ),

      // Words: total, archived, and by mastery level
      pool.query<{
        total: string;
        archived: string;
        mastery_level: number;
        count: string;
      }>(
        `SELECT
           COUNT(*) AS total,
           COUNT(*) FILTER (WHERE is_archived = true) AS archived,
           mastery_level,
           COUNT(*) AS count
         FROM book_saved_words
         WHERE user_id = $1
         GROUP BY mastery_level`,
        [userId]
      ),

      // Words due for review right now
      pool.query<{ count: string }>(
        `SELECT COUNT(*) AS count
         FROM book_saved_words
         WHERE user_id = $1
           AND is_archived = false
           AND (next_review_at IS NULL OR next_review_at <= NOW())`,
        [userId]
      ),
    ]);

    // Build by_status map
    const by_status: Record<string, number> = {};
    for (const row of booksByStatus.rows) {
      by_status[row.status] = parseInt(row.count, 10);
    }

    // Build by_mastery_level map and compute totals from the grouped rows
    const by_mastery_level: Record<number, number> = {};
    let totalWords = 0;
    let archivedWords = 0;
    for (const row of wordsAgg.rows) {
      by_mastery_level[row.mastery_level] = parseInt(row.count, 10);
      totalWords += parseInt(row.count, 10);
      archivedWords += parseInt(row.archived, 10);
    }

    return {
      books: {
        total: parseInt(booksTotal.rows[0]?.count ?? "0", 10),
        by_status,
      },
      words: {
        total: totalWords,
        archived: archivedWords,
        by_mastery_level,
        due_for_review: parseInt(dueCount.rows[0]?.count ?? "0", 10),
      },
    };
  },

  async getReviewActivity(
    userId: string,
    days: number = 30
  ): Promise<ActivityPoint[]> {
    const res = await pool.query<ActivityPoint>(
      `SELECT
         DATE(last_reviewed_at) AS date,
         COUNT(*) AS count
       FROM book_saved_words
       WHERE user_id = $1
         AND last_reviewed_at IS NOT NULL
         AND last_reviewed_at >= NOW() - ($2 || ' days')::interval
       GROUP BY DATE(last_reviewed_at)
       ORDER BY date ASC`,
      [userId, days]
    );
    return res.rows;
  },

  async getWordsActivity(
    userId: string,
    days: number = 30
  ): Promise<ActivityPoint[]> {
    const res = await pool.query<ActivityPoint>(
      `SELECT
         DATE(saved_at) AS date,
         COUNT(*) AS count
       FROM book_saved_words
       WHERE user_id = $1
         AND saved_at >= NOW() - ($2 || ' days')::interval
       GROUP BY DATE(saved_at)
       ORDER BY date ASC`,
      [userId, days]
    );
    return res.rows;
  },
};
