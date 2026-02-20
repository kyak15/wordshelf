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
    const [booksTotal, booksByStatus, wordsAgg, dueCount] = await Promise.all([
      // Total books
      pool.query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM library_books WHERE user_id = $1`,
        [userId],
      ),

      // Books grouped by status
      pool.query<{ status: string; count: string }>(
        `SELECT status, COUNT(*) AS count
         FROM library_books
         WHERE user_id = $1
         GROUP BY status`,
        [userId],
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
        [userId],
      ),

      // Words due for review right now
      pool.query<{ count: string }>(
        `SELECT COUNT(*) AS count
         FROM book_saved_words
         WHERE user_id = $1
           AND is_archived = false
           AND (next_review_at IS NULL OR next_review_at <= NOW())`,
        [userId],
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
    days: number = 30,
  ): Promise<ActivityPoint[]> {
    const res = await pool.query<{ date: string; count: string }>(
      `SELECT
         TO_CHAR(DATE(last_reviewed_at), 'YYYY-MM-DD') AS date,
         COUNT(*) AS count
       FROM book_saved_words
       WHERE user_id = $1
         AND last_reviewed_at IS NOT NULL
         AND last_reviewed_at >= NOW() - ($2 || ' days')::interval
       GROUP BY DATE(last_reviewed_at)
       ORDER BY date ASC`,
      [userId, days],
    );
    return res.rows.map((row) => ({
      date: row.date,
      count: parseInt(row.count, 10),
    }));
  },

  async getWordsActivity(
    userId: string,
    days: number = 30,
  ): Promise<ActivityPoint[]> {
    const res = await pool.query<{ date: string; count: string }>(
      `SELECT
         TO_CHAR(DATE(saved_at), 'YYYY-MM-DD') AS date,
         COUNT(*) AS count
       FROM book_saved_words
       WHERE user_id = $1
         AND saved_at >= NOW() - ($2 || ' days')::interval
       GROUP BY DATE(saved_at)
       ORDER BY date ASC`,
      [userId, days],
    );
    return res.rows.map((row) => ({
      date: row.date,
      count: parseInt(row.count, 10),
    }));
  },

  async getStreak(
    userId: string,
  ): Promise<{ currentStreak: number; longestStreak: number }> {
    // Get all review dates in descending order
    const res = await pool.query<{ review_date: string }>(
      `SELECT DISTINCT TO_CHAR(DATE(last_reviewed_at), 'YYYY-MM-DD') AS review_date
       FROM book_saved_words
       WHERE user_id = $1 AND last_reviewed_at IS NOT NULL
       ORDER BY review_date DESC`,
      [userId],
    );

    if (res.rows.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const dates = res.rows.map((row) => new Date(row.review_date));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate current streak
    let expectedDate = new Date(today);
    for (const date of dates) {
      date.setHours(0, 0, 0, 0);

      if (date.getTime() === expectedDate.getTime()) {
        currentStreak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else if (
        currentStreak === 0 &&
        date.getTime() === expectedDate.getTime() - 86400000
      ) {
        // Allow starting streak from yesterday
        currentStreak++;
        expectedDate = new Date(date);
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate longest streak
    for (let i = 0; i < dates.length; i++) {
      if (i === 0 || dates[i - 1].getTime() - dates[i].getTime() === 86400000) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    return { currentStreak, longestStreak };
  },

  async getTotalReviews(userId: string): Promise<number> {
    const res = await pool.query<{ count: string }>(
      `SELECT COUNT(*) AS count
       FROM book_saved_words
       WHERE user_id = $1 AND last_reviewed_at IS NOT NULL`,
      [userId],
    );
    return parseInt(res.rows[0]?.count ?? "0", 10);
  },

  async getWeeklyReviews(userId: string): Promise<number> {
    const res = await pool.query<{ count: string }>(
      `SELECT COUNT(*) AS count
       FROM book_saved_words
       WHERE user_id = $1
         AND last_reviewed_at IS NOT NULL
         AND last_reviewed_at >= NOW() - INTERVAL '7 days'`,
      [userId],
    );
    return parseInt(res.rows[0]?.count ?? "0", 10);
  },

  async getTotalDaysActive(userId: string): Promise<number> {
    const res = await pool.query<{ count: string }>(
      `SELECT COUNT(DISTINCT DATE(last_reviewed_at)) AS count
       FROM book_saved_words
       WHERE user_id = $1 AND last_reviewed_at IS NOT NULL`,
      [userId],
    );
    return parseInt(res.rows[0]?.count ?? "0", 10);
  },

  async getBooksWithWords(userId: string): Promise<number> {
    const res = await pool.query<{ count: string }>(
      `SELECT COUNT(DISTINCT library_book_id) AS count
       FROM book_saved_words
       WHERE user_id = $1`,
      [userId],
    );
    return parseInt(res.rows[0]?.count ?? "0", 10);
  },
};
