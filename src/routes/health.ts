import type { FastifyInstance } from 'fastify';

// Flipped false on shutdown so readiness fails while in-flight requests drain.
let ready = true;

export function markNotReady(): void {
  ready = false;
}

export default async function healthRoutes(app: FastifyInstance) {
  // Liveness: keep cheap — failure restarts the pod.
  app.get('/healthz', async (_req, reply) => {
    reply.code(200);
    return { status: 'ok' };
  });

  // Readiness: drops from LB on failure without killing the pod.
  app.get('/readyz', async (_req, reply) => {
    if (!ready) {
      reply.code(503);
      return { status: 'shutting down' };
    }
    reply.code(200);
    return { status: 'ready' };
  });
}
