# Base install layer
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Development image (hot reload via nest start:dev)
FROM base AS dev
WORKDIR /app
COPY . .
RUN npm run prisma:generate || true
CMD ["npm", "run", "start:dev"]

# Build layer
FROM base AS build
WORKDIR /app
COPY . .
RUN npm run prisma:generate
RUN npm run build

# Production image
FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]
