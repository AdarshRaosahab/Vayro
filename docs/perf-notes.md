# Performance Optimization Notes

## Caching Strategy
- **Edge Caching**: `middleware.ts` sets `Cache-Control` headers.
  - Static Assets: 1 year immutable.
  - Short Links: 15s max-age, 60s stale-while-revalidate.
  - API: No store by default.
- **Application Caching**: `lib/cache.ts` provides a unified interface.
  - Uses Redis if `REDIS_URL` is set.
  - Fallback to in-memory LRU for development.

## Database
- **Indexes**: Critical for lookups by `code` and aggregation by `linkId`. See `docs/db-indexes.md`.
- **Connection Pooling**: Prisma handles this, but ensure `pgbouncer` is used in high-load production environments.

## Analytics
- **Aggregation**: Raw click events are heavy to count. We use `jobs/aggregate-analytics.ts` to pre-compute daily stats and cache them.

## Observability
- **Metrics**: `lib/metrics.ts` allows instrumentation. Connect to Datadog/Prometheus in production.
