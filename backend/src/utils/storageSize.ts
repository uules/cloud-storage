import fs from 'fs-extra';
import path from 'path';

export async function getStorageSize(dirPath: string): Promise<number> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  const sizes = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        return getStorageSize(entryPath);
      }
      const stat = await fs.stat(entryPath);
      return stat.size;
    }),
  );

  return sizes.reduce((acc, size) => acc + size, 0);
}
