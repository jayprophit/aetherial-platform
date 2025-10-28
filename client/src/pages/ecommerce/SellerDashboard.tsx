/**
 * AETHERIAL Platform - E-Commerce Seller Dashboard
 * Complete seller/merchant dashboard for managing store, products, orders, inventory
 */

import React, { useState, useEffect } from 'react';
import { unifiedSystemHub } from '../../lib/integration/unified-system-hub';
import './SellerDashboard.css';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  status: 'active' | 'draft' | 'out-of-stock';
  image: string;
}

interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  averageOrderValue: number;
  conversionRate: number;
  topSellingProduct: string;
}

export const SellerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inventory' | 'analytics'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    unifiedSystemHub.publishEvent({
      id: `seller-dashboard-init-${Date.now()}`,
      timestamp: new Date(),
      source: 'seller-dashboard',
      type: 'ecommerce.seller.initialized',
      data: {},
      priority: 'high',
      propagate: true,
    });

    // Simulate loading data
    setTimeout(() => {
      setProducts([
        {
          id: 'prod_1',
          name: 'Quantum Computing Course',
          category: 'Digital Products',
          price: 199.99,
          stock: 999,
          sales: 1234,
          status: 'active',
          image: '📚'
        },
        {
          id: 'prod_2',
          name: 'AI Development Kit',
          category: 'Software',
          price: 299.99,
          stock: 45,
          sales: 567,
          status: 'active',
          image: '🤖'
        },
        {
          id: 'prod_3',
          name: 'Blockchain Starter Pack',
          category: 'Digital Products',
          price: 149.99,
          stock: 0,
          sales: 892,
          status: 'out-of-stock',
          image: '⛓️'
        },
        {
          id: 'prod_4',
          name: 'IoT Sensor Bundle',
          category: 'Hardware',
          price: 89.99,
          stock: 120,
          sales: 345,
          status: 'active',
          image: '📡'
        }
      ]);

      setOrders([
        {
          id: 'ord_001',
          customer: 'John Doe',
          items: 3,
          total: 449.97,
          status: 'processing',
          date: '2025-10-28'
        },
        {
          id: 'ord_002',
          customer: 'Jane Smith',
          items: 1,
          total: 199.99,
          status: 'shipped',
          date: '2025-10-27'
        },
        {
          id: 'ord_003',
          customer: 'Bob Johnson',
          items: 2,
          total: 489.98,
          status: 'delivered',
          date: '2025-10-26'
        }
      ]);

      setAnalytics({
        totalRevenue: 246789.50,
        totalOrders: 1523,
        totalProducts: 4,
        averageOrderValue: 162.05,
        conversionRate: 3.8,
        topSellingProduct: 'Quantum Computing Course'
      });

      setLoading(false);
    }, 1000);
  }, []);

  const handleAddProduct = () => {
    alert('Add Product feature - Opens product creation form');
  };

  const handleEditProduct = (productId: string) => {
    alert(`Edit product: ${productId}`);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus as any } : order
    ));
    unifiedSystemHub.publishEvent({
      id: `order-status-updated-${Date.now()}`,
      timestamp: new Date(),
      source: 'seller-dashboard',
      type: 'ecommerce.order.status.updated',
      data: { orderId, newStatus },
      priority: 'high',
      propagate: true,
    });
  };

  if (loading) {
    return (
      <div className="seller-dashboard">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading seller dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-dashboard">
      <header className="seller-header">
        <h1>🏪 Seller Dashboard</h1>
        <p>Manage your store, products, orders, and inventory</p>
      </header>

      <div className="seller-tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>Products</button>
        <button className={`tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Orders</button>
        <button className={`tab ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>Inventory</button>
        <button className={`tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
      </div>

      <div className="seller-content">
        {activeTab === 'overview' && analytics && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-value">${analytics.totalRevenue.toLocaleString()}</div>
                <div className="stat-label">Total Revenue</div>
                <div className="stat-change positive">+12.5% from last month</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-value">{analytics.totalOrders.toLocaleString()}</div>
                <div className="stat-label">Total Orders</div>
                <div className="stat-change positive">+8.3% from last month</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🛍️</div>
                <div className="stat-value">{analytics.totalProducts}</div>
                <div className="stat-label">Active Products</div>
                <div className="stat-change neutral">No change</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💵</div>
                <div className="stat-value">${analytics.averageOrderValue.toFixed(2)}</div>
                <div className="stat-label">Avg Order Value</div>
                <div className="stat-change positive">+5.2% from last month</div>
              </div>
            </div>

            <div className="recent-orders-section">
              <h2>Recent Orders</h2>
              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{order.items}</td>
                        <td>${order.total.toFixed(2)}</td>
                        <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                        <td>{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="top-products-section">
              <h2>Top Selling Products</h2>
              <div className="products-list">
                {products.sort((a, b) => b.sales - a.sales).slice(0, 3).map(product => (
                  <div key={product.id} className="product-item">
                    <div className="product-icon">{product.image}</div>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p>{product.sales} sales • ${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-section">
            <div className="section-header">
              <h2>Products</h2>
              <button className="btn btn-primary" onClick={handleAddProduct}>+ Add Product</button>
            </div>
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">{product.image}</div>
                  <div className="product-details">
                    <h3>{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <div className="product-price">${product.price}</div>
                    <div className="product-stats">
                      <span>Stock: {product.stock}</span>
                      <span>Sales: {product.sales}</span>
                    </div>
                    <span className={`status-badge ${product.status}`}>{product.status}</span>
                  </div>
                  <div className="product-actions">
                    <button className="btn btn-small" onClick={() => handleEditProduct(product.id)}>Edit</button>
                    <button className="btn btn-small btn-secondary">View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>All Orders</h2>
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.items}</td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className={`status-select ${order.status}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>{order.date}</td>
                      <td>
                        <button className="btn btn-small">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="inventory-section">
            <h2>Inventory Management</h2>
            <div className="inventory-alerts">
              <div className="alert alert-warning">
                <strong>⚠️ Low Stock Alert:</strong> 1 product needs restocking
              </div>
              <div className="alert alert-danger">
                <strong>🚫 Out of Stock:</strong> 1 product is out of stock
              </div>
            </div>
            <div className="inventory-table">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-cell">
                          <span className="product-icon">{product.image}</span>
                          {product.name}
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>
                        <span className={`stock-level ${product.stock === 0 ? 'out' : product.stock < 50 ? 'low' : 'good'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td><span className={`status-badge ${product.status}`}>{product.status}</span></td>
                      <td>
                        <button className="btn btn-small">Restock</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <div className="analytics-section">
            <h2>Sales Analytics</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Conversion Rate</h3>
                <div className="analytics-value">{analytics.conversionRate}%</div>
                <p>Visitors who made a purchase</p>
              </div>
              <div className="analytics-card">
                <h3>Top Product</h3>
                <div className="analytics-value">{analytics.topSellingProduct}</div>
                <p>Best performing product</p>
              </div>
              <div className="analytics-card">
                <h3>Revenue Growth</h3>
                <div className="analytics-value">+12.5%</div>
                <p>Compared to last month</p>
              </div>
              <div className="analytics-card">
                <h3>Customer Satisfaction</h3>
                <div className="analytics-value">4.8/5.0</div>
                <p>Average rating from customers</p>
              </div>
            </div>
            <div className="chart-placeholder">
              <h3>Sales Chart</h3>
              <p>📊 Revenue trends over time (chart visualization would go here)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;

