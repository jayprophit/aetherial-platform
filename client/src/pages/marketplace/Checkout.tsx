import React, { useState } from 'react';
import './Checkout.css';

interface CheckoutStep {
  id: number;
  title: string;
  completed: boolean;
}

const Checkout: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'crypto' | 'bank'>('card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const steps: CheckoutStep[] = [
    { id: 1, title: 'Shipping', completed: currentStep > 1 },
    { id: 2, title: 'Payment', completed: currentStep > 2 },
    { id: 3, title: 'Review', completed: currentStep > 3 }
  ];

  // Mock cart data
  const cartItems = [
    { name: 'Professional 4K Camera Drone', price: 1299.99, quantity: 1 },
    { name: 'Wireless Noise-Cancelling Headphones', price: 349.99, quantity: 2 }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 15.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate shipping info
      if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.address) {
        alert('Please fill in all required fields');
        return;
      }
    }
    if (currentStep === 2) {
      // Validate payment info
      if (paymentMethod === 'card' && (!cardInfo.cardNumber || !cardInfo.cardName)) {
        alert('Please fill in card information');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePlaceOrder = () => {
    alert('Order placed successfully! 🎉');
    window.location.href = '/orders';
  };

  return (
    <div className="checkout">
      <div className="checkout-container">
        <h1>🛒 Checkout</h1>

        {/* Progress Steps */}
        <div className="checkout-steps">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className={`step ${currentStep === step.id ? 'active' : ''} ${step.completed ? 'completed' : ''}`}>
                <div className="step-number">
                  {step.completed ? '✓' : step.id}
                </div>
                <div className="step-title">{step.title}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`step-connector ${step.completed ? 'completed' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="checkout-content">
          {/* Main Content */}
          <div className="checkout-main">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <div className="checkout-section">
                <h2>📦 Shipping Information</h2>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Address *</label>
                    <input
                      type="text"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      placeholder="123 Main Street, Apt 4B"
                    />
                  </div>
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      placeholder="New York"
                    />
                  </div>
                  <div className="form-group">
                    <label>State/Province</label>
                    <input
                      type="text"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                      placeholder="NY"
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP/Postal Code *</label>
                    <input
                      type="text"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                      placeholder="10001"
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <select
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                      <option>Germany</option>
                      <option>France</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <div className="checkout-section">
                <h2>💳 Payment Method</h2>
                
                <div className="payment-methods">
                  <div
                    className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <input type="radio" checked={paymentMethod === 'card'} readOnly />
                    <span>💳 Credit/Debit Card</span>
                  </div>
                  <div
                    className={`payment-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('paypal')}
                  >
                    <input type="radio" checked={paymentMethod === 'paypal'} readOnly />
                    <span>💰 PayPal</span>
                  </div>
                  <div
                    className={`payment-option ${paymentMethod === 'crypto' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('crypto')}
                  >
                    <input type="radio" checked={paymentMethod === 'crypto'} readOnly />
                    <span>₿ Cryptocurrency</span>
                  </div>
                  <div
                    className={`payment-option ${paymentMethod === 'bank' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('bank')}
                  >
                    <input type="radio" checked={paymentMethod === 'bank'} readOnly />
                    <span>🏦 Bank Transfer</span>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="card-form">
                    <div className="form-group full-width">
                      <label>Card Number *</label>
                      <input
                        type="text"
                        value={cardInfo.cardNumber}
                        onChange={(e) => setCardInfo({...cardInfo, cardNumber: e.target.value})}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Cardholder Name *</label>
                      <input
                        type="text"
                        value={cardInfo.cardName}
                        onChange={(e) => setCardInfo({...cardInfo, cardName: e.target.value})}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="form-group">
                      <label>Expiry Date *</label>
                      <input
                        type="text"
                        value={cardInfo.expiryDate}
                        onChange={(e) => setCardInfo({...cardInfo, expiryDate: e.target.value})}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV *</label>
                      <input
                        type="text"
                        value={cardInfo.cvv}
                        onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="payment-info">
                    <p>You will be redirected to PayPal to complete your purchase.</p>
                  </div>
                )}

                {paymentMethod === 'crypto' && (
                  <div className="payment-info">
                    <p>Select cryptocurrency:</p>
                    <select>
                      <option>Bitcoin (BTC)</option>
                      <option>Ethereum (ETH)</option>
                      <option>USDT</option>
                      <option>USDC</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'bank' && (
                  <div className="payment-info">
                    <p>Bank transfer details will be provided after order confirmation.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <div className="checkout-section">
                <h2>📋 Review Your Order</h2>
                
                <div className="review-section">
                  <h3>Shipping Address</h3>
                  <p>{shippingInfo.fullName}</p>
                  <p>{shippingInfo.address}</p>
                  <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                  <p>{shippingInfo.country}</p>
                  <button onClick={() => setCurrentStep(1)}>Edit</button>
                </div>

                <div className="review-section">
                  <h3>Payment Method</h3>
                  <p>{paymentMethod === 'card' && '💳 Credit/Debit Card'}</p>
                  <p>{paymentMethod === 'paypal' && '💰 PayPal'}</p>
                  <p>{paymentMethod === 'crypto' && '₿ Cryptocurrency'}</p>
                  <p>{paymentMethod === 'bank' && '🏦 Bank Transfer'}</p>
                  {paymentMethod === 'card' && cardInfo.cardNumber && (
                    <p>**** **** **** {cardInfo.cardNumber.slice(-4)}</p>
                  )}
                  <button onClick={() => setCurrentStep(2)}>Edit</button>
                </div>

                <div className="review-section">
                  <h3>Order Items</h3>
                  {cartItems.map((item, index) => (
                    <div key={index} className="review-item">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="checkout-navigation">
              {currentStep > 1 && (
                <button className="btn-secondary" onClick={handlePreviousStep}>
                  ← Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button className="btn-primary" onClick={handleNextStep}>
                  Continue →
                </button>
              ) : (
                <button className="btn-primary" onClick={handlePlaceOrder}>
                  Place Order 🎉
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cartItems.map((item, index) => (
                <div key={index} className="summary-item">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-line">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="security-badge">
              🔒 Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

