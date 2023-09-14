FROM node:16 as build

WORKDIR /tmp/app

# Install dependencies
COPY Auth-User-Microservice/package.json package-lock.json ./
RUN npm ci --silent

# Copy source
COPY Auth-User-Microservice .

# Build
RUN npm run build

# -------------------
FROM node:16-alpine

WORKDIR /app

# Copy source
COPY Auth-User-Microservice .

# Copy built files
COPY --from=build /tmp/app/dist .

# Build and cleanup
ENV NODE_ENV=production
RUN npm ci --omit=dev

# Start server
CMD ["node", "./node_modules/moleculer/bin/moleculer-runner.js"]
