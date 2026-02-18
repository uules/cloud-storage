import Fastify from 'fastify'
import { healthRoutes } from './routes'

export async function buildAdminApp() {
  const app = Fastify()

  await app.register(healthRoutes)

  return app
}