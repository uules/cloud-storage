import { buildAdminApp } from 'admin/app';
import { buildPublicApp } from 'public/app';
import config from '@config';
import { runMigrations } from 'database/migrate';
import { ensureStorage } from '@utils';

const start = async () => {
  try {
    runMigrations();
    await ensureStorage()

    const adminApp = await buildAdminApp();
    await adminApp.listen({ port: config.ADMIN_PORT, host: 'localhost' });
    console.log(`Admin server:  http://127.0.0.1:${config.ADMIN_PORT}`);

    const publicApp = await buildPublicApp();
    await publicApp.listen({ port: config.PUBLIC_PORT, host: '0.0.0.0' });
    console.log(`Public server: http://0.0.0.0:${config.PUBLIC_PORT}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
