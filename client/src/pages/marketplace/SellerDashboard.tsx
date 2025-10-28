import React, { useState } from 'react';
import './SellerDashboard.css';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  sales: number;
  revenue: number;
  status: 'active' | 'draft' | 'out-of-stock';
}

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

const SellerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'analytics'>('overview');

  // Mock data
  const stats = {
    totalSales: 45678,
    totalRevenue: 125430.50,
    activeProducts: 24,
    pendingOrders: 8,
    monthlyGrowth: 12.5,
    conversionRate: 3.2,
    avgOrderValue: 89.50,
    customerSatisfaction: 4.7
  };

  const products: Product[] = [
    {
      id: '1',
      name: 'Professional 4K Camera Drone',
      image: 'https://picsum.photos/100/100?random=1',
      price: 1299.99,
      stock: 15,
      sales: 234,
      revenue: 304197.66,
      status: 'active'
    },
    {
      id: '2',
      name: 'Wireless Noise-Cancelling Headphones',
      image: 'https://picsum.photos/100/100?random=2',
      price: 349.99,
      stock: 0,
      sales: 567,
      revenue: 198444.33,
      status: 'out-of-stock'
    },
    {
      id: '3',
      name: 'Smart Fitness Watch',
      image: 'https://picsum.photos/100/100?random=3',
      price: 249.99,
      stock: 42,
      sales: 891,
      revenue: 222741.09,
      status: 'active'
    },
    {
      id: '4',
      name: 'Mechanical Gaming Keyboard',
      image: 'https://picsum.photos/100/100?random=4',
      price: 159.99,
      stock: 28,
      sales: 445,
      revenue: 71195.55,
      status: 'active'
    }
  ];

  const recentOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2025-001234',
      customer: 'John Doe',
      product: 'Professional 4K Camera Drone',
      amount: 1299.99,
      status: 'pending',
      date: '2025-10-28'
    },
    {
      id: '2',
      orderNumber: 'ORD-2025-001235',
      customer: 'Jane Smith',
      product: 'Smart Fitness Watch',
      amount: 249.99,
      status: 'processing',
      date: '2025-10-27'
    },
    {
      id: '3',
      orderNumber: 'ORD-2025-001236',
      customer: 'Bob Johnson',
      product: 'Mechanical Gaming Keyboard',
      amount: 159.99,
      status: 'shipped',
      date: '2025-10-26'
    },
    {
      id: '4',
      orderNumber: 'ORD-2025-001237',
      customer: 'Alice Williams',
      product: 'Smart Fitness Watch',
      amount: 249.99,
      status: 'delivered',
      date: '2025-10-25'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'draft': return '#ffc107';
      case 'out-of-stock': return '#dc3545';
      case 'pending': return '#ffc107';
      case 'processing': return '#17a2b8';
      case 'shipped': return '#007bff';
      case 'delivered': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className="seller-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>Seller Dashboard</h1>
            <p>Manage your products, orders, and analytics</p>
          </div>
          <button className="add-product-btn">
            ➕ Add New Product
          </button>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            📦 Products
          </button>
          <button
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            🛒 Orders
          </button>
          <button
            className={activeTab === 'analytics' ? 'active' : ''}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-content">
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <div className="stat-value">${stats.totalRevenue.toLocaleString()}</div>
                  <div className="stat-label">Total Revenue</div>
                  <div className="stat-change positive">+{stats.monthlyGrowth}% this month</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.totalSales.toLocaleString()}</div>
                  <div className="stat-label">Total Sales</div>
                  <div className="stat-change positive">+234 this week</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🏷️</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.activeProducts}</div>
                  <div className="stat-label">Active Products</div>
                  <div className="stat-change neutral">2 out of stock</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.pendingOrders}</div>
                  <div className="stat-label">Pending Orders</div>
                  <div className="stat-change negative">Needs attention</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💵</div>
                <div className="stat-info">
                  <div className="stat-value">${stats.avgOrderValue}</div>
                  <div className="stat-label">Avg Order Value</div>
                  <div className="stat-change positive">+$5.20</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.conversionRate}%</div>
                  <div className="stat-label">Conversion Rate</div>
                  <div className="stat-change positive">+0.3%</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.customerSatisfaction}</div>
                  <div className="stat-label">Customer Rating</div>
                  <div className="stat-change positive">+0.2 points</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <div className="stat-value">1,234</div>
                  <div className="stat-label">Total Customers</div>
                  <div className="stat-change positive">+89 new</div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="section-card">
              <h2>Recent Orders</h2>
              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id}>
                        <td>{order.orderNumber}</td>
                        <td>{order.customer}</td>
                        <td>{order.product}</td>
                        <td>${order.amount.toFixed(2)}</td>
                        <td>
                          <span className="status-badge" style={{ background: getStatusColor(order.status) }}>
                            {order.status}
                          </span>
                        </td>
                        <td>{new Date(order.date).toLocaleDateString()}</td>
                        <td>
                          <button className="action-btn">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="section-card">
              <h2>Top Performing Products</h2>
              <div className="products-grid">
                {products.slice(0, 3).map(product => (
                  <div key={product.id} className="product-card-mini">
                    <img src={product.image} alt={product.name} />
                    <div className="product-info-mini">
                      <h4>{product.name}</h4>
                      <p>{product.sales} sales</p>
                      <p className="revenue">${product.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="products-content">
            <div className="products-header">
              <input type="text" placeholder="Search products..." className="search-input" />
              <select className="filter-select">
                <option>All Status</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Out of Stock</option>
              </select>
            </div>

            <div className="products-list">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.name} />
                  <div className="product-details">
                    <h3>{product.name}</h3>
                    <div className="product-meta">
                      <span>Price: ${product.price}</span>
                      <span>Stock: {product.stock}</span>
                      <span>Sales: {product.sales}</span>
                    </div>
                    <div className="product-revenue">
                      Revenue: ${product.revenue.toLocaleString()}
                    </div>
                  </div>
                  <div className="product-status">
                    <span className="status-badge" style={{ background: getStatusColor(product.status) }}>
                      {product.status}
                    </span>
                  </div>
                  <div className="product-actions">
                    <button className="edit-btn">✏️ Edit</button>
                    <button className="view-btn">👁️ View</button>
                    <button className="delete-btn">🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="orders-content">
            <div className="orders-filters">
              <button className="filter-btn active">All ({recentOrders.length})</button>
              <button className="filter-btn">Pending (1)</button>
              <button className="filter-btn">Processing (1)</button>
              <button className="filter-btn">Shipped (1)</button>
              <button className="filter-btn">Delivered (1)</button>
            </div>

            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.orderNumber}</td>
                      <td>{order.customer}</td>
                      <td>{order.product}</td>
                      <td>${order.amount.toFixed(2)}</td>
                      <td>
                        <span className="status-badge" style={{ background: getStatusColor(order.status) }}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.date).toLocaleDateString()}</td>
                      <td>
                        <button className="action-btn">View</button>
                        <button className="action-btn">Update</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="analytics-content">
            <div className="analytics-grid">
              <div className="chart-card">
                <h3>Sales Trend</h3>
                <div className="chart-placeholder">
                  📈 Sales chart visualization
                </div>
              </div>

              <div className="chart-card">
                <h3>Revenue by Product</h3>
                <div className="chart-placeholder">
                  📊 Revenue breakdown chart
                </div>
              </div>

              <div className="chart-card">
                <h3>Customer Demographics</h3>
                <div className="chart-placeholder">
                  👥 Demographics chart
                </div>
              </div>

              <div className="chart-card">
                <h3>Traffic Sources</h3>
                <div className="chart-placeholder">
                  🌐 Traffic sources chart
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;

