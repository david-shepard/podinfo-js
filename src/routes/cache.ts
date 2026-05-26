import type { FastifyInstance } from 'fastify';
// import type { RouteGenericInterface, RouteShorthandMethod } from 'fastify';

// interface CacheSetRequest extends RouteShorthandMethod {
//     Body: {
//         key: string;
//         value: string;
//     };
//     Reply: {
//         message: string;
//     };
// }

// Cache routes for testing caching behavior.   
export default async function cacheRoutes(app: FastifyInstance) {

  app.get<{ Params: { key: string } }>('/cache/:key', async (req) => {
    const value = await app.redis.get(req.params.key);
    return { key: req.params.key, value };
  });

  app.post('/cache', async (req) => {
    const { key, value } = req.body as { key: string; value: string };
    await app.redis.set(key, value);
    return { status: 'ok' };
  });

}
