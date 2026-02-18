import Fastify from 'fastify'
import { healthRoutes } from './routes'

export async function buildPublicApp() {
  const app = Fastify()

  await app.register(healthRoutes)

  return app
}