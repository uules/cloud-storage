import 'dotenv/config';

const config = {
  ADMIN_PORT: parseInt(process.env.ADMIN_PORT ?? '3000'),
  PUBLIC_PORT: parseInt(process.env.PUBLIC_PORT ?? '8080'),
  DB_PATH: process.env.DB_PATH ?? '.data/db.sqlite',
  STORAGE_PATH: process.env.STORAGE_PATH ?? '.storage',
  STORAGE_LIMIT: parseFloat(process.env.STORAGE_LIMIT_GB ?? '5') * 1024 ** 3
} as const;

export default config;
