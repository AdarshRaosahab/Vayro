import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock, MagicMock, patch
from main import app, check_rate_limit, record_analytics

# Mock environment variables
os_patch = patch.dict("os.environ", {
    "REDIS_URL": "redis://localhost:6379", 
    "DATABASE_URL": "postgresql://user:pass@localhost:5432/db"
})

@pytest.fixture
def anyio_backend():
    return 'asyncio'

@pytest.fixture
def mock_redis():
    mock = AsyncMock()
    # Mock pipeline
    pipeline = AsyncMock()
    pipeline.__aenter__.return_value = pipeline
    pipeline.execute.return_value = [True, 1] # zrem, zcard (1 request)
    mock.pipeline.return_value = pipeline
    return mock

@pytest.fixture
def mock_db_pool():
    pool = MagicMock() # Use MagicMock to avoid acquire() being acceptable as a coroutine
    conn = AsyncMock()
    # pool.acquire() returns the context manager
    cm = AsyncMock()
    pool.acquire.return_value = cm
    cm.__aenter__.return_value = conn
    return pool, conn

@pytest.mark.asyncio
async def test_redirect_redis_hit(mock_redis):
    # Setup
    mock_redis.get.return_value = '{"id": "123", "target": "https://example.com", "active": true}'
    
    # Patch the global clients in main
    with patch("main.redis_client", mock_redis), \
         patch("main.check_rate_limit", return_value=True):
        
        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get("/abc")
            
    assert response.status_code == 302
    assert response.headers["location"] == "https://example.com"
    mock_redis.get.assert_called_with("url:abc")

@pytest.mark.asyncio
async def test_redirect_db_fallback(mock_redis, mock_db_pool):
    pool, conn = mock_db_pool
    # Redis miss
    mock_redis.get.return_value = None
    # DB hit
    conn.fetchrow.return_value = {"id": "456", "target_url": "https://fallback.com", "is_active": True}
    
    with patch("main.redis_client", mock_redis), \
         patch("main.db_pool", pool), \
         patch("main.check_rate_limit", return_value=True):
         
        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get("/xyz")
            
    assert response.status_code == 302
    assert response.headers["location"] == "https://fallback.com"
    # Should cache the result
    mock_redis.setex.assert_called()

@pytest.mark.asyncio
async def test_redirect_404(mock_redis, mock_db_pool):
    pool, conn = mock_db_pool
    mock_redis.get.return_value = None
    conn.fetchrow.return_value = None # DB miss header
    
    with patch("main.redis_client", mock_redis), \
         patch("main.db_pool", pool), \
         patch("main.check_rate_limit", return_value=True):

        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get("/notfound")
            
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_rate_limit_exceeded(mock_redis):
    # Mock rate limit check simply returning False
    with patch("main.check_rate_limit", return_value=False):
        async with AsyncClient(app=app, base_url="http://test") as ac:
            response = await ac.get("/fast")
            
    assert response.status_code == 429
