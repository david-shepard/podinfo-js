import Fastify, { type FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
// TODO: uncomment out when prometheus support is added
// import fastifyMetrics from 'fastify-metrics';
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { config } from "./config.js";
import infoRoutes from "./routes/info.js";
import healthRoutes from "./routes/health.js";
import chaosRoutes from "./routes/chaos.js";

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

  await app.register(infoRoutes);
  await app.register(healthRoutes);
  await app.register(chaosRoutes);

  return app;
}
