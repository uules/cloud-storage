import path from 'path';
import config from '../config';

export function resolveSafePath(userPath: string): string {
  const normalized = path.normalize(userPath);
  const resolved = path.resolve(config.STORAGE_PATH, normalized);

  if (!resolved.startsWith(config.STORAGE_PATH)) {
    throw new Error('Access denied: path traversal detected');
  }

  return resolved;
}
