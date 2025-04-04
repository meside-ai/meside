FROM oven/bun:1 AS base

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN bun install

# Copy source code
COPY . .

# Environment variables
ENV NODE_ENV production

# Build if needed
RUN bun run build

# Create a non-root user
RUN addgroup --system --gid 1001 bunjs
RUN adduser --system --uid 1001 bunapp
USER bunapp

EXPOSE 3001

CMD ["bun", "start"] 