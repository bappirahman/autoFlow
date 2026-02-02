import 'dotenv/config';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL || '';

if (!databaseUrl) {
  throw new Error('DATABASE_URL not found in .env');
}

export const pool = new Pool({
  connectionString: databaseUrl,
});

export const drizzleDb: NodePgDatabase<typeof schema> = drizzle({
  client: pool,
  schema,
});

export const DRIZZLE_INJECTION_TOKEN = Symbol('DRIZZLE_INJECTION_TOKEN');
