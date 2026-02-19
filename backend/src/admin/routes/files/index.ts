import type { FastifyInstance } from 'fastify';
import { listFiles, deleteFile, renameFile, moveFile } from './handlers';

export async function filesRoutes(app: FastifyInstance) {
  app.get('/files', listFiles);
  app.delete('/files', deleteFile);
  app.patch('/files/rename', renameFile);
  app.patch('/files/move', moveFile);
}
