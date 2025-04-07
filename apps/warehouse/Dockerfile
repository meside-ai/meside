FROM oven/bun:1
WORKDIR /app

COPY ./.next/standalone ./
COPY ./public ./apps/warehouse/public
COPY ./.next/static ./apps/warehouse/.next/static

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "apps/warehouse/server.js"]
