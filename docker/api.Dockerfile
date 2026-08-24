# syntax=docker/dockerfile:1
# Planity API — multi-stage build (pnpm hoisted layout, matching .npmrc).

ARG NODE_VERSION=20-alpine

# ── Build stage ────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS build
RUN corepack enable
WORKDIR /repo

# Manifests first for layer-cached dependency resolution
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
COPY packages/ui/package.json packages/ui/
RUN pnpm fetch

# Full source, then offline install + prisma client + build
COPY . .
RUN pnpm install --frozen-lockfile --offline \
 && cd apps/api \
 && node ../../node_modules/prisma/build/index.js generate \
 && pnpm build

# ── Runtime stage ──────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS runtime
ENV NODE_ENV=production
RUN apk add --no-cache openssl libc6-compat
WORKDIR /repo

COPY --from=build --chown=node:node /repo/node_modules ./node_modules
COPY --from=build --chown=node:node /repo/packages/shared ./packages/shared
COPY --from=build --chown=node:node /repo/apps/api/dist ./apps/api/dist
COPY --from=build --chown=node:node /repo/apps/api/prisma ./apps/api/prisma
COPY --from=build --chown=node:node /repo/apps/api/package.json apps/api/package.json
COPY --from=build --chown=node:node /repo/package.json ./package.json

USER node
EXPOSE 3000

# Migrations run before boot; the API exposes /v1/health for orchestration probes.
CMD ["sh", "-c", "cd apps/api && node ../../node_modules/prisma/build/index.js migrate deploy && node dist/src/main.js"]
