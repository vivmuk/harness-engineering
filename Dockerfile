# syntax=docker/dockerfile:1
FROM node:20-slim AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production image
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built assets and static files
COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./package.json

# Install a lightweight static server
RUN npm install -g serve@latest

EXPOSE 3000
CMD ["serve", "dist", "-l", "3000"]
