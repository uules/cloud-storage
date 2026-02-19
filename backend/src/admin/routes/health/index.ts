import type { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/ping', async () => ({
    server: 'admin',
    status: 'ok',
  }));
}
