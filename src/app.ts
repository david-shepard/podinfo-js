import Fastify, { type FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
import fastifyRedis from '@fastify/redis';
// TODO: uncomment out when prometheus support is added
// import fastifyMetrics from 'fastify-metrics';
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { config } from "./config.js";
import infoRoutes from "./routes/info.js";
import healthRoutes from "./routes/health.js";
import chaosRoutes from "./routes/chaos.js";
import cacheRoutes from "./routes/cache.js";

// ESM doesn't have __dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

// Returns a configured Fastify instance without calling .listen() — keeps it testable via app.inject().
export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: { level: config.logLevel },
    trustProxy: true, // without this, req.ip is the proxy's IP
  });
  console.log("log level:", config.logLevel);
  app.log.debug(`config ${JSON.stringify(config, null, 2)}`);

  // Prometheus metrics — exposes /metrics with default Node.js
  // TODO: add prometheus metrics
  // await app.register(fastifyMetrics, {
  //   endpoint: '/metrics',
  // });

  // public/ is one level up from dist/
  await app.register(fastifyStatic, {
    root: join(__dirname, "..", "public"),
    prefix: "/ui/",
  });
// src/app.ts — one register() call


  if (config.redisEnabled) {
    await app.register(fastifyRedis, {
      ...config.redisParams,
      closeClient: true,  // close on app.close() — clean shutdown
    });
    await app.register(cacheRoutes);
  }

  await app.register(infoRoutes);
  await app.register(healthRoutes);
  await app.register(chaosRoutes);

  // await app.register((instance, opts, done) => {
  //   instance.get('/plugin', (request, reply) => {
  //     console.log('opts:', opts, request.query)
  //     // console.log('request:', request)
  //     reply.send({ hello: 'world', ...opts })
  //   })

  //   done()
  // })

  return app;
}
