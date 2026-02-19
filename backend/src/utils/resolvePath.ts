import path from 'path';
import config from '@config';

const storageRoot = path.resolve(config.STORAGE_PATH);

export function resolveSafePath(userPath: string): string {
  const resolved = path.resolve(storageRoot, userPath);

  if (
    !resolved.startsWith(storageRoot + path.sep) &&
    resolved !== storageRoot
  ) {
    throw new Error('Access denied: path traversal detected');
  }

  return resolved;
}
