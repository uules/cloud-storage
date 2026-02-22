import type { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/ping', async () => ({
    server: 'public',
    status: 'ok',
  }));
}
