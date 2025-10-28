# AETHERIAL Platform Creator Dashboard

## 1. Objective

To provide creators with a centralized dashboard to manage their marketplace listings, track sales and earnings, and gain insights into their performance. This will empower creators to optimize their offerings and grow their business on the AETHERIAL platform.

## 2. Core Components

### a. Sales Analytics

- **Concept:** A visual representation of sales data.
- **Metrics:**
    - Total revenue (in AEC)
    - Number of sales
    - Top-performing listings
    - Sales trends over time (daily, weekly, monthly)

### b. Listing Management

- **Concept:** A table-based view of all the creator's listings.
- **Functionality:**
    - Create new listings
    - Edit existing listings
    - Delist or relist items
    - View the status of each listing (active, sold, delisted)

### c. Payout Information

- **Concept:** A section for creators to manage their payout settings and view their payout history.
- **Functionality:**
    - Connect a Stripe account for payouts.
    - View current balance available for payout.
    - View a history of past payouts.

## 3. Database Schema

No new tables are required for the creator dashboard. The existing `listings`, `transactions`, and `users` tables will be used to populate the dashboard.

## 4. Implementation Plan

1.  **API Endpoints:** Create new API endpoints to aggregate and serve the data required for the creator dashboard.
2.  **Frontend Development:** Build the creator dashboard interface using a combination of charts, tables, and forms.
3.  **Stripe Integration:** Integrate with Stripe Connect to allow creators to link their bank accounts for payouts.

