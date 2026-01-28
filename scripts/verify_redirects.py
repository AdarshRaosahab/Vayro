import asyncio
import time
import random
import string
from unittest.mock import MagicMock, AsyncMock, patch
import sys

# Mock asyncpg system-wide before importing main
sys.modules["asyncpg"] = MagicMock()

# Now import main
from main import app, check_rate_limit, record_analytics

# Helper to generate random short code
def generate_short_code():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=6))

async def run_verification():
    print("Starting Verification Test...")
    
    # Setup Mocks
    mock_redis = AsyncMock()
    pipeline = AsyncMock()
    pipeline.__aenter__.return_value = pipeline
    pipeline.execute.return_value = [True, 1]
    mock_redis.pipeline.return_value = pipeline
    
    # Pre-fill Redis with 100 URLs
    # We will mock the 'get' method to return data for specific keys
    test_data = {}
    for _ in range(100):
        code = generate_short_code()
        target = f"https://example.com/{code}"
        test_data[f"url:{code}"] = f'{{"id": "uuid", "target": "{target}", "active": true}}'
        
    async def mock_get(key):
        return test_data.get(key)
        
    mock_redis.get.side_effect = mock_get
    
    # Patch main app links
    with patch("main.redis_client", mock_redis), \
         patch("main.check_rate_limit", return_value=True):
         
        # We need an HTTP client to hit the app
        from httpx import AsyncClient
        
        results = []
        async with AsyncClient(app=app, base_url="http://test") as ac:
            start_total = time.time()
            
            for i, (key, val) in enumerate(test_data.items()):
                code = key.split(":")[1]
                start_req = time.time()
                response = await ac.get(f"/{code}")
                duration = (time.time() - start_req) * 1000 # ms
                
                success = response.status_code == 302
                target = test_data[key].split('"target": "')[1].split('"')[0]
                correct = response.headers.get("location") == target
                
                results.append(f"Request {i+1}: Code={code} Status={response.status_code} Time={duration:.2f}ms Success={success and correct}")
                
            total_time = time.time() - start_total
            
    # Write Log
    with open("test-results.log", "w") as f:
        f.write("\n".join(results))
        f.write(f"\n\nTotal Time: {total_time:.2f}s")
        f.write(f"\nAverage Time: {total_time/100*1000:.2f}ms")
    
    print(f"Verification Complete. Processed 100 URLs in {total_time:.2f}s.")
    print("See test-results.log for details.")

if __name__ == "__main__":
    import asyncio
    asyncio.run(run_verification())
