import fs from 'fs-extra';
import path from 'path'
import config from '@config';

export async function ensureStorage() {
  await fs.ensureDir(config.STORAGE_PATH);
  console.log(`Storage: ${path.resolve(config.STORAGE_PATH)}`);
}
