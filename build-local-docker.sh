bun run build

DOCKER_BUILDKIT=1 docker build -t meside/server:main --no-cache -f apps/server/Dockerfile apps/server
DOCKER_BUILDKIT=1 docker build -t meside/web:main --no-cache -f apps/web/Dockerfile apps/web
