bun run build
DOCKER_BUILDKIT=1 docker build -t meside/warehouse:latest --no-cache -f apps/warehouse/Dockerfile apps/warehouse
DOCKER_BUILDKIT=1 docker build -t meside/server:latest --no-cache -f apps/server/Dockerfile apps/server
DOCKER_BUILDKIT=1 docker build -t meside/web:latest --no-cache -f apps/web/Dockerfile apps/web