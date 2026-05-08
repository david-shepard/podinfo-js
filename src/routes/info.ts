import type { FastifyInstance } from 'fastify';
import { hostname } from 'node:os';
import { config } from '../config.js';
import { listSecretNames } from '../secrets.js';

export default async function infoRoutes(app: FastifyInstance) {
  app.get('/', async () => ({
    hostname: hostname(),
    version: config.version,
    message: config.message,
    uptime: process.uptime(),
    nodeVersion: process.version,
    mountedSecrets: listSecretNames(),
  }));
}
