docker-compose -f deployment/docker-compose.dev.yml down
docker-compose -f deployment/docker-compose.dev.yml rm
rm -rf ./deployment/dev/volumes
