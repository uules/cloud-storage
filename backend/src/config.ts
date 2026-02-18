import 'dotenv/config';

export const config = {
  ADMIN_PORT: parseInt(process.env.ADMIN_PORT ?? '3000'),
  PUBLIC_PORT: parseInt(process.env.PUBLIC_PORT ?? '8080'),
} as const;

export default config;
