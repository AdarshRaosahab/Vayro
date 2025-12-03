

async function testShorten() {
    try {
        const response = await fetch('http://localhost:3001/api/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Simulate browser headers
                'Origin': 'http://localhost:3001',
                'Host': 'localhost:3001'
            },
            body: JSON.stringify({
                longUrl: 'https://example.com'
            })
        });

        const status = response.status;
        const text = await response.text();

        console.log(`Status: ${status}`);
        console.log(`Body: ${text}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

testShorten();
