// src/components/ShoppingCartCheckout.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CartState,
  CartItem,
  CheckoutFormState,
  ShippingAddress,
  PaymentMethod,
  SAMPLE_PRODUCTS,
  SAMPLE_PAYMENT_METHODS,
  INITIAL_CHECKOUT_FORM_STATE,
  calculateCartState,
} from '../types/cart';

// Define the steps for the checkout process
type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'review' | 'confirmation';

/**
 * Helper function to format currency
 * @param amount The number to format
 * @returns A string formatted as currency (e.g., "$1,234.56")
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// --- Cart Item Component (Internal Helper) ---

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const { product, quantity } = item;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      onUpdateQuantity(product.id, newQuantity);
    }
  };

  return (
    <div className="cart-item-row flex items-center justify-between py-4 border-b">
      <div className="flex items-center space-x-4">
        <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
        <div>
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.isDigital ? 'Digital Product' : 'Physical Item'}</p>
          {/* AETHERIAL Enhancement: Display truncated blockchain token ID for digital assets */}
          {product.blockchainTokenId && (
            <p className="text-xs text-blue-600">Token ID: {product.blockchainTokenId.substring(0, 10)}...</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-16 p-1 border rounded text-center"
          />
        </div>
        <div className="w-20 text-right font-medium">
          {formatCurrency(product.price * quantity)}
        </div>
        <button onClick={() => onRemoveItem(product.id)} className="text-red-500 hover:text-red-700 text-sm">
          Remove
        </button>
      </div>
    </div>
  );
};

// --- Main Shopping Cart & Checkout Component ---

const initialCartItems: CartItem[] = [
  { product: SAMPLE_PRODUCTS[0], quantity: 1 },
  { product: SAMPLE_PRODUCTS[1], quantity: 2 },
];

const initialCartState = calculateCartState(initialCartItems);

const ShoppingCartCheckout: React.FC = () => {
  // --- State Management with useState ---
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [cartState, setCartState] = useState<CartState>(initialCartState);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutFormState>(INITIAL_CHECKOUT_FORM_STATE);
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // --- Effects for Cart Calculation (using useEffect) ---
  useEffect(() => {
    // Recalculate cart state whenever cartItems changes
    const newCartState = calculateCartState(cartItems);
    setCartState(newCartState);
  }, [cartItems]);

  // --- Cart Management Logic (using useCallback for optimization) ---

  const handleUpdateQuantity = useCallback((productId: string, newQuantity: number) => {
    setCartItems(prevItems => {
      if (newQuantity <= 0) {
        // If quantity is 0 or less, remove the item
        return prevItems.filter(item => item.product.id !== productId);
      }
      return prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  }, []);

  const handleRemoveItem = useCallback((productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  }, []);

  // --- Checkout Form Logic ---

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [name]: value,
      },
    }));
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCheckoutForm(prev => ({
      ...prev,
      selectedPaymentMethodId: e.target.value,
    }));
  };

  const handleAIOptimizationToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckoutForm(prev => ({
      ...prev,
      useAIOptimization: e.target.checked,
    }));
  };

  const handleCryptoWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckoutForm(prev => ({
      ...prev,
      cryptoWalletAddress: e.target.value,
    }));
  };

  // --- Navigation Logic ---

  const nextStep = () => {
    const steps: CheckoutStep[] = ['cart', 'shipping', 'payment', 'review', 'confirmation'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: CheckoutStep[] = ['cart', 'shipping', 'payment', 'review', 'confirmation'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  // --- Order Submission Logic (Simulated) ---

  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsProcessing(true);
    console.log('Submitting Order with Data:', { cartState, checkoutForm });

    // AETHERIAL Enhancement: Simulate AI-driven order validation and optimization
    if (checkoutForm.useAIOptimization) {
      console.log('AI Optimization: Validating shipping route and payment security...');
      // In a real app, this would be an API call to an AI service
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // AETHERIAL Enhancement: Simulate Blockchain Transaction (e.g., token lock or payment)
    const selectedMethod = SAMPLE_PAYMENT_METHODS.find(pm => pm.id === checkoutForm.selectedPaymentMethodId);
    if (selectedMethod?.isDeFi) {
      console.log(`DeFi Payment: Initiating smart contract transaction for ${formatCurrency(cartState.total)}...`);
      // In a real app, this would involve a Web3 provider
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Simulate successful order creation
    const newOrderId = `ORD-${Date.now()}`;
    setOrderId(newOrderId);
    setIsProcessing(false);
    nextStep();
  };

  // --- Render Functions for Each Step ---

  const renderCartView = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6">Your Shopping Cart ({cartItems.length} items)</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty. Time to find some Aetherial tech!</p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {cartItems.map(item => (
            <CartItemRow
              key={item.product.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          ))}
        </div>
      )}
      <button
        onClick={nextStep}
        disabled={cartItems.length === 0}
        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
      >
        Proceed to Checkout
      </button>
    </div>
  );

  const renderShippingForm = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6">Shipping Information</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-md">
        {/* Simplified form for brevity - in a real app, use a dedicated form library */}
        <input type="text" name="fullName" placeholder="Full Name" value={checkoutForm.shippingAddress.fullName} onChange={handleShippingChange} className="p-3 border rounded col-span-2" required />
        <input type="text" name="addressLine1" placeholder="Address Line 1" value={checkoutForm.shippingAddress.addressLine1} onChange={handleShippingChange} className="p-3 border rounded col-span-2" required />
        <input type="text" name="addressLine2" placeholder="Address Line 2 (Optional)" value={checkoutForm.shippingAddress.addressLine2 || ''} onChange={handleShippingChange} className="p-3 border rounded col-span-2" />
        <input type="text" name="city" placeholder="City" value={checkoutForm.shippingAddress.city} onChange={handleShippingChange} className="p-3 border rounded" required />
        <input type="text" name="state" placeholder="State/Province" value={checkoutForm.shippingAddress.state} onChange={handleShippingChange} className="p-3 border rounded" required />
        <input type="text" name="zipCode" placeholder="ZIP/Postal Code" value={checkoutForm.shippingAddress.zipCode} onChange={handleShippingChange} className="p-3 border rounded" required />
        <input type="text" name="country" placeholder="Country" value={checkoutForm.shippingAddress.country} onChange={handleShippingChange} className="p-3 border rounded" required />
      </form>
      <div className="flex justify-between mt-6">
        <button onClick={prevStep} className="bg-gray-300 text-gray-800 p-3 rounded-lg font-semibold hover:bg-gray-400 transition duration-200">
          Back to Cart
        </button>
        <button onClick={nextStep} className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200">
          Continue to Payment
        </button>
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6">Payment Method</h2>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <label className="block text-lg font-medium mb-2">Select Payment Method</label>
        <select
          value={checkoutForm.selectedPaymentMethodId}
          onChange={handlePaymentMethodChange}
          className="w-full p-3 border rounded"
        >
          {SAMPLE_PAYMENT_METHODS.map(method => (
            <option key={method.id} value={method.id}>
              {method.name} {method.isDeFi && '(DeFi Enabled)'}
            </option>
          ))}
        </select>

        {/* AETHERIAL Enhancement: Crypto Wallet Address for Rewards/Refunds */}
        <div className="pt-4">
          <label htmlFor="cryptoWallet" className="block text-sm font-medium text-gray-700">
            Crypto Wallet Address (For Aetherial Rewards/Refunds)
          </label>
          <input
            id="cryptoWallet"
            type="text"
            placeholder="e.g., 0x..."
            value={checkoutForm.cryptoWalletAddress}
            onChange={handleCryptoWalletChange}
            className="w-full p-3 border rounded mt-1"
          />
        </div>

        {/* AETHERIAL Enhancement: AI Optimization Toggle */}
        <div className="flex items-center pt-4">
          <input
            id="aiOptimization"
            type="checkbox"
            checked={checkoutForm.useAIOptimization}
            onChange={handleAIOptimizationToggle}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="aiOptimization" className="ml-2 block text-sm text-gray-900">
            Enable AI Optimization for secure and faster processing (Recommended)
          </label>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={prevStep} className="bg-gray-300 text-gray-800 p-3 rounded-lg font-semibold hover:bg-gray-400 transition duration-200">
          Back to Shipping
        </button>
        <button onClick={nextStep} className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200">
          Review Order
        </button>
      </div>
    </div>
  );

  const renderReviewOrder = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6">Review & Place Order</h2>
      {/* Responsive layout: Order Summary on the side for large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary (Cart Totals) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">Order Summary</h3>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between"><span>Subtotal:</span><span>{formatCurrency(cartState.subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping:</span><span>{formatCurrency(cartState.shippingCost)}</span></div>
            <div className="flex justify-between"><span>Tax (8%):</span><span>{formatCurrency(cartState.tax)}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
              <span>Order Total:</span><span>{formatCurrency(cartState.total)}</span>
            </div>
          </div>
        </div>

        {/* Details Review */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Shipping To</h3>
            <p>{checkoutForm.shippingAddress.fullName}</p>
            <p>{checkoutForm.shippingAddress.addressLine1}</p>
            {checkoutForm.shippingAddress.addressLine2 && <p>{checkoutForm.shippingAddress.addressLine2}</p>}
            <p>{checkoutForm.shippingAddress.city}, {checkoutForm.shippingAddress.state} {checkoutForm.shippingAddress.zipCode}</p>
            <p>{checkoutForm.shippingAddress.country}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Payment & Enhancements</h3>
            <p><strong>Method:</strong> {SAMPLE_PAYMENT_METHODS.find(pm => pm.id === checkoutForm.selectedPaymentMethodId)?.name}</p>
            <p><strong>AI Optimization:</strong> {checkoutForm.useAIOptimization ? 'Enabled' : 'Disabled'}</p>
            {checkoutForm.cryptoWalletAddress && (
              <p><strong>Crypto Wallet:</strong> {checkoutForm.cryptoWalletAddress.substring(0, 20)}...</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={prevStep} className="bg-gray-300 text-gray-800 p-3 rounded-lg font-semibold hover:bg-gray-400 transition duration-200">
          Back to Payment
        </button>
        <button
          onClick={handleSubmitOrder}
          disabled={isProcessing}
          className="bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50 flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              {/* Simple loading spinner for processing state */}
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {checkoutForm.useAIOptimization ? 'Processing with AI...' : 'Placing Order...'}
            </>
          ) : (
            'Place Order'
          )}
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center p-10 bg-white rounded-lg shadow-xl space-y-4">
      <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-3xl font-bold text-green-600">Order Placed Successfully!</h2>
      {orderId && <p className="text-xl text-gray-800">Your Order ID is: <span className="font-mono bg-gray-100 p-1 rounded">{orderId}</span></p>}
      <p className="text-gray-600">
        Thank you for your purchase on the Aetherial Platform.
        You will receive a confirmation email shortly.
      </p>
      <p className="text-sm text-blue-600">
        {/* AETHERIAL Enhancement: Mention of blockchain record */}
        Your transaction details have been recorded on the Aetherial Blockchain for immutable proof of purchase.
      </p>
      <button onClick={() => setStep('cart')} className="mt-6 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200">
        Continue Shopping
      </button>
    </div>
  );

  // --- Main Render Switch ---

  const renderContent = () => {
    switch (step) {
      case 'cart':
        return renderCartView();
      case 'shipping':
        return renderShippingForm();
      case 'payment':
        return renderPaymentForm();
      case 'review':
        return renderReviewOrder();
      case 'confirmation':
        return renderConfirmation();
      default:
        return renderCartView();
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">Aetherial Platform Checkout</h1>
      {/* Step Indicator */}
      <div className="flex space-x-2 mb-8 text-sm font-medium text-gray-500">
        {['cart', 'shipping', 'payment', 'review', 'confirmation'].map((s, index) => (
          <span key={s} className={`px-3 py-1 rounded-full ${step === s ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}>
            {index + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
          </span>
        ))}
      </div>
      <div className="w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default ShoppingCartCheckout;