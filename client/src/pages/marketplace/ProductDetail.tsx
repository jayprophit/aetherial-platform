import React, { useState } from 'react';
import './ProductDetail.css';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  seller: {
    name: string;
    rating: number;
    verified: boolean;
  };
  stock: number;
  category: string;
  tags: string[];
  relatedCourses?: Array<{
    id: string;
    title: string;
    thumbnail: string;
    price: number;
  }>;
}

const ProductDetail: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState<'description' | 'specs' | 'reviews'>('description');

  // Mock product data
  const product: Product = {
    id: 'prod-1',
    name: 'Professional 4K Camera Drone',
    price: 1299.99,
    originalPrice: 1599.99,
    rating: 4.8,
    reviewCount: 342,
    images: [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/800/600?random=2',
      'https://picsum.photos/800/600?random=3',
      'https://picsum.photos/800/600?random=4'
    ],
    description: 'Capture stunning aerial footage with our professional 4K camera drone. Features advanced stabilization, intelligent flight modes, and up to 30 minutes of flight time. Perfect for photography enthusiasts and content creators.',
    features: [
      '4K Ultra HD Camera with 3-axis gimbal',
      '30 minutes maximum flight time',
      'Obstacle avoidance system',
      'GPS and GLONASS positioning',
      'Intelligent flight modes',
      '5km transmission range',
      'Foldable and portable design'
    ],
    specifications: {
      'Weight': '899g',
      'Max Speed': '68 km/h',
      'Max Flight Time': '30 minutes',
      'Camera Resolution': '4K/60fps',
      'Photo Resolution': '20MP',
      'Battery Capacity': '3850mAh',
      'Charging Time': '90 minutes',
      'Operating Temperature': '-10°C to 40°C'
    },
    seller: {
      name: 'TechGear Pro',
      rating: 4.9,
      verified: true
    },
    stock: 47,
    category: 'Electronics',
    tags: ['Drone', 'Camera', '4K', 'Photography', 'Aerial'],
    relatedCourses: [
      {
        id: 'course-1',
        title: 'Drone Photography Masterclass',
        thumbnail: 'https://picsum.photos/300/200?random=10',
        price: 49.99
      },
      {
        id: 'course-2',
        title: 'Aerial Videography for Beginners',
        thumbnail: 'https://picsum.photos/300/200?random=11',
        price: 39.99
      }
    ]
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} item(s) to cart`);
  };

  const handleBuyNow = () => {
    alert('Proceeding to checkout...');
  };

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a href="/marketplace">Marketplace</a>
          <span>/</span>
          <a href={`/marketplace/category/${product.category}`}>{product.category}</a>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="product-main">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              <img src={product.images[selectedImage]} alt={product.name} />
              {product.originalPrice && (
                <div className="discount-badge">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>
            <div className="thumbnail-list">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={selectedImage === index ? 'active' : ''}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1>{product.name}</h1>
            
            <div className="product-rating">
              <div className="stars">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span className="rating-value">{product.rating}</span>
              <span className="review-count">({product.reviewCount} reviews)</span>
            </div>

            <div className="product-price">
              <span className="current-price">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="original-price">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <div className="product-stock">
              {product.stock > 0 ? (
                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">✗ Out of Stock</span>
              )}
            </div>

            <div className="product-seller">
              <span>Sold by:</span>
              <a href={`/seller/${product.seller.name}`} className="seller-name">
                {product.seller.name}
                {product.seller.verified && <span className="verified-badge">✓ Verified</span>}
              </a>
              <span className="seller-rating">★ {product.seller.rating}</span>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input type="number" value={quantity} min="1" max={product.stock} readOnly />
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>

              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                🛒 Add to Cart
              </button>
              <button className="buy-now-btn" onClick={handleBuyNow}>
                ⚡ Buy Now
              </button>
            </div>

            <div className="product-tags">
              {product.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="product-details">
          <div className="tabs">
            <button
              className={selectedTab === 'description' ? 'active' : ''}
              onClick={() => setSelectedTab('description')}
            >
              Description
            </button>
            <button
              className={selectedTab === 'specs' ? 'active' : ''}
              onClick={() => setSelectedTab('specs')}
            >
              Specifications
            </button>
            <button
              className={selectedTab === 'reviews' ? 'active' : ''}
              onClick={() => setSelectedTab('reviews')}
            >
              Reviews ({product.reviewCount})
            </button>
          </div>

          <div className="tab-content">
            {selectedTab === 'description' && (
              <div className="description-content">
                <p>{product.description}</p>
                <h3>Key Features:</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedTab === 'specs' && (
              <div className="specs-content">
                <table>
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <td className="spec-label">{key}</td>
                        <td className="spec-value">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedTab === 'reviews' && (
              <div className="reviews-content">
                <div className="review-summary">
                  <div className="average-rating">
                    <span className="rating-number">{product.rating}</span>
                    <div className="stars">
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span className="total-reviews">{product.reviewCount} reviews</span>
                  </div>
                </div>
                <div className="review-list">
                  <p>Reviews coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Courses */}
        {product.relatedCourses && product.relatedCourses.length > 0 && (
          <div className="related-courses">
            <h2>📚 Learn More with Related Courses</h2>
            <div className="courses-grid">
              {product.relatedCourses.map(course => (
                <div key={course.id} className="course-card">
                  <img src={course.thumbnail} alt={course.title} />
                  <h3>{course.title}</h3>
                  <p className="course-price">${course.price.toFixed(2)}</p>
                  <button>View Course</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

