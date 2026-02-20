import { pool } from "../db";
import { AuthProvider, User, UserIdentity } from "../model/user.model";

export const userService = {
  /**
   * Find user by their identity (provider + provider_user_id).
   * Returns the user if identity exists, null otherwise.
   */
  async findByIdentity(
    provider: AuthProvider,
    providerUserId: string,
  ): Promise<User | null> {
    const res = await pool.query<User>(
      `SELECT u.user_id, u.email, u.display_name, u.created_at, u.updated_at
       FROM users u
       JOIN user_identities ui ON ui.user_id = u.user_id
       WHERE ui.provider = $1 AND ui.provider_user_id = $2`,
      [provider, providerUserId],
    );
    return res.rows[0] ?? null;
  },

  /**
   * Find user by user_id.
   */
  async findById(userId: string): Promise<User | null> {
    const res = await pool.query<User>(
      `SELECT user_id, email, display_name, created_at, updated_at
       FROM users WHERE user_id = $1`,
      [userId],
    );
    return res.rows[0] ?? null;
  },

  /**
   * Find user by email (for email sign-in).
   */
  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase().trim();
    const res = await pool.query<User>(
      `SELECT user_id, email, display_name, created_at, updated_at
       FROM users WHERE LOWER(email) = $1`,
      [normalizedEmail],
    );
    return res.rows[0] ?? null;
  },

  /**
   * Find or create user by identity.
   * - If identity exists, return existing user (and optionally update display_name/email).
   * - If identity doesn't exist but email matches an existing user, link identity to that user.
   * - Otherwise, create new user + identity.
   */
  async findOrCreateByIdentity(
    provider: AuthProvider,
    providerUserId: string,
    data: { email?: string | null; displayName?: string | null },
  ): Promise<User> {
    const normalizedEmail = data.email?.toLowerCase().trim() ?? null;

    // Check if identity already exists
    const existing = await this.findByIdentity(provider, providerUserId);
    if (existing) {
      // Optionally update display_name if provided and user doesn't have one
      if (data.displayName && !existing.display_name) {
        await pool.query(
          `UPDATE users SET display_name = $1 WHERE user_id = $2`,
          [data.displayName, existing.user_id],
        );
        existing.display_name = data.displayName;
      }
      // Update email on user if not set and we have one
      if (normalizedEmail && !existing.email) {
        await pool.query(`UPDATE users SET email = $1 WHERE user_id = $2`, [
          normalizedEmail,
          existing.user_id,
        ]);
        existing.email = normalizedEmail;
      }
      return existing;
    }

    // Identity doesn't exist. Check if email matches an existing user (account linking).
    let user: User | null = null;
    if (normalizedEmail) {
      user = await this.findByEmail(normalizedEmail);
    }

    if (user) {
      // Link this provider identity to existing user
      await pool.query(
        `INSERT INTO user_identities (user_id, provider, provider_user_id, email)
         VALUES ($1, $2, $3, $4)`,
        [user.user_id, provider, providerUserId, normalizedEmail],
      );
      // Update display_name if not set
      if (data.displayName && !user.display_name) {
        await pool.query(
          `UPDATE users SET display_name = $1 WHERE user_id = $2`,
          [data.displayName, user.user_id],
        );
        user.display_name = data.displayName;
      }
      return user;
    }

    // Create new user + identity
    const userRes = await pool.query<User>(
      `INSERT INTO users (email, display_name)
       VALUES ($1, $2)
       RETURNING user_id, email, display_name, created_at, updated_at`,
      [normalizedEmail, data.displayName ?? null],
    );
    user = userRes.rows[0];

    await pool.query(
      `INSERT INTO user_identities (user_id, provider, provider_user_id, email)
       VALUES ($1, $2, $3, $4)`,
      [user.user_id, provider, providerUserId, normalizedEmail],
    );

    return user;
  },

  /**
   * Get all identities for a user.
   */
  async getIdentities(userId: string): Promise<UserIdentity[]> {
    const res = await pool.query<UserIdentity>(
      `SELECT identity_id, user_id, provider, provider_user_id, email, created_at
       FROM user_identities WHERE user_id = $1`,
      [userId],
    );
    return res.rows;
  },
};
