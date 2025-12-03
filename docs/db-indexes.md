# Database Indexes

To ensure performance at scale, the following indexes should be applied to the database.

## Prisma Schema Additions
Ensure your `schema.prisma` has these `@@index` definitions:

```prisma
model Link {
  // ...
  @@index([code])
  @@index([userId])
}

model ClickEvent {
  // ...
  @@index([linkId])
  @@index([createdAt])
}
```

## SQL Commands (Manual)
If you need to apply these manually in production:

```sql
-- Links
CREATE INDEX "Link_code_idx" ON "Link"("code");
CREATE INDEX "Link_userId_idx" ON "Link"("userId");

-- ClickEvents
CREATE INDEX "ClickEvent_linkId_idx" ON "ClickEvent"("linkId");
CREATE INDEX "ClickEvent_createdAt_idx" ON "ClickEvent"("createdAt");
```
