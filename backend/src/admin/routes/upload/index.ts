import type { FastifyInstance } from 'fastify';
import { uploadFiles } from './handlers';

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', uploadFiles);
}
