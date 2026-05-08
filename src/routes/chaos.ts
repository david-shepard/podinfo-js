import type { FastifyInstance } from 'fastify';

// Intentionally misbehaving endpoints for testing retries, alerts, HPA, etc.
export default async function chaosRoutes(app: FastifyInstance) {
  app.get('/error', async (_req, reply) => {
    reply.code(500);
    return { error: 'on purpose' };
  });

  // Tests timeouts and drain behavior.
  app.get<{ Querystring: { ms?: string } }>('/delay', async (req) => {
    const ms = Math.min(Number(req.query.ms ?? 1000), 30_000);
    await new Promise((resolve) => setTimeout(resolve, ms));
    return { delayed: ms };
  });

  // Tests HPA on CPU metrics. A blocked event loop also starves health probes.
  app.get<{ Querystring: { ms?: string } }>('/cpu', async (req) => {
    const duration = Math.min(Number(req.query.ms ?? 1000), 10_000);
    const end = Date.now() + duration;
    while (Date.now() < end) {
      // tight loop, intentionally
    }
    return { burned: duration };
  });

  // Tests pod restart behavior.
  app.get('/panic', async (_req, reply) => {
    reply.code(500).send({ status: 'panicking' });
    // Give the response a tick to flush before we exit.
    setImmediate(() => process.exit(1));
  });
}
