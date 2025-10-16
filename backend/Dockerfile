FROM node:24-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

FROM node:24-alpine AS build

WORKDIR /app

COPY --from=deps /app/package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.json ./
COPY src ./src

RUN npm run build

FROM node:24-alpine AS prod
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules

RUN npm prune --omit=dev

COPY --from=build /app/dist ./dist

USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
