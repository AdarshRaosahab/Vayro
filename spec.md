# Vayro Architecture Specification

> [!IMPORTANT]
> This specification outlines the architectural separation of Vayro into a high-performance Redirect Engine and a feature-rich Dashboard.

## 1. System Architecture

The system is divided into two distinct services to ensure the Redirect Engine remains lightweight and fast, unaffected by complex queries or load on the Dashboard.

```mermaid
graph TD
    User[User / Visitor]
    
    subgraph Frontend
        NextJS[Dashboard (Next.js)]
    end
    
    subgraph Backend Services
        DashboardAPI[Dashboard API (FastAPI)]
        RedirectEngine[Redirect Engine (FastAPI)]
        Worker[Analytics Worker (Python)]
    end
    
    subgraph Data Layer
        Redis[(Redis Cache & Streams)]
        Postgres[(PostgreSQL DB)]
    end

    %% Flows
    User -- Visit Link --> RedirectEngine
    User -- View Analytics --> NextJS
    
    NextJS -- API Calls --> DashboardAPI
    
    DashboardAPI -- Read/Write --> Postgres
    DashboardAPI -- Cache Invalid --> Redis
    
    RedirectEngine -- 1. Lookup --> Redis
    RedirectEngine -- 2. Fallback Lookup --> Postgres
    RedirectEngine -- 3. Push Click Event --> Redis
    
    Worker -- Poll Stream --> Redis
    Worker -- Bulk Insert --> Postgres
```

## 2. Technology Stack Roles

- **Next.js (Frontend)**: User Interface for link management, analytics visualization, and billing.
- **FastAPI (Dashboard Backend)**: Business logic for creating links, user management, and querying analytics.
- **FastAPI (Redirect Engine)**: Ultra-lightweight service dedicated solely to handling link redirects.
- **Redis**:
    - **Caching**: Stores `short_code -> target_url` mappings for sub-millisecond access.
    - **Buffer**: Uses Redis Streams to temporarily store click events before persistent storage.
- **PostgreSQL**: Primary source of truth for Users, Links, and persistent history of ClickEvents.

## 3. Database Schema (PostgreSQL)

We will optimize the existing schema.

### Core Tables

```sql
-- Users and Accounts
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    plan VARCHAR(50) DEFAULT 'free', -- free, pro, enterprise
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Links
CREATE TABLE links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    short_code VARCHAR(50) UNIQUE NOT NULL,
    target_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Cache control
    version INTEGER DEFAULT 1
);

-- Analytics (Optimized for Write-Heavy load)
-- Consider partitioning by time (e.g., monthly) for scale
CREATE TABLE click_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id UUID REFERENCES links(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    country_code CHAR(2),
    city VARCHAR(100),
    device_type VARCHAR(50), -- mobile, desktop, tablet
    browser VARCHAR(50),
    os VARCHAR(50),
    referer TEXT,
    ip_address VARCHAR(45) -- Anonymized if needed
);

CREATE INDEX idx_clicks_link_time ON click_events(link_id, timestamp DESC);
```

## 4. Redis Schema

### Caching (Key-Value)
Used by Redirect Engine for instant checks.

- **Key**: `url:{short_code}`
- **Value**: JSON String
  ```json
  {
    "target": "https://example.com/long-url",
    "active": true,
    "id": "uuid-of-link"
  }
  ```
- **TTL**: 24 Hours (Refreshed on hit). Dashboard API invalidates/updates this key on link edit.

### Analytics Buffer (Redis Streams)
Used to decouple high-speed clicks from DB writes.

- **Stream Key**: `stream:clicks`
- **Payload**:
  ```json
  {
    "link_id": "uuid",
    "timestamp": "ISO-8601",
    "ip": "1.2.3.4",
    "user_agent": "Mozilla/5.0...",
    "referer": "https://t.co/"
  }
  ```

## 5. API Specification

### A. Redirect Engine (FastAPI)
**Base URL**: `https://v.yourdomain.com`

#### `GET /{short_code}`
- **Behavior**:
  1. **Cache Look-aside**: Check Redis `url:{short_code}`.
  2. **DB Fallback**: If miss, query PostgreSQL `links` table.
     - If found: Write to Redis (TTL 24h) and proceed.
     - If not found or inactive: Return 404.
  3. **Analytics**: Async fire-and-forget push to Redis Stream `stream:clicks`.
  4. **Response**: HTTP 301/302 Redirect to `target_url`.
- **Performance Goal**: < 50ms latency.

### B. Dashboard API (FastAPI)
**Base URL**: `https://api.yourdomain.com`

#### Link Management
| Method | Endpoint | Description | Side Effect |
|:---|:---|:---|:---|
| POST | `/v1/links` | Create a new short link | writes to Postgres, **sets Redis key** |
| GET | `/v1/links` | List user's links | reads Postgres |
| PATCH | `/v1/links/{id}` | Update target or status | updates Postgres, **updates/deletes Redis key** |
| DELETE | `/v1/links/{id}` | Delete a link | deletes Postgres, **deletes Redis key** |

#### Analytics
| Method | Endpoint | Description |
|:---|:---|:---|
| GET | `/v1/analytics/{link_id}` | Get stats (clicks over time, locations, etc.) | Queries `click_events` table (potentially cached) |

## 6. Worker Service (Python)
A background worker running separately.

- **Loop**:
  1. Reads batch of events (e.g., 1000) from Redis Stream `stream:clicks` using Consumer Group.
  2. Enriches data (e.g., GeoIP lookup based on IP).
  3. Performs Bulk Insert (`COPY` or batch `INSERT`) into PostgreSQL `click_events`.
  4. ACKs messages in Redis Stream.
- **Benefit**: Keeps the Redirect Engine fast; handles DB backpressure gracefully.
