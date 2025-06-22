import type { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from 'mysql2/promise';

interface ActivityRow {
  created_at: string;
  total_users: number;
  inactive_users: number;
  active_users90d: number;
  active_users60d: number;
  active_users14d: number;
  active_users7d: number;
  active_users3d: number;
  active_users2d: number;
  active_users1d: number;
}

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ActivityRow[] | { error: string }>
) {
  try {
    const [rows] = await pool.query<ActivityRow[]>(
      `SELECT
         created_at,
         total_users,
         inactive_users,
         active_users90d,
         active_users60d,
         active_users14d,
         active_users7d,
         active_users3d,
         active_users2d,
         active_users1d
       FROM activity_statistics_entity
       ORDER BY created_at ASC`
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}