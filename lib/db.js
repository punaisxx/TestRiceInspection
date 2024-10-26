import { Pool } from 'pg';

const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        port: 5432,
      });

export default async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}