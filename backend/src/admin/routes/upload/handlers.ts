import type { FastifyRequest, FastifyReply } from 'fastify';
import type { MultipartFile } from '@fastify/multipart';
import fs from 'fs-extra';
import path from 'path';
import { resolveSafePath, getStorageSize } from '@utils';
import config from '@config';
import type { UploadQuery } from './types';

export async function uploadFiles(
  req: FastifyRequest<UploadQuery>,
  reply: FastifyReply,
) {
  const destinationPath = req.query.destinationPath ?? '';

  reply.raw.setHeader('Content-Type', 'text/event-stream');
  reply.raw.setHeader('Cache-Control', 'no-cache');
  reply.raw.setHeader('Connection', 'keep-alive');
  reply.raw.flushHeaders();

  const sendEvent = (data: object) => {
    reply.raw.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const parts = req.parts();
    const saved: string[] = [];

    for await (const part of parts) {
      if (part.type !== 'file') continue;

      const file = part as MultipartFile;

      const relativePath = file.filename;
      const destination = resolveSafePath(
        path.join(destinationPath, relativePath),
      );

      const currentSize = await getStorageSize(config.STORAGE_PATH);
      if (currentSize >= config.STORAGE_LIMIT) {
        sendEvent({ error: 'Storage limit reached' });
        reply.raw.end();
        return;
      }

      await fs.ensureDir(path.dirname(destination));
      await fs.writeFile(destination, await file.toBuffer());

      saved.push(relativePath);
      sendEvent({ saved: relativePath, total: saved.length });
    }

    sendEvent({ done: true, total: saved.length });
  } catch (err) {
    sendEvent({ error: 'Upload failed' });
  }

  reply.raw.end();
}
