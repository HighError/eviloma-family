/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? '',
});

const db = drizzle(pool);

async function main() {
  console.log('migration started...');
  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('migration finished');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
