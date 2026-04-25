# ============================================================
# Stage 1: TypeScript build
# ============================================================
FROM node:24-slim AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY tsconfig.json vite.config.ts mcp-app.html ./
COPY src/ ./src/
RUN pnpm run build

# ============================================================
# Stage 2: Production dependencies only
# ============================================================
FROM node:24-slim AS prod-deps

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# ============================================================
# Stage 3: Marp CLI (global install, separate layer)
# ============================================================
FROM node:24-slim AS marp-builder

ARG MARP_CLI_VERSION=4.3.1
RUN npm install -g @marp-team/marp-cli@${MARP_CLI_VERSION}

# ============================================================
# Stage 4: Final image
# ============================================================
FROM node:24-slim

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

# System packages: Chromium (PDF), CJK fonts (Japanese text), LibreOffice (editable PPTX)
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-noto-cjk \
    libreoffice-impress \
    && rm -rf /var/lib/apt/lists/* \
    && fc-cache -fv

# Marp CLI from Stage 3
COPY --from=marp-builder /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/@marp-team/marp-cli/marp-cli.js /usr/local/bin/marp

# Tell Puppeteer to use the system Chromium (avoids bundled download)
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Copy prod node_modules and built files
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/build ./build

# package.json is read at runtime for version info
COPY package.json ./

# Default: HTTP transport on port 3000
ENV MCP_TRANSPORT=http
ENV PORT=3000
EXPOSE 3000

CMD ["node", "build/index.js"]
