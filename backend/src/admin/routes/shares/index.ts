import type { FastifyInstance } from 'fastify';
import {
  createShareHandler,
  listSharesHandler,
  revokeShareHandler,
} from './handlers';

export async function sharesRoutes(app: FastifyInstance) {
  app.post('/shares', createShareHandler);
  app.get('/shares', listSharesHandler);
  app.delete('/shares/:id', revokeShareHandler);
}
