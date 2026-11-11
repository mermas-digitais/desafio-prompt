# ==============================================================================
# Stage 1: Build (Frontend Vite + Backend TypeScript)
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Força NODE_ENV=development no builder para garantir instalação de devDependencies (Vite, TS) mesmo com build args de produção
ENV NODE_ENV=development

# Instala todas as dependências necessárias para a compilação
COPY package.json package-lock.json* ./
RUN npm install --include=dev

# Copia código-fonte e arquivos de configuração
COPY . .

# Compila o frontend (dist/public) e o servidor backend (dist/server)
RUN npm run build

# ==============================================================================
# Stage 2: Production Runtime (Fastify + Socket.io + Static SPA)
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

COPY package.json package-lock.json* ./
RUN npm install --omit=dev && npm cache clean --force

# Copia artefatos compilados e assets públicos
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Cria diretório de fallback local caso necessário
RUN mkdir -p /app/.data

EXPOSE 3001

HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3001/api/health || exit 1

CMD ["node", "dist/server/index.js"]
