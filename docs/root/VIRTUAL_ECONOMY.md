# AETHERIAL Platform Virtual Economy

## 1. Objective

To create a thriving in-platform economy that allows users to transact with each other, purchase virtual goods and services, and be rewarded for their contributions. This will be powered by a virtual currency called Aether Coins (AEC).

## 2. Core Components

### a. Aether Coins (AEC)

- **Concept:** Aether Coins are the official virtual currency of the AETHERIAL platform.
- **Acquisition:**
    - Purchased with real money via Stripe.
    - Earned as rewards for completing high-level quests or winning competitions.
- **Usage:**
    - Purchase virtual goods from other users (e.g., digital art, 3D models).
    - Tip other users for their content.
    - Pay for premium features or services.

### b. Wallets

- **Concept:** Every user will have a wallet to store their Aether Coins.
- **Functionality:**
    - View current balance.
    - View transaction history.

### c. Transactions

- **Concept:** All transfers of Aether Coins between users will be recorded as transactions.
- **Types:**
    - **Purchase:** Buying AEC with real money.
    - **Transfer:** Sending AEC to another user (e.g., for a purchase or tip).
    - **Reward:** Receiving AEC as a reward.

## 3. Database Schema

```sql
-- Wallets
CREATE TABLE wallets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Transactions
CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_wallet_id INT,
  to_wallet_id INT,
  amount DECIMAL(10, 2) NOT NULL,
  type VARCHAR(50) NOT NULL, -- e.g., 'purchase', 'transfer', 'reward'
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_wallet_id) REFERENCES wallets(id),
  FOREIGN KEY (to_wallet_id) REFERENCES wallets(id)
);
```

## 4. Implementation Plan

1.  **Database Schema:** Update the database schema to include the `wallets` and `transactions` tables.
2.  **Economy Service:** Create a service to manage wallet creation, balance updates, and transaction processing.
3.  **Stripe Integration:** Extend the existing Stripe integration to handle the purchase of Aether Coins.
4.  **API Endpoints:** Create API endpoints for wallet and transaction management.
5.  **Frontend Integration:** Integrate the virtual economy features into the user interface, including a wallet view and options to tip users or purchase virtual goods.

