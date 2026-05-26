# podinfo-js
Small Cloud-native nodejs project inspired by Stefan Prodan's [podinfo](https://github.com/stefanprodan/podinfo) template

## About
This is a bit of a refresher/learning project that shows a tiny nodejs app integrated with Docker/Kubernetes. Intentionally similar to the excellent [podinfo](https://github.com/stefanprodan/podinfo) project/template, just written in NodeJS. In my mind the [podinfo](https://github.com/stefanprodan/podinfo) serves as the prototypical example of building a cloud-native application, so I figured it would act as a solid starting point. Any code reuse will be attributed appropriately.

## Run (local)

**Docker**
1. From this directory, `docker build . -t podinfo-js:latest`
2. `docker run --rm -p 3000:3000 -it podinfo-js:latest`

**Node**
1. `npm install`
2. `npm run dev`

## Testing (local)

**Node**

Run `npm test` (see scripts in [package.json](./package.json))

**Github Actions**

Use [act](https://nektosact.com/usage): `act -W ./github/workflows/ci.yml`

## Routes
Routes are documented below

| Route Path | HTTP Method | Component / File | Purpose | Parameters / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `GET` | Info (`src/routes/info.ts`) | Returns application runtime information such as hostname, version, uptime, node version, a custom message, and list of mounted secrets. | *None* |
| `/healthz` | `GET` | Health (`src/routes/health.ts`) | Cheap liveness probe to verify that the application process is running. | Returns `200 OK` with `{ status: 'ok' }`. |
| `/readyz` | `GET` | Health (`src/routes/health.ts`) | Readiness probe for load balancers. Fails gracefully during graceful shutdowns. | Returns `200 OK` with `{ status: 'ready' }` normally, or `503 Service Unavailable` with `{ status: 'shutting down' }` when shutting down. |
| `/error` | `GET` | Chaos (`src/routes/chaos.ts`) | Returns an intentional internal server error to test error handling, alerts, or retries. | Returns `500 Internal Server Error` with `{ error: 'on purpose' }`. |
| `/delay` | `GET` | Chaos (`src/routes/chaos.ts`) | Simulates network lag or slow responses for testing timeouts and drain behaviors. | **Query parameter**: `ms` (optional, duration in ms; defaults to `1000`, capped at `30000`). |
| `/cpu` | `GET` | Chaos (`src/routes/chaos.ts`) | Intentionally blocks the JavaScript event loop in a tight loop to simulate high CPU load. Used to test Horizontal Pod Autoscaling (HPA). | **Query parameter**: `ms` (optional, duration in ms; defaults to `1000`, capped at `10000`). |
| `/panic` | `GET` | Chaos (`src/routes/chaos.ts`) | Forces the application server process to crash. Useful for verifying automated container orchestration restarts. | Returns `500` with `{ status: 'panicking' }` and triggers `process.exit(1)`. |
| `/ui/*` | `GET` | UI (`src/app.ts`) | Serves the static frontend assets from the `public/` directory (e.g., `public/index.html`). | Served via `@fastify/static`. |

## CI/CD

The project will be deployed and managed several different ways across multiple Kubernetes environments as a comparative learning exercise. The idea is that the same workload will be targeting a variety of different platforms.

### Target Environments

I have access to the following environments

- [ ] AWS EKS
- [ ] Oracle OKE
- [ ] Homelab (mini-pc's running proxmox+k3s)

### GitOps Platforms

The two dominant pull-based CD platforms in the CNCF landscape. Both watch Git and reconcile cluster state.

- [x] **[ArgoCD](https://argo-cd.readthedocs.io/)** — declarative GitOps with a UI, ApplicationSet templating, and broad ecosystem support.
- [ ] **[FluxCD v2](https://fluxcd.io/)** — CLI-first GitOps platform with strong multi-tenancy primitives and Helm-native flow.
  - [ ] **[Flux AIO](https://github.com/stefanprodan/flux-aio/tree/main/modules/flux-aio)** — single-pod Flux distribution for resource-constrained environments (homelab fit).

### Progressive Delivery

Sit on top of either GitOps platform. They manage Kubernetes CRDs that any reconciler can sync, but each has a cultural home in one ecosystem.

- [ ] **[Argo Rollouts](https://argoproj.github.io/rollouts/)** — blue-green and canary deployments via the `Rollout` CRD. From the Argo ecosystem.
- [ ] **[Flagger](https://flagger.app/)** — metric-driven progressive delivery and automated rollback. From the Flux ecosystem.

### Promotion / Environment Management

- [ ] **[Kargo](https://github.com/akuity/kargo)** — orchestrates artifact promotion across environments (dev → staging → prod) on top of GitOps. Complements rather than replaces ArgoCD/Flux.

### Traditional CI/CD (Baseline)

- [ ] **[GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions)** — vanilla push-based `kubectl apply` deployment, as a comparative baseline to see what we gain with dedicated tooling

## Acknowledgments

This project is inspired by [podinfo](https://github.com/stefanprodan/podinfo)
by Stefan Prodan, reimagined in Node.js/TypeScript as a learning exercise.
