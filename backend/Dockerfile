FROM node:20-alpine AS deps
WORKDIR /workspace/backend
COPY backend/package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /workspace/backend
COPY --from=deps /workspace/backend/node_modules ./node_modules
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/src ./src
COPY shared ../shared
# Create a symlink so shared can access node_modules
RUN ln -s /workspace/backend/node_modules /workspace/node_modules
RUN npm run build

FROM node:20-alpine AS prod
ENV NODE_ENV=production
WORKDIR /workspace/backend
COPY backend/package*.json ./
COPY --from=deps /workspace/backend/node_modules ./node_modules
RUN npm prune --omit=dev
COPY --from=build /workspace/backend/dist ./dist
COPY shared ../shared
# Create symlink for runtime
RUN ln -s /workspace/backend/node_modules /workspace/node_modules
USER node
EXPOSE 3000
CMD ["node", "dist/backend/src/server.js"]