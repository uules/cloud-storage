import config from '@config';
import archiver from 'archiver';
import { getShareByToken, isShareValid } from 'database/shares';
import type { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs-extra';
import path from 'path';

interface DownloadParams {
  Params: { token: string };
}

export async function downloadHandler(
  req: FastifyRequest<DownloadParams>,
  reply: FastifyReply,
) {
  const { token } = req.params;
  const share = getShareByToken(token);

  if (!share || !isShareValid(share)) {
    return reply.code(404).send({ error: 'Link not found or expired' });
  }

  if (!(await fs.pathExists(config.STORAGE_PATH))) {
    return reply.code(404).send({ error: 'Storage no found' });
  }

  const stat = await fs.stat(config.STORAGE_PATH);

  if (stat.isFile()) {
    const filename = path.basename(config.STORAGE_PATH);
    reply.header('Content-Disposition', `attachment; filename="${filename}"`);
    return reply.send(fs.createReadStream(config.STORAGE_PATH));
  }

  reply.raw.setHeader('Content-Type', 'application/zip');
  reply.raw.setHeader(
    'Content-Disposition',
    `attachment; filename="storage.zip"`,
  );

  const archive = archiver('zip', { zlib: { level: 5 } });

  archive.on('error', (err) => {
    req.log.error(err);
    reply.raw.end();
  });

  archive.pipe(reply.raw);
  archive.directory(config.STORAGE_PATH, false);
  await archive.finalize();
}
