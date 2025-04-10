FROM oven/bun:1
WORKDIR /app

COPY ./build .
COPY ./db/migrations ./db/migrations

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "server.js"]