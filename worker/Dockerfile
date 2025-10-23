FROM node:20-alpine AS build
WORKDIR /app

# Copy package files from worker directory
COPY worker/package*.json ./

# Install dependencies
RUN npm ci

# Copy shared folder (build context is project root)
COPY shared ./shared

# Copy worker-specific files
COPY worker/tsconfig.json worker/build.mjs ./
COPY worker/src ./src

# Build
RUN npm run build

# Prune dev dependencies
RUN npm prune --omit=dev

FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
USER node

# Copy necessary files from build stage
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]