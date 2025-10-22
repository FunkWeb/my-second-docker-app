import {Pool} from 'pg';

const DATABASE_URL = "postgresql://postgres:1234@localhost:5432/docker";

export const postgres = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});
