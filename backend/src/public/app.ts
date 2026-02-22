import Fastify from 'fastify';
import { healthRoutes } from './routes/health';
import { downloadRoutes } from './routes/download';

export async function buildPublicApp() {
  const app = Fastify();

  await app.register(healthRoutes);
  await app.register(downloadRoutes);

  return app;
}
