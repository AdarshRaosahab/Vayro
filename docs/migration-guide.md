# Database Migration Instructions

To update your database schema with the new analytics fields:

1.  **Run Migration**:
    ```bash
    npx prisma migrate dev --name add_analytics_fields
    ```

2.  **Regenerate Client** (usually happens automatically after migrate):
    ```bash
    npx prisma generate
    ```

3.  **Verify**:
    Check `prisma/schema.prisma` to ensure `ClickEvent` has fields like `ipHash`, `userAgent`, etc.
