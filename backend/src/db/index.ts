import { Pool } from "pg";
import { env } from "../config/env";

// replace connectionString when deploying
const pool = new Pool({
  connectionString: env.db.connectionString,
});

export { pool };

export async function testConnection(): Promise<boolean> {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT 1");
    return res.rowCount === 1;
  } finally {
    client.release();
  }
}
