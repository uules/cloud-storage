import Fastify from 'fastify';
import { healthRoutes } from './routes/health';

export async function buildPublicApp() {
  const app = Fastify();

  await app.register(healthRoutes);

  return app;
}
