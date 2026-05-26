// Store typings here, should be minimal  
import type { FastifyRedis } from '@fastify/redis';

// Extend fastify to include Redis client
declare module 'fastify' {
  interface FastifyInstance {
    redis: FastifyRedis;
  }
}