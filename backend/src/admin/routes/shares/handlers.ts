import type { FastifyRequest, FastifyReply } from 'fastify';
import { CreateShareBody, RevokeShareParams } from './types';
import { v4 as uuidv4 } from 'uuid';
import { createShare, getAllShares, revokeShare } from 'database/shares';

export async function createShareHandler(
  req: FastifyRequest<CreateShareBody>,
  reply: FastifyReply,
) {
  const { label, expiresInDays } = req.body;

  if (!label || !expiresInDays || expiresInDays < 1) {
    return reply.code(400).send({ error: 'label and expiresInDays required' });
  }

  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const share = createShare(label, expiresAt.toISOString(), token);
  return { share };
}

export async function listSharesHandler() {
  return { shares: getAllShares() };
}

export async function revokeShareHandler(
  req: FastifyRequest<RevokeShareParams>,
  reply: FastifyReply,
) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return reply.code(400).send({ error: 'Invalid id' });
  }

  const success = revokeShare(id);

  if (!success) {
    return reply.code(404).send({ error: 'Share not found' });
  }

  return { success: true };
}
