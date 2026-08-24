# ==========================================
# Etapa 1: Compilar Frontend React + Vite
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ==========================================
# Etapa 2: Servidor Unificado Backend + Static Frontend
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

# Instalar cliente de Postgres u otras dependencias nativas si fuera necesario
RUN apk add --no-cache openssl

# Copiar configuración e instalar dependencias de Backend
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci

# Copiar esquema de Prisma y generar cliente
COPY backend/prisma ./prisma
RUN npx prisma generate

# Copiar resto del código backend
COPY backend/ ./

# Copiar los estáticos compilados del Frontend al directorio backend
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Exponer puerto de la aplicación
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production
ENV DATABASE_URL="file:./dev.db"

# Script de arranque en producción (Migraciones + Seed + Start)
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node prisma/seed.js && node src/index.js"]
