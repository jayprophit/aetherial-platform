/**
 * AETHERIAL Drop Shipping System
 * 
 * Military-Grade Drop Shipping Platform
 * 
 * Features:
 * - Product sourcing and import
 * - Multi-supplier management
 * - Automated order fulfillment
 * - Real-time inventory sync
 * - Profit calculator
 * - Shipping tracking
 * - Analytics dashboard
 * - Supplier ratings
 * - Bulk import/export
 * 
 * @module pages/marketplace/DropShipping
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './DropShipping.css';

/**
 * Product Interface
 */
export interface DropShippingProduct {
  id: string;
  supplierId: string;
  supplierName: string;
  title: string;
  description: string;
  images: string[];
  costPrice: number;
  suggestedRetailPrice: number;
  yourPrice: number;
  profit: number;
  profitMargin: number;
  category: string;
  sku: string;
  stock: number;
  shippingTime: string;
  shippingCost: number;
  rating: number;
  reviews: number;
  imported: boolean;
  published: boolean;
}

/**
 * Supplier Interface
 */
export interface Supplier {
  id: string;
  name: string;
  country: string;
  rating: number;
  totalProducts: number;
  averageShippingTime: string;
  returnPolicy: string;
  minOrder: number;
  verified: boolean;
  responseTime: string;
}

/**
 * Order Interface
 */
export interface DropShippingOrder {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  quantity: number;
  customerPrice: number;
  costPrice: number;
  profit: number;
  supplierId: string;
  supplierName: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  customerEmail: string;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Drop Shipping Dashboard Component
 */
export const DropShipping: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'suppliers' | 'orders' | 'analytics'>('products');
  const [products, setProducts] = useState<DropShippingProduct[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders] = useState<DropShippingOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minProfitMargin, setMinProfitMargin] = useState(20);
  
  /**
   * Load data on mount
   */
  useEffect(() => {
    loadProducts();
    loadSuppliers();
    loadOrders();
  }, []);
  
  /**
   * Load products from suppliers
   */
  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dropshipping/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Load suppliers
   */
  const loadSuppliers = async () => {
    try {
      const response = await fetch('/api/dropshipping/suppliers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data.suppliers);
      }
    } catch (error) {
      console.error('Failed to load suppliers:', error);
    }
  };
  
  /**
   * Load orders
   */
  const loadOrders = async () => {
    try {
      const response = await fetch('/api/dropshipping/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };
  
  /**
   * Import product to store
   */
  const importProduct = async (product: DropShippingProduct) => {
    try {
      const response = await fetch('/api/dropshipping/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId: product.id,
          retailPrice: product.yourPrice
        })
      });
      
      if (response.ok) {
        alert('Product imported successfully!');
        loadProducts();
      }
    } catch (error) {
      console.error('Failed to import product:', error);
      alert('Failed to import product');
    }
  };
  
  /**
   * Calculate profit
   */
  const calculateProfit = (costPrice: number, retailPrice: number, shippingCost: number = 0): number => {
    return retailPrice - costPrice - shippingCost;
  };
  
  /**
   * Calculate profit margin
   */
  const calculateProfitMargin = (profit: number, retailPrice: number): number => {
    return (profit / retailPrice) * 100;
  };
  
  /**
   * Update product price
   */
  const updateProductPrice = (productId: string, newPrice: number) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        const profit = calculateProfit(p.costPrice, newPrice, p.shippingCost);
        const profitMargin = calculateProfitMargin(profit, newPrice);
        return {
          ...p,
          yourPrice: newPrice,
          profit,
          profitMargin
        };
      }
      return p;
    }));
  };
  
  /**
   * Fulfill order automatically
   */
  const fulfillOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/dropshipping/orders/${orderId}/fulfill`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        alert('Order sent to supplier for fulfillment!');
        loadOrders();
      }
    } catch (error) {
      console.error('Failed to fulfill order:', error);
      alert('Failed to fulfill order');
    }
  };
  
  /**
   * Filter products
   */
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSupplier = selectedSupplier === 'all' || product.supplierId === selectedSupplier;
    const matchesPrice = product.costPrice >= priceRange[0] && product.costPrice <= priceRange[1];
    const matchesProfit = product.profitMargin >= minProfitMargin;
    
    return matchesSearch && matchesSupplier && matchesPrice && matchesProfit;
  });
  
  /**
   * Calculate analytics
   */
  const analytics = {
    totalProducts: products.filter(p => p.imported).length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.customerPrice * o.quantity), 0),
    totalProfit: orders.reduce((sum, o) => sum + o.profit, 0),
    averageProfitMargin: orders.length > 0
      ? orders.reduce((sum, o) => sum + ((o.profit / o.customerPrice) * 100), 0) / orders.length
      : 0
  };
  
  return (
    <div className="dropshipping">
      <div className="dropshipping-header">
        <h1>Drop Shipping</h1>
        <div className="dropshipping-stats">
          <div className="stat-card">
            <span className="stat-label">Products</span>
            <span className="stat-value">{analytics.totalProducts}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Orders</span>
            <span className="stat-value">{analytics.totalOrders}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Revenue</span>
            <span className="stat-value">${analytics.totalRevenue.toFixed(2)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Profit</span>
            <span className="stat-value profit">${analytics.totalProfit.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="dropshipping-tabs">
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={activeTab === 'suppliers' ? 'active' : ''}
          onClick={() => setActiveTab('suppliers')}
        >
          Suppliers
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders ({analytics.pendingOrders} pending)
        </button>
        <button
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>
      
      <div className="dropshipping-content">
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="products-tab">
            {/* Filters */}
            <div className="filters-panel">
              <div className="filter-group">
                <label>Search Products</label>
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="filter-group">
                <label>Supplier</label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                >
                  <option value="all">All Suppliers</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Min Profit Margin: {minProfitMargin}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minProfitMargin}
                  onChange={(e) => setMinProfitMargin(Number(e.target.value))}
                />
              </div>
              
              <div className="filter-group">
                <label>Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                />
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="products-grid">
              {loading ? (
                <div className="loading-state">Loading products...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <p>No products found matching your filters.</p>
                  <button onClick={loadProducts} className="btn btn-primary">
                    Refresh Products
                  </button>
                </div>
              ) : (
                filteredProducts.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <img src={product.images[0]} alt={product.title} />
                      {product.imported && (
                        <span className="badge badge-success">Imported</span>
                      )}
                    </div>
                    
                    <div className="product-info">
                      <h3>{product.title}</h3>
                      <p className="product-description">{product.description.substring(0, 100)}...</p>
                      
                      <div className="product-supplier">
                        <span>📦 {product.supplierName}</span>
                        <span>⭐ {product.rating}/5</span>
                      </div>
                      
                      <div className="product-pricing">
                        <div className="price-row">
                          <span className="price-label">Cost:</span>
                          <span className="price-value">${product.costPrice.toFixed(2)}</span>
                        </div>
                        <div className="price-row">
                          <span className="price-label">Suggested:</span>
                          <span className="price-value">${product.suggestedRetailPrice.toFixed(2)}</span>
                        </div>
                        <div className="price-row">
                          <span className="price-label">Your Price:</span>
                          <input
                            type="number"
                            step="0.01"
                            value={product.yourPrice}
                            onChange={(e) => updateProductPrice(product.id, Number(e.target.value))}
                            className="price-input"
                          />
                        </div>
                        <div className="price-row profit-row">
                          <span className="price-label">Profit:</span>
                          <span className="price-value profit">
                            ${product.profit.toFixed(2)} ({product.profitMargin.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      
                      <div className="product-meta">
                        <span>📦 Stock: {product.stock}</span>
                        <span>🚚 {product.shippingTime}</span>
                      </div>
                      
                      <div className="product-actions">
                        {product.imported ? (
                          <button className="btn btn-secondary" disabled>
                            ✓ Imported
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => importProduct(product)}
                          >
                            Import to Store
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {/* Suppliers Tab */}
        {activeTab === 'suppliers' && (
          <div className="suppliers-tab">
            <div className="suppliers-grid">
              {suppliers.map(supplier => (
                <div key={supplier.id} className="supplier-card">
                  <div className="supplier-header">
                    <h3>{supplier.name}</h3>
                    {supplier.verified && <span className="badge badge-verified">✓ Verified</span>}
                  </div>
                  
                  <div className="supplier-info">
                    <div className="info-row">
                      <span>🌍 Country:</span>
                      <span>{supplier.country}</span>
                    </div>
                    <div className="info-row">
                      <span>⭐ Rating:</span>
                      <span>{supplier.rating}/5</span>
                    </div>
                    <div className="info-row">
                      <span>📦 Products:</span>
                      <span>{supplier.totalProducts.toLocaleString()}</span>
                    </div>
                    <div className="info-row">
                      <span>🚚 Shipping:</span>
                      <span>{supplier.averageShippingTime}</span>
                    </div>
                    <div className="info-row">
                      <span>💬 Response:</span>
                      <span>{supplier.responseTime}</span>
                    </div>
                    <div className="info-row">
                      <span>📋 Min Order:</span>
                      <span>${supplier.minOrder}</span>
                    </div>
                  </div>
                  
                  <div className="supplier-actions">
                    <button className="btn btn-primary">
                      View Products
                    </button>
                    <button className="btn btn-outline">
                      Contact Supplier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="orders-tab">
            <div className="orders-list">
              {orders.length === 0 ? (
                <div className="empty-state">
                  <p>No orders yet.</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <h3>Order #{order.orderId}</h3>
                      <span className={`order-status status-${order.status}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="order-info">
                      <div className="info-row">
                        <span>Product:</span>
                        <span>{order.productTitle}</span>
                      </div>
                      <div className="info-row">
                        <span>Quantity:</span>
                        <span>{order.quantity}</span>
                      </div>
                      <div className="info-row">
                        <span>Customer Price:</span>
                        <span>${order.customerPrice.toFixed(2)}</span>
                      </div>
                      <div className="info-row">
                        <span>Cost:</span>
                        <span>${order.costPrice.toFixed(2)}</span>
                      </div>
                      <div className="info-row profit-row">
                        <span>Profit:</span>
                        <span className="profit">${order.profit.toFixed(2)}</span>
                      </div>
                      <div className="info-row">
                        <span>Supplier:</span>
                        <span>{order.supplierName}</span>
                      </div>
                      {order.trackingNumber && (
                        <div className="info-row">
                          <span>Tracking:</span>
                          <span>{order.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="order-actions">
                      {order.status === 'pending' && (
                        <button
                          className="btn btn-primary"
                          onClick={() => fulfillOrder(order.id)}
                        >
                          Send to Supplier
                        </button>
                      )}
                      <button className="btn btn-outline">
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Total Revenue</h3>
                <p className="analytics-value">${analytics.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="analytics-card">
                <h3>Total Profit</h3>
                <p className="analytics-value profit">${analytics.totalProfit.toFixed(2)}</p>
              </div>
              <div className="analytics-card">
                <h3>Avg Profit Margin</h3>
                <p className="analytics-value">{analytics.averageProfitMargin.toFixed(1)}%</p>
              </div>
              <div className="analytics-card">
                <h3>Total Orders</h3>
                <p className="analytics-value">{analytics.totalOrders}</p>
              </div>
            </div>
            
            <div className="analytics-chart">
              <h3>Performance Over Time</h3>
              <p className="coming-soon">Chart visualization coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DropShipping;

