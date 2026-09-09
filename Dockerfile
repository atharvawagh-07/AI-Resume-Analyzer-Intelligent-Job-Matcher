# Multi-Stage Production Dockerfile for AI Resume Analyzer & Job Matching Platform

# Stage 1: Build Frontend Assets
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Node/Python Server
FROM python:3.10-slim AS runner
WORKDIR /app

# Install system dependencies & Node.js
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy built frontend and source files
COPY --from=frontend-builder /app/dist ./dist
COPY package*.json ./
COPY server.ts ./
COPY backend ./backend

# Install production node dependencies
RUN npm ci --omit=dev

EXPOSE 3000
EXPOSE 8000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "dist/server.cjs"]
