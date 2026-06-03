FROM node:20-alpine AS base

WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci && npx prisma generate

FROM base AS development
COPY package.json package-lock.json* ./
RUN npm ci && npx prisma generate
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS builder
COPY package.json package-lock.json* ./
RUN npm ci
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate && npm run build

FROM base AS production
COPY package.json package-lock.json* ./
RUN npm ci --only=production
COPY prisma ./prisma
RUN npx prisma generate
COPY --from=builder /app/dist ./dist
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/server.js"]