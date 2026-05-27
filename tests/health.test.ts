import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app.js';

describe('health routes', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
    console.log('NODE_ENV:', process.env.NODE_ENV, 'redis enabled:', process.env.REDIS_ENABLED)
    console.log('import.meta.env.MODE:', import.meta.env.MODE)
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /healthz returns 200 ok', async () => {
    const res = await app.inject({ method: 'GET', url: '/healthz' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
  });

  it('GET /readyz returns 200 ready', async () => {
    const res = await app.inject({ method: 'GET', url: '/readyz' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ready' });
  });
});
