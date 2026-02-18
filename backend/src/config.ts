import 'dotenv/config';

export const config = {
  ADMIN_PORT: parseInt(process.env.ADMIN_PORT ?? '3000'),
  PUBLIC_PORT: parseInt(process.env.PUBLIC_PORT ?? '8080'),
  DB_PATH: process.env.DB_PATH ?? './.data/db.sqlite',
  STORAGE_PATH: process.env.STORAGE_PATH ?? '/root/storage',
} as const;

export default config;
