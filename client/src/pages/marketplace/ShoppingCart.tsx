import React, { useState } from 'react';
import './ShoppingCart.css';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  seller: string;
}

const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-1',
      productId: 'prod-1',
      name: 'Professional 4K Camera Drone',
      image: 'https://picsum.photos/150/150?random=1',
      price: 1299.99,
      quantity: 1,
      stock: 47,
      seller: 'TechGear Pro'
    },
    {
      id: 'cart-2',
      productId: 'prod-2',
      name: 'Wireless Noise-Cancelling Headphones',
      image: 'https://picsum.photos/150/150?random=2',
      price: 349.99,
      quantity: 2,
      stock: 120,
      seller: 'AudioMax'
    },
    {
      id: 'cart-3',
      productId: 'prod-3',
      name: 'Smart Fitness Watch',
      image: 'https://picsum.photos/150/150?random=3',
      price: 249.99,
      quantity: 1,
      stock: 85,
      seller: 'FitTech'
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{code: string; discount: number} | null>(null);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, Math.min(item.stock, newQuantity)) }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const applyPromoCode = () => {
    // Mock promo code validation
    if (promoCode === 'SAVE10') {
      setAppliedPromo({ code: promoCode, discount: 0.10 });
      alert('Promo code applied! 10% discount');
    } else if (promoCode === 'SAVE20') {
      setAppliedPromo({ code: promoCode, discount: 0.20 });
      alert('Promo code applied! 20% discount');
    } else {
      alert('Invalid promo code');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
  const shipping = subtotal > 500 ? 0 : 15.99;
  const tax = (subtotal - discount) * 0.08; // 8% tax
  const total = subtotal - discount + shipping + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    alert('Proceeding to checkout...');
    window.location.href = '/checkout';
  };

  return (
    <div className="shopping-cart">
      <div className="cart-container">
        <h1>🛒 Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <a href="/marketplace" className="continue-shopping-btn">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-items">
              <div className="cart-header">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span></span>
              </div>

              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-product">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <a href={`/product/${item.productId}`} className="item-name">
                        {item.name}
                      </a>
                      <span className="item-seller">Sold by: {item.seller}</span>
                      {item.stock < 10 && (
                        <span className="low-stock">Only {item.stock} left in stock!</span>
                      )}
                    </div>
                  </div>

                  <div className="item-price">
                    ${item.price.toFixed(2)}
                  </div>

                  <div className="item-quantity">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                      min="1"
                      max={item.stock}
                    />
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button className="remove-btn" onClick={() => removeItem(item.id)}>
                    🗑️
                  </button>
                </div>
              ))}

              <div className="cart-actions">
                <a href="/marketplace" className="continue-shopping">
                  ← Continue Shopping
                </a>
                <button className="clear-cart-btn" onClick={() => setCartItems([])}>
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h2>Order Summary</h2>

              <div className="promo-code">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button onClick={applyPromoCode}>Apply</button>
              </div>

              {appliedPromo && (
                <div className="applied-promo">
                  ✓ Promo code "{appliedPromo.code}" applied
                  <button onClick={() => setAppliedPromo(null)}>Remove</button>
                </div>
              )}

              <div className="summary-line">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {appliedPromo && (
                <div className="summary-line discount">
                  <span>Discount ({appliedPromo.discount * 100}%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-line">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>

              {shipping === 0 && (
                <div className="free-shipping-notice">
                  🎉 You qualify for free shipping!
                </div>
              )}

              {subtotal < 500 && (
                <div className="shipping-notice">
                  Add ${(500 - subtotal).toFixed(2)} more for free shipping
                </div>
              )}

              <div className="summary-line">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="summary-line total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout →
              </button>

              <div className="payment-methods">
                <span>We accept:</span>
                <div className="payment-icons">
                  💳 💰 🏦 📱
                </div>
              </div>

              <div className="security-badge">
                🔒 Secure Checkout
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;

