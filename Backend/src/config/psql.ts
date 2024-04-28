import { Pool } from 'pg';
const pgPort = process.env.PG_PORT || '';
function pgConnection(): void {
  const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(pgPort),
  });

  pool.connect()
    .then(() => {
      console.log('Connected to PostgreSQL');
    })
    .catch((error:string) => {
      console.error('PostgreSQL connection error:\n', error);
    });
}

export { pgConnection };