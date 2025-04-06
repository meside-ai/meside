FROM oven/bun:1
WORKDIR /app

COPY ./build .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "run", "server.js"]