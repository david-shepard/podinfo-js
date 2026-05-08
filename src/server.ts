import closeWithGrace from 'close-with-grace';
import { buildApp } from './app.js';
import { config } from './config.js';
import { markNotReady } from './routes/health.js';

const app = await buildApp();

// close-with-grace handles SIGTERM / SIGINT and uncaught errors,
// and gives us a callback where we control the shutdown order.
// The 10s grace period should comfortably fit inside the K8s
// default terminationGracePeriodSeconds (30s).
closeWithGrace({ delay: 10_000 }, async ({ signal, err }) => {
  if (err) app.log.error({ err }, 'shutting down due to error');
  else app.log.info({ signal }, 'shutting down');

  // Step 1: flip readiness OFF so the LB stops sending traffic.
  // Liveness keeps passing — we don't want to be killed yet.
  markNotReady();

  // Step 2: let any in-flight requests finish, then close the
  // server. Fastify's close() drains gracefully.
  await app.close();
});

await app.listen({ port: config.port, host: config.host });
