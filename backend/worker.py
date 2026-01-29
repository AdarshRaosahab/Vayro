import asyncio
import os
import json
import logging
import redis.asyncio as redis
import asyncpg
from datetime import datetime

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://vayro:password@localhost:5432/vayro_db")
STREAM_KEY = "stream:clicks"
GROUP_NAME = "analytics_group"
CONSUMER_NAME = "worker_1"
BATCH_SIZE = 100

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("worker")

async def process_batch(pool, messages):
    if not messages: return
    logger.info(f"Processing {len(messages)} events...")
    
    async with pool.acquire() as conn:
        values = []
        for _, data in messages:
            values.append((
                data.get("link_id"),
                data.get("country"),
                data.get("user_agent"),
                data.get("referer"),
                data.get("ip"),
                datetime.fromtimestamp(float(data.get("timestamp")))
            ))
        try:
            await conn.executemany("""
                INSERT INTO "ClickEvent" (id, "linkId", country, "userAgent", referrer, "ipHash", "createdAt")
                VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6)
            """, values)
            return True
        except Exception as e:
            logger.error(f"DB Error: {e}")
            return False

async def main():
    logger.info("Starting Worker...")
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    pool = await asyncpg.create_pool(DATABASE_URL)
    
    try:
        await redis_client.xgroup_create(STREAM_KEY, GROUP_NAME, mkstream=True)
    except Exception:
        pass

    while True:
        try:
            streams = await redis_client.xreadgroup(
                GROUP_NAME, CONSUMER_NAME, {STREAM_KEY: ">"}, count=BATCH_SIZE, block=10000
            )
            if not streams: continue
            
            _, messages = streams[0]
            if await process_batch(pool, messages):
                await redis_client.xack(STREAM_KEY, GROUP_NAME, *[m[0] for m in messages])
        except Exception as e:
            logger.error(f"Error: {e}")
            await asyncio.sleep(5)

if __name__ == "__main__":
    asyncio.run(main())
