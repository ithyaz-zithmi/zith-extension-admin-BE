import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const sslConfig = process.env.DB_SSL === 'false'
    ? false
    : { rejectUnauthorized: false };

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: sslConfig,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database ✅');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
