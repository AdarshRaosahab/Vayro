# QR Code Generation Notes

## Overview
VAYRO provides high-performance QR code generation for every short link. QR codes are generated on-demand and cached for performance.

## API Usage

### Generate QR Code
**GET** `/api/qr/generate?code={shortCode}&size={size}&download={0|1}`

- `code`: The short code of the link (required).
- `size`: Width/Height in pixels (default: 512).
- `download`: Set to `1` to trigger a file download (Content-Disposition attachment).

**Example:**
```
GET /api/qr/generate?code=xyz123&size=1024&download=1
```

### Bulk Generation
**POST** `/api/qr/bulk`
- Body: `{ "codes": ["code1", "code2"] }`
- Returns an array of data URLs.

## Caching Strategy
- Generated PNGs are cached in the system's temporary directory (`/tmp/vayro-qr-cache`).
- Cache duration: 7 days (via `Cache-Control` header).
- If `REDIS_URL` is configured in the future, we can switch to Redis for distributed caching.

## Components
- **`QRPreview`**: Displays the QR code image with a loading state.
- **`QRDownloadButton`**: A button wrapper that triggers the download endpoint.

## Performance
- Uses `qrcode` library for fast generation.
- File system caching prevents regeneration of the same QR code.
