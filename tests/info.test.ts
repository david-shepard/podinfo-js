// need this so the IDE knows about the vite client types
/// <reference types="vite/client" />
import { describe, it, expect, afterAll, beforeAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.js";
import defineConfig from "../vitest.config.js";

describe("info route", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    // process.env["SECRETS_DIR"] = join(__dirname, "../../..", "secrets");
    if (defineConfig?.test?.env) {
      defineConfig.test.env['SECRETS_DIR'] = './secrets';
    }
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET / returns expected fields", async () => {
    const res = await app.inject({ method: "GET", url: "/" });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toMatchObject({
      hostname: expect.any(String),
      version: expect.any(String),
      uptime: expect.any(Number),
      nodeVersion: expect.any(String),
      mountedSecrets: expect.any(Array),
    });
    // TODO: inject secrets as part of integration test & verify in later test
    // workaround since we don't care about order
    // expect(new Set(body.mountedSecrets)).toEqual(
    //   new Set(["api-key", "db_pass"]),
    // );
  });
});
