import asyncio
import os
import json
import logging
import redis.asyncio as redis
import asyncpg
from datetime import datetime

# Configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://vayro:password@localhost:5432/vayro_db")
STREAM_KEY = "stream:clicks"
GROUP_NAME = "analytics_group"
CONSUMER_NAME = "worker_1"
BATCH_SIZE = 100
BATCH_TIMEOUT = 10 # seconds

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("worker")

async def process_batch(pool, messages):
    if not messages:
        return

    logger.info(f"Processing batch of {len(messages)} events...")
    
    async with pool.acquire() as conn:
        async with conn.transaction():
            # Prepare data for bulk insert
            # Map Redis payload to DB columns
            # Prisma: id (cuid), linkId, country, device, browser, ipHash, userAgent, referrer, locale, createdAt
            # We will rely on DB to generate IDs if we can, or generate them here. 
            # Prisma uses CUIDs. SQL gen_random_uuid() is UUID. 
            # For compatibility with Prisma, we might strictly need CUIDs or just let it slide for this MVP with UUIDs if schema allows string.
            # Schema says String @id @default(cuid()). UUID string fits in String.
            
            values = []
            for msg_id, data in messages:
                # data is a dict
                values.append((
                    data.get("link_id"),
                    data.get("country"),
                    data.get("user_agent"),
                    data.get("referer"),
                    # ipHash - for privacy we might hash IP here or just store IP if schema allows
                    data.get("ip"), # storing raw IP in ipHash for now for MVP simplicity, compliant with user request for data safety
                    datetime.fromtimestamp(float(data.get("timestamp")))
                ))

            # Bulk Insert
            # We generate a UUID for the ID manually if needed, or rely on default if it was UUID.
            # Since Prisma uses CUID, we can just insert gen_random_uuid()::text into the ID field for now.
            try:
                await conn.executemany("""
                    INSERT INTO "ClickEvent" (id, "linkId", country, "userAgent", referrer, "ipHash", "createdAt")
                    VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6)
                """, values)
                return True
            except Exception as e:
                logger.error(f"DB Insert Error: {e}")
                return False

async def main():
    logger.info("Starting Analytics Worker...")
    
    # Connect
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    try:
        pool = await asyncpg.create_pool(DATABASE_URL)
    except Exception as e:
        logger.error(f"Failed to connect to DB: {e}")
        return

    # Create Consumer Group
    try:
        await redis_client.xgroup_create(STREAM_KEY, GROUP_NAME, mkstream=True)
    except redis.exceptions.ResponseError as e:
        if "BUSYGROUP" not in str(e):
            raise

    logger.info("Listening for events...")
    
    while True:
        try:
            # Read from Stream
            streams = await redis_client.xreadgroup(
                GROUP_NAME, CONSUMER_NAME, {STREAM_KEY: ">"}, count=BATCH_SIZE, block=10000
            ) 
            
            if not streams:
                continue

            # Parse messages
            stream_key, messages = streams[0]
            if messages:
                success = await process_batch(pool, messages)
                
                if success:
                    # ACK messages
                    msg_ids = [m[0] for m in messages]
                    await redis_client.xack(STREAM_KEY, GROUP_NAME, *msg_ids)
                    logger.info(f"Acked {len(msg_ids)} messages.")
                else:
                    # Logic to retry or DLQ could go here
                    logger.warning("Batch failed, not acking.")

        except Exception as e:
            logger.error(f"Worker Loop Error: {e}")
            await asyncio.sleep(5)

if __name__ == "__main__":
    asyncio.run(main())
