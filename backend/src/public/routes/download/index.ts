import type { FastifyInstance } from 'fastify';
import { downloadHandler } from './handlers';

export async function downloadRoutes(app: FastifyInstance) {
  app.get('/s/:token', downloadHandler);
}
