import os
import time
import asyncio
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, Response, Path, Body
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import redis.asyncio as redis
import asyncpg
from pydantic import BaseModel, HttpUrl
from pydantic_settings import BaseSettings
import string
import random

# Configuration
class Settings(BaseSettings):
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    database_url: str = os.getenv("DATABASE_URL", "postgresql://vayro:password@localhost:5432/vayro_db")
    host_url: str = os.getenv("HOST_URL", "http://localhost:8000")

    class Config:
        case_sensitive = False

settings = Settings()

# Global Connections
redis_client = None
db_pool = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global redis_client, db_pool
    print("Starting up Vayro Redirect Engine...")
    redis_client = redis.from_url(settings.redis_url, decode_responses=True)
    db_pool = await asyncpg.create_pool(settings.database_url)
    yield
    # Shutdown
    print("Shutting down...")
    await redis_client.close()
    await db_pool.close()

app = FastAPI(title="Vayro Redirect Engine", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LinkCreate(BaseModel):
    url: HttpUrl

def generate_short_code(length=6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@app.post("/api/v1/shorten")
async def create_short_link(link: LinkCreate):
    original_url = str(link.url)
    
    # 1. Generate Unique Code
    # In a real system, we'd handle collisions. For MVP/Demo:
    short_code = generate_short_code()
    
    # 2. Save to DB
    async with db_pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO links (short_code, target_url, is_active)
            VALUES ($1, $2, true)
            RETURNING id, short_code, target_url
            """,
            short_code, original_url
        )
        
    link_id = str(row['id'])
    
    # 3. Cache to Redis (Read-through optimization)
    cache_key = f"url:{short_code}"
    link_data = {
        "id": link_id,
        "target": original_url,
        "active": True
    }
    await redis_client.setex(cache_key, 86400, json.dumps(link_data))
    
    return {
        "short_code": short_code,
        "short_url": f"{settings.host_url}/{short_code}",
        "original_url": original_url,
        "id": link_id
    }

async def record_analytics(link_id: str, request: Request):
    """
    Fire-and-forget analytics to Redis Stream.
    Does NOT block the redirect.
    """
    try:
        payload = {
            "link_id": link_id,
            "timestamp": time.time(),
            "ip": request.client.host,
            "user_agent": request.headers.get("user-agent", ""),
            "referer": request.headers.get("referer", ""),
            "country": request.headers.get("cf-ipcountry", "XX") # Cloudflare header support
        }
        # Add to stream
        await redis_client.xadd("stream:clicks", payload)
    except Exception as e:
        print(f"Analytics Error: {e}")

async def check_rate_limit(ip: str):
    """
    Simple sliding window rate limiter via Redis.
    Allow 100 requests per minute.
    """
    key = f"rl:{ip}"
    async with redis_client.pipeline(transaction=True) as pipe:
        now = time.time()
        window_start = now - 60
        
        # Remove old requests
        await pipe.zremrangebyscore(key, 0, window_start)
        # Count current requests
        await pipe.zcard(key)
        # Add current request
        await pipe.zadd(key, {str(now): now})
        # Set expiry
        await pipe.expire(key, 60)
        
        results = await pipe.execute()
        request_count = results[1]
        
        if request_count > 100:
            return False
    return True

@app.get("/{short_code}")
async def redirect_url(short_code: str = Path(..., max_length=50), request: Request):
    # 1. Rate Limit
    if not await check_rate_limit(request.client.host):
        raise HTTPException(status_code=429, detail="Too Many Requests")

    # 2. Redis Cache Lookup (Priority 1: Speed)
    cache_key = f"url:{short_code}"
    cached_link = await redis_client.get(cache_key)

    link_data = None

    if cached_link:
        link_data = json.loads(cached_link)
    else:
        # 3. Database Fallback (Priority 2: Consistency)
        async with db_pool.acquire() as conn:
            row = await conn.fetchrow(
                "SELECT id, target_url, is_active FROM links WHERE short_code = $1", 
                short_code
            )
            
            if row:
                link_data = {
                    "id": str(row["id"]),
                    "target": row["target_url"],
                    "active": row["is_active"]
                }
                # Write to cache (TTL 24h)
                await redis_client.setex(cache_key, 86400, json.dumps(link_data))
            else:
                raise HTTPException(status_code=404, detail="Link not found")

    # 4. Check Active Status
    if not link_data or not link_data.get("active"):
        raise HTTPException(status_code=404, detail="Link inactive or not found")

    # 5. Async Analytics (Background Task)
    asyncio.create_task(record_analytics(link_data["id"], request))

    # 6. Redirect
    return RedirectResponse(url=link_data["target"], status_code=302)

@app.get("/health")
async def health():
    return {"status": "ok"}
