import {Pool} from 'pg';

const DATABASE_URL =  process.env.DATABASE_URL;

export const postgres = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});
