import React, { useState } from 'react';
import './OrderHistory.css';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const OrderHistory: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mock orders data
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2025-001234',
      date: '2025-10-25',
      status: 'delivered',
      items: [
        {
          id: 'item-1',
          name: 'Professional 4K Camera Drone',
          image: 'https://picsum.photos/100/100?random=1',
          quantity: 1,
          price: 1299.99
        },
        {
          id: 'item-2',
          name: 'Extra Battery Pack',
          image: 'https://picsum.photos/100/100?random=2',
          quantity: 2,
          price: 89.99
        }
      ],
      subtotal: 1479.97,
      shipping: 0,
      tax: 118.40,
      total: 1598.37,
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street, Apt 4B',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102'
      },
      trackingNumber: '1Z999AA10123456784',
      estimatedDelivery: 'Delivered on Oct 23, 2025'
    },
    {
      id: '2',
      orderNumber: 'ORD-2025-001235',
      date: '2025-10-26',
      status: 'shipped',
      items: [
        {
          id: 'item-3',
          name: 'Wireless Noise-Cancelling Headphones',
          image: 'https://picsum.photos/100/100?random=3',
          quantity: 1,
          price: 349.99
        }
      ],
      subtotal: 349.99,
      shipping: 15.99,
      tax: 28.00,
      total: 393.98,
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street, Apt 4B',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102'
      },
      trackingNumber: '1Z999AA10123456785',
      estimatedDelivery: 'Expected Oct 30, 2025'
    },
    {
      id: '3',
      orderNumber: 'ORD-2025-001236',
      date: '2025-10-27',
      status: 'processing',
      items: [
        {
          id: 'item-4',
          name: 'Smart Fitness Watch',
          image: 'https://picsum.photos/100/100?random=4',
          quantity: 1,
          price: 249.99
        },
        {
          id: 'item-5',
          name: 'Replacement Bands (3-pack)',
          image: 'https://picsum.photos/100/100?random=5',
          quantity: 1,
          price: 29.99
        }
      ],
      subtotal: 279.98,
      shipping: 15.99,
      tax: 22.40,
      total: 318.37,
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street, Apt 4B',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102'
      },
      estimatedDelivery: 'Expected Nov 2, 2025'
    },
    {
      id: '4',
      orderNumber: 'ORD-2025-001237',
      date: '2025-10-20',
      status: 'cancelled',
      items: [
        {
          id: 'item-6',
          name: 'Mechanical Gaming Keyboard',
          image: 'https://picsum.photos/100/100?random=6',
          quantity: 1,
          price: 159.99
        }
      ],
      subtotal: 159.99,
      shipping: 15.99,
      tax: 12.80,
      total: 188.78,
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street, Apt 4B',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102'
      }
    }
  ];

  const filteredOrders = orders.filter(order => 
    filter === 'all' ? true : order.status === filter
  );

  const stats = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'processing': return '#17a2b8';
      case 'shipped': return '#007bff';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '⚙️';
      case 'shipped': return '🚚';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📦';
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  const handleReorder = (order: Order) => {
    alert(`Reordering items from order ${order.orderNumber}`);
  };

  const handleTrackOrder = (order: Order) => {
    if (order.trackingNumber) {
      alert(`Tracking: ${order.trackingNumber}`);
    }
  };

  const handleDownloadInvoice = (order: Order) => {
    alert(`Downloading invoice for ${order.orderNumber}`);
  };

  return (
    <div className="order-history">
      <div className="orders-container">
        <h1>Order History</h1>

        {/* Filters */}
        <div className="order-filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Orders ({stats.all})
          </button>
          <button
            className={filter === 'processing' ? 'active' : ''}
            onClick={() => setFilter('processing')}
          >
            Processing ({stats.processing})
          </button>
          <button
            className={filter === 'shipped' ? 'active' : ''}
            onClick={() => setFilter('shipped')}
          >
            Shipped ({stats.shipped})
          </button>
          <button
            className={filter === 'delivered' ? 'active' : ''}
            onClick={() => setFilter('delivered')}
          >
            Delivered ({stats.delivered})
          </button>
          <button
            className={filter === 'cancelled' ? 'active' : ''}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled ({stats.cancelled})
          </button>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h2>No orders found</h2>
            <p>Start shopping to see your orders here</p>
            <a href="/marketplace" className="shop-btn">Browse Products</a>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>{order.orderNumber}</h3>
                    <span className="order-date">Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="order-status" style={{ background: getStatusColor(order.status) }}>
                    <span>{getStatusIcon(order.status)}</span>
                    <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map(item => (
                    <div key={item.id} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                      <div className="item-price">${item.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Total:</span>
                    <span className="total-amount">${order.total.toFixed(2)}</span>
                  </div>
                  {order.trackingNumber && (
                    <div className="tracking-info">
                      📍 {order.estimatedDelivery}
                    </div>
                  )}
                </div>

                <div className="order-actions">
                  <button className="view-details-btn" onClick={() => handleViewDetails(order)}>
                    View Details
                  </button>
                  {order.status === 'delivered' && (
                    <button className="reorder-btn" onClick={() => handleReorder(order)}>
                      🔄 Reorder
                    </button>
                  )}
                  {order.trackingNumber && (
                    <button className="track-btn" onClick={() => handleTrackOrder(order)}>
                      🚚 Track
                    </button>
                  )}
                  <button className="invoice-btn" onClick={() => handleDownloadInvoice(order)}>
                    📄 Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-btn" onClick={handleCloseDetails}>✕</button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Order Information</h3>
                <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
                <p><strong>Order Date:</strong> {new Date(selectedOrder.date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span style={{ color: getStatusColor(selectedOrder.status) }}>{selectedOrder.status.toUpperCase()}</span></p>
                {selectedOrder.trackingNumber && (
                  <p><strong>Tracking:</strong> {selectedOrder.trackingNumber}</p>
                )}
              </div>

              <div className="detail-section">
                <h3>Shipping Address</h3>
                <p>{selectedOrder.shippingAddress.name}</p>
                <p>{selectedOrder.shippingAddress.address}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}</p>
              </div>

              <div className="detail-section">
                <h3>Items</h3>
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="detail-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p><strong>{item.name}</strong></p>
                      <p>Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                    <p className="item-total">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="detail-section">
                <h3>Order Summary</h3>
                <div className="summary-line">
                  <span>Subtotal:</span>
                  <span>${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-line">
                  <span>Shipping:</span>
                  <span>{selectedOrder.shipping === 0 ? 'FREE' : `$${selectedOrder.shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-line">
                  <span>Tax:</span>
                  <span>${selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="summary-line total">
                  <span>Total:</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

