import { db } from 'database';

export interface Share {
  id: number;
  created_at: string;
  token: string;
  label: string;
  expires_at: string;
  revoked: boolean;
}

export function createShare(
  label: string,
  expiresAt: string,
  token: string,
): Share {
  const stmt = db.prepare(`
    INSERT INTO shares (token, label, expires_at)
    VALUES (@token, @label, @expiresAt)
    RETURNING *
  `);
  return stmt.get({ token, label, expiresAt }) as Share;
}

export function getAllShares(): Share[] {
  const result = db
    .prepare('SELECT * FROM shares ORDER BY created_at DESC')
    .all();
  return result as Share[];
}

export function getShareByToken(token: string): Share | undefined {
  const result = db.prepare('SELECT * FROM shares WHERE token = ?').get(token);
  return result as Share | undefined;
}

export function revokeShare(id: number): boolean {
  const result = db
    .prepare('UPDATE shares SET revoked = TRUE WHERE id = ?')
    .run(id);
  return result.changes > 0;
}

export function isShareValid(share: Share): boolean {
  if (share.revoked) return false;
  else return new Date(share.expires_at) > new Date();
}
