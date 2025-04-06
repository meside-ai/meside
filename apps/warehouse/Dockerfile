FROM oven/bun:1
WORKDIR /app

RUN addgroup --system --gid 1001 bunjs
RUN adduser --system --uid 1001 nextjs

COPY --chown=nextjs:bunjs ./.next/standalone ./

USER nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000

CMD ["bun", "run", "apps/warehouse/server.js"]
