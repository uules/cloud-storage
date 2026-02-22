import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import config from '@config';
import { healthRoutes } from './routes/health';
import { filesRoutes } from './routes/files';
import { uploadRoutes } from './routes/upload';
import { sharesRoutes } from './routes/shares';

export async function buildAdminApp() {
  const app = Fastify({ logger: false });

  await app.register(multipart, {
    limits: {
      fileSize: config.STORAGE_LIMIT,
    },
  });

  await app.register(healthRoutes);
  await app.register(filesRoutes);
  await app.register(uploadRoutes);
  await app.register(sharesRoutes);

  return app;
}
