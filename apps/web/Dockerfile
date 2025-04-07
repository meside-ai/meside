FROM oven/bun:1
WORKDIR /app

COPY ./.next/standalone ./
COPY ./public ./apps/web/public
COPY ./.next/static ./apps/web/.next/static

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "apps/web/server.js"]
