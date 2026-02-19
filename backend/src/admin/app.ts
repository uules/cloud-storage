import Fastify from 'fastify'
import { healthRoutes } from './routes/health'
import { filesRoutes } from './routes/files'

export async function buildAdminApp() {
  const app = Fastify()

  await app.register(healthRoutes)
  await app.register(filesRoutes)

  return app
}