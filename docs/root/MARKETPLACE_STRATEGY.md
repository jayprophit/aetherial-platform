# AETHERIAL Platform Marketplace

## 1. Objective

To create a user-driven marketplace where users can list, discover, and purchase virtual goods and services using Aether Coins (AEC). This will foster a vibrant creator economy within the AETHERIAL platform.

## 2. Core Components

### a. Listings

- **Concept:** An item or service for sale in the marketplace.
- **Attributes:**
    - Title
    - Description
    - Price (in AEC)
    - Category
    - Media (images, videos)
    - Seller information

### b. Categories

- **Concept:** Listings will be organized into categories to facilitate discovery.
- **Examples:**
    - Digital Art
    - 3D Models
    - Music & Audio
    - Game Assets
    - Services (e.g., custom avatar creation)

### c. Reviews

- **Concept:** Buyers can leave reviews and ratings for purchased items.
- **Attributes:**
    - Rating (1-5 stars)
    - Comment
    - Buyer information

## 3. Database Schema

```sql
-- Categories
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
);

-- Listings
CREATE TABLE listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  seller_id INT NOT NULL,
  category_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  media JSON,
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- e.g., 'active', 'sold', 'delisted'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Reviews
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listing_id INT NOT NULL,
  buyer_id INT NOT NULL,
  rating INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES listings(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id)
);
```

## 4. Implementation Plan

1.  **Database Schema:** Update the database schema to include the `categories`, `listings`, and `reviews` tables.
2.  **Marketplace Service:** Create a service to manage listings, categories, and reviews.
3.  **API Endpoints:** Create API endpoints for creating, reading, updating, and deleting marketplace items.
4.  **Frontend Integration:** Integrate the marketplace into the user interface, including a marketplace browser, listing creation form, and review submission of course, the ability to purchase items.
