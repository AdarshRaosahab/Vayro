# Dashboard UI Documentation

## Overview
The VAYRO dashboard provides a premium, data-rich interface for managing links and viewing analytics.

## Components

### Analytics Panel
- **Purpose**: Displays detailed stats for a single link.
- **Features**:
  - Total Clicks
  - QR Code Preview & Download
  - Line Chart (Clicks over last 30 days)
  - Bar Charts (Top Countries, Top Devices)
- **Data Source**: Fetches from `/api/analytics/summary`.

### Charts
- **Library**: `recharts`
- **Components**:
  - `ChartLine`: Responsive line chart with tooltips.
  - `ChartBar`: Horizontal bar chart for categorical data.
- **Styling**: Uses brand colors (Deep Navy, Gold) and minimal grid lines.

### Modals
- **LinkEditModal**: Allows updating the target URL and custom alias.
- **ConfirmDeleteModal**: Safety check before permanently deleting a link.

## User Flow
1.  **View Links**: Main table lists all links.
2.  **View Stats**: Clicking a link row or "Stats" button opens the `AnalyticsPanel` on the right side.
3.  **Edit Link**: Clicking the pencil icon opens the edit modal.
4.  **Delete Link**: Clicking the trash icon opens the confirmation modal.

## Responsive Design
- On desktop (`lg`), the layout is a 2-column grid (Links Table + Analytics Panel).
- On mobile/tablet, the layout stacks vertically.
