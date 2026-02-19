import type { FastifyRequest, FastifyReply } from 'fastify';
import type {
  ListFilesQuery,
  DeleteFileBody,
  RenameFileBody,
  MoveFileBody,
} from './types';
import { resolveSafePath } from '@utils';
import config from '@config';
import fs from 'fs-extra';
import path from 'path';

export async function listFiles(
  req: FastifyRequest<ListFilesQuery>,
  reply: FastifyReply,
) {
  const userPath = req.query.path ?? '';
  const resolved = resolveSafePath(userPath);

  if (!(await fs.pathExists(resolved))) {
    return reply.code(404).send({ error: 'Path not found' });
  }

  const stat = await fs.stat(resolved);
  if (!stat.isDirectory()) {
    return reply.code(400).send({ error: 'Path is not a directory' });
  }

  const entries = await fs.readdir(resolved, { withFileTypes: true });

  const items = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(resolved, entry.name);
      const entryStat = await fs.stat(entryPath);
      return {
        name: entry.name,
        type: entry.isDirectory() ? 'directory' : 'file',
        size: entry.isFile() ? entryStat.size : null,
        modified_at: entryStat.mtime.toISOString(),
        path: path.relative(config.STORAGE_PATH, entryPath),
      };
    }),
  );

  return { path: userPath, items };
}

export async function deleteFile(
  req: FastifyRequest<DeleteFileBody>,
  reply: FastifyReply,
) {
  const { path: userPath } = req.body;
  const resolved = resolveSafePath(userPath);

  if (!(await fs.pathExists(resolved))) {
    return reply.code(404).send({ error: 'Path not found' });
  }

  await fs.remove(resolved);
  return { success: true };
}

export async function renameFile(
  req: FastifyRequest<RenameFileBody>,
  reply: FastifyReply,
) {
  const { path: userPath, newName } = req.body;

  if (newName.includes('/') || newName.includes('..')) {
    return reply.code(400).send({ error: 'Invalid name' });
  }

  const resolved = resolveSafePath(userPath);
  const newResolved = path.join(path.dirname(resolved), newName);

  if (!(await fs.pathExists(resolved))) {
    return reply.code(404).send({ error: 'Path not found' });
  }

  if (await fs.pathExists(newResolved)) {
    return reply.code(409).send({ error: 'Name already exists' });
  }

  await fs.move(resolved, newResolved);
  return { success: true };
}

export async function moveFile(
  req: FastifyRequest<MoveFileBody>,
  reply: FastifyReply,
) {
  const { path: userPath, destinationPath } = req.body;

  const resolved = resolveSafePath(userPath);
  const destination = resolveSafePath(destinationPath);
  const finalDestination = path.join(destination, path.basename(resolved));

  if (!(await fs.pathExists(resolved))) {
    return reply.code(404).send({ error: 'Source not found' });
  }

  if (!(await fs.pathExists(destination))) {
    return reply.code(404).send({ error: 'Destination not found' });
  }

  if (await fs.pathExists(finalDestination)) {
    return reply.code(409).send({ error: 'Already exists at destination' });
  }

  await fs.move(resolved, finalDestination);
  return { success: true };
}
