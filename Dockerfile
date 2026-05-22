# ── Stage 1: Build ──────────────────────────────────────────────────
FROM node:24-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

# ── Stage 2: Production ─────────────────────────────────────────────
FROM node:24-slim AS production
ENV NODE_ENV=production
WORKDIR /app

# chown prevents permission errors when copying from root owned stage 1
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# chown prevents permission errors when copying from root owned stage 1
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node public/ ./public/

USER node
EXPOSE 3000

CMD ["node", "dist/server.js"]
