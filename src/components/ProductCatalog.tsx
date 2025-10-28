import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './ProductCatalog.css'; // Assuming a CSS file for styling

// --- 1. TypeScript Interfaces and Types ---

/**
 * Defines the structure for a single product review.
 */
interface Review {
  id: number;
  userId: number;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

/**
 * Defines the structure for a single product.
 */
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  stock: number;
  imageUrl: string;
  isNew: boolean;
  isFeatured: boolean;
  // AETHERIAL Enhancement: Blockchain-verified authenticity status
  blockchainVerified: boolean;
  // AETHERIAL Enhancement: AI-generated product summary (abstract feature)
  aiSummary: string;
  // Related e-learning course ID (abstract feature from BuddyBoss/Unified Platform knowledge)
  relatedCourseId?: number;
  // Sample reviews for the product
  reviews: Review[];
}

/**
 * Defines the state structure for filters.
 */
interface Filters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  isFeatured: boolean;
}

/**
 * Defines the props for the main component.
 */
interface ProductCatalogProps {
  // In a real application, this would be fetched from an API
  initialProducts: Product[];
}

// --- 3. Sample Data ---

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Aetherial Smart Watch v3",
    description: "The latest in wearable tech, featuring integrated DeFi wallet and AI-powered health monitoring.",
    price: 499.99,
    currency: "USD",
    category: "Electronics",
    stock: 15,
    imageUrl: "https://example.com/images/watch.jpg",
    isNew: true,
    isFeatured: true,
    blockchainVerified: true,
    aiSummary: "Cutting-edge smartwatch with DeFi and advanced AI health tracking.",
    relatedCourseId: 101,
    reviews: [
      { id: 101, userId: 1, userName: "Alice", rating: 5, comment: "Amazing features and sleek design!", date: "2025-10-20" },
      { id: 102, userId: 2, userName: "Bob", rating: 4, comment: "A bit pricey, but worth it for the DeFi integration.", date: "2025-10-22" },
    ],
  },
  {
    id: 2,
    name: "Decentralized Finance E-book",
    description: "A comprehensive guide to understanding and utilizing decentralized finance protocols.",
    price: 29.99,
    currency: "USD",
    category: "Digital Goods",
    stock: 999,
    imageUrl: "https://example.com/images/ebook.jpg",
    isNew: false,
    isFeatured: false,
    blockchainVerified: true,
    aiSummary: "In-depth guide to DeFi protocols and strategies.",
    relatedCourseId: 202,
    reviews: [
      { id: 201, userId: 3, userName: "Charlie", rating: 5, comment: "Best resource on DeFi I've found!", date: "2025-10-15" },
    ],
  },
  {
    id: 3,
    name: "Quantum Mesh Router",
    description: "Ultra-fast, secure router with built-in VPN and AI traffic optimization.",
    price: 199.50,
    currency: "USD",
    category: "Electronics",
    stock: 5,
    imageUrl: "https://example.com/images/router.jpg",
    isNew: true,
    isFeatured: false,
    blockchainVerified: false,
    aiSummary: "High-speed, secure router with AI optimization.",
    reviews: [],
  },
  {
    id: 4,
    name: "BuddyBoss Theme Pack",
    description: "A collection of premium BuddyBoss themes for social networking websites.",
    price: 89.00,
    currency: "USD",
    category: "Digital Goods",
    stock: 500,
    imageUrl: "https://example.com/images/theme.jpg",
    isNew: false,
    isFeatured: true,
    blockchainVerified: false,
    aiSummary: "Premium theme collection for BuddyBoss-powered social sites.",
    reviews: [
      { id: 401, userId: 4, userName: "David", rating: 4, comment: "Easy to customize and looks great.", date: "2025-10-01" },
      { id: 402, userId: 5, userName: "Eve", rating: 5, comment: "Perfect for my community site.", date: "2025-10-05" },
    ],
  },
];

// Helper function to calculate average rating
const getAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.length;
};

// Available categories for the filter dropdown
const CATEGORIES = Array.from(new Set(SAMPLE_PRODUCTS.map(p => p.category)));

// Initial state for filters
const INITIAL_FILTERS: Filters = {
  search: '',
  category: 'All',
  minPrice: 0,
  maxPrice: 1000,
  minRating: 0,
  isFeatured: false,
};

type ViewMode = 'grid' | 'list';

// --- Main Component ---

/**
 * The main Product Catalog component.
 * @param initialProducts - The list of products to display.
 */
const ProductCatalog: React.FC<ProductCatalogProps> = ({ initialProducts: propProducts }) => {
  // --- 2. State management with useState/useEffect ---

  // State for the list of products (simulating data fetching)
  const [products, setProducts] = useState<Product[]>([]);
  // State for the current filter settings
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  // State for the current view mode (grid or list)
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  // State for items in the shopping cart (just IDs for simplicity)
  const [cartItems, setCartItems] = useState<Set<number>>(new Set());
  // State for items in the wishlist (just IDs for simplicity)
  const [wishlistItems, setWishlistItems] = useState<Set<number>>(new Set());
  // State to track if data is loading
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data fetching on component mount
  useEffect(() => {
    // In a real application, an API call would happen here
    setIsLoading(true);
    const fetchProducts = () => {
      return new Promise<Product[]>(resolve => {
        setTimeout(() => {
          resolve(propProducts);
        }, 500); // Simulate network delay
      });
    };

    fetchProducts().then(data => {
      setProducts(data);
      setIsLoading(false);
    });
  }, [propProducts]);

  // --- 4. All interactive features (handlers) ---

  // Handler for filter changes (e.g., text input, number input)
  const handleFilterChange = useCallback((key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Handler for category filter change (e.g., select dropdown)
  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterChange('category', e.target.value);
  }, [handleFilterChange]);

  // Handler for search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange('search', e.target.value);
  }, [handleFilterChange]);

  // Handler for view mode toggle
  const toggleViewMode = useCallback(() => {
    setViewMode(prev => (prev === 'grid' ? 'list' : 'grid'));
  }, []);

  // Handler for adding/removing items from the cart
  const handleAddToCart = useCallback((productId: number) => {
    setCartItems(prev => {
      const newCart = new Set(prev);
      if (newCart.has(productId)) {
        newCart.delete(productId);
        console.log(`Product ${productId} removed from cart.`);
      } else {
        newCart.add(productId);
        console.log(`Product ${productId} added to cart.`);
      }
      return newCart;
    });
  }, []);

  // Handler for adding/removing items from the wishlist
  const handleToggleWishlist = useCallback((productId: number) => {
    setWishlistItems(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
        console.log(`Product ${productId} removed from wishlist.`);
      } else {
        newWishlist.add(productId);
        console.log(`Product ${productId} added to wishlist.`);
      }
      return newWishlist;
    });
  }, []);

  // --- Core Filtering Logic (useMemo for performance) ---

  /**
   * Memoized function to filter and sort the products based on the current state.
   */
  const filteredProducts = useMemo(() => {
    if (isLoading) return [];

    return products.filter(product => {
      const { search, category, minPrice, maxPrice, minRating, isFeatured } = filters;
      const avgRating = getAverageRating(product.reviews);

      // 1. Search filter
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                            product.description.toLowerCase().includes(search.toLowerCase());

      // 2. Category filter
      const matchesCategory = category === 'All' || product.category === category;

      // 3. Price filter
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

      // 4. Rating filter
      const matchesRating = avgRating >= minRating;

      // 5. Featured filter
      const matchesFeatured = !isFeatured || product.isFeatured;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesFeatured;
    }).sort((a, b) => {
      // Simple sort: Featured products first, then by price
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return a.price - b.price;
    });
  }, [products, filters, isLoading]);


  // --- Sub-Components (Inline for simplicity, could be separate files) ---

  /**
   * Renders a single product card in either grid or list view.
   */
  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const avgRating = getAverageRating(product.reviews);
    const isInCart = cartItems.has(product.id);
    const isInWishlist = wishlistItems.has(product.id);

    // Helper to render star rating
    const renderRating = (rating: number) => {
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 !== 0;
      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

      return (
        <div className="product-rating">
          {'★'.repeat(fullStars)}
          {hasHalfStar && '½'}
          {'☆'.repeat(emptyStars)}
          <span className="rating-count">({product.reviews.length})</span>
        </div>
      );
    };

    // 6. Comments explaining functionality
    return (
      <div className={`product-card product-card-${viewMode}`}>
        <img src={product.imageUrl} alt={product.name} className="product-image" />
        <div className="product-details">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">{product.currency} {product.price.toFixed(2)}</p>
          {renderRating(avgRating)}

          {/* AETHERIAL Enhancement Display */}
          <div className="aetherial-features">
            {product.blockchainVerified && (
              <span className="feature-tag verified-tag" title="Blockchain Verified">
                ✅ Verified
              </span>
            )}
            <span className="feature-tag ai-tag" title={product.aiSummary}>
              🧠 AI Summary
            </span>
          </div>

          {/* Only show full description in list view */}
          {viewMode === 'list' && (
            <p className="product-description">{product.description}</p>
          )}

          {/* Interactive features: Cart and Wishlist */}
          <div className="product-actions">
            <button
              className={`action-btn cart-btn ${isInCart ? 'in-cart' : ''}`}
              onClick={() => handleAddToCart(product.id)}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : isInCart ? 'Remove from Cart' : 'Add to Cart'}
            </button>
            <button
              className={`action-btn wishlist-btn ${isInWishlist ? 'in-wishlist' : ''}`}
              onClick={() => handleToggleWishlist(product.id)}
            >
              {isInWishlist ? '❤️ Wishlisted' : '🤍 Wishlist'}
            </button>
          </div>

          {/* BuddyBoss/Unified Platform Feature: Link to related course */}
          {product.relatedCourseId && (
            <a href={`/courses/${product.relatedCourseId}`} className="related-course-link">
              Learn more in related course
            </a>
          )}
        </div>
      </div>
    );
  };

  /**
   * Renders the filter and control panel.
   */
  const FilterPanel: React.FC = () => (
    <div className="filter-panel">
      <h4>Filters</h4>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search products..."
        value={filters.search}
        onChange={handleSearchChange}
        className="filter-input"
      />

      {/* Category Filter */}
      <label>Category:</label>
      <select value={filters.category} onChange={handleCategoryChange} className="filter-select">
        <option value="All">All Categories</option>
        {CATEGORIES.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Price Range Filter */}
      <label>Price Range:</label>
      <div className="price-range-group">
        <input
          type="number"
          value={filters.minPrice}
          onChange={e => handleFilterChange('minPrice', Number(e.target.value))}
          placeholder="Min Price"
          min="0"
          className="filter-input-small"
        />
        <span>-</span>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={e => handleFilterChange('maxPrice', Number(e.target.value))}
          placeholder="Max Price"
          min="0"
          className="filter-input-small"
        />
      </div>

      {/* Minimum Rating Filter */}
      <label>Minimum Rating:</label>
      <input
        type="range"
        min="0"
        max="5"
        step="1"
        value={filters.minRating}
        onChange={e => handleFilterChange('minRating', Number(e.target.value))}
        className="filter-range"
      />
      <span>{filters.minRating} Stars & Up</span>

      {/* Featured Toggle */}
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={filters.isFeatured}
          onChange={e => handleFilterChange('isFeatured', e.target.checked)}
        />
        Show Featured Only
      </label>

      {/* Reset Button */}
      <button className="reset-btn" onClick={() => setFilters(INITIAL_FILTERS)}>
        Reset Filters
      </button>

      {/* View Mode Toggle Button */}
      <button className="view-toggle-btn" onClick={toggleViewMode}>
        Switch to {viewMode === 'grid' ? 'List' : 'Grid'} View
      </button>
    </div>
  );

  // --- Main Render ---

  if (isLoading) {
    return <div className="product-catalog-loading">Loading Products...</div>;
  }

  return (
    <div className="product-catalog-container">
      <h1 className="catalog-header">Product Catalog</h1>

      <div className="catalog-content">
        <FilterPanel />

        <div className="product-list-area">
          <div className="result-info">
            Showing {filteredProducts.length} of {products.length} products.
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-results">No products match your current filters.</div>
          ) : (
            <div className={`product-list product-list-${viewMode}`}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Abstract Cart and Wishlist Summary (Non-interactive for this component, just showing count) */}
      <div className="summary-bar">
        <span>🛒 Cart: {cartItems.size} items</span>
        <span>✨ Wishlist: {wishlistItems.size} items</span>
      </div>
    </div>
  );
};

// 7. Export default at the end
export default ProductCatalog;