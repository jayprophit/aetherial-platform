import React from 'react';
import './MainContent.css';

interface MainContentProps {
  module: string;
  children?: React.ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({ module, children }) => {
  const renderModuleContent = () => {
    if (children) {
      return children;
    }

    // Default content based on module
    switch (module) {
      case 'dashboard':
        return <DashboardContent />;
      case 'social-media':
        return <SocialMediaContent />;
      case 'elearning':
        return <ELearningContent />;
      case 'ecommerce':
        return <ECommerceContent />;
      case 'trading':
        return <TradingContent />;
      case 'blockchain':
        return <BlockchainContent />;
      default:
        return <DefaultContent module={module} />;
    }
  };

  return (
    <div className="main-content">
      <div className="content-wrapper">
        {renderModuleContent()}
      </div>
    </div>
  );
};

const DashboardContent: React.FC = () => (
  <div className="dashboard-content">
    <h1>Welcome to AETHERIAL</h1>
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <h3>💰 Your Balance</h3>
        <p className="balance">1,234.56 AETH</p>
        <p className="balance-usd">≈ $12,345.60 USD</p>
      </div>
      <div className="dashboard-card">
        <h3>📈 Portfolio Value</h3>
        <p className="balance">$45,678.90</p>
        <p className="change positive">+12.5% (24h)</p>
      </div>
      <div className="dashboard-card">
        <h3>🎓 Courses Enrolled</h3>
        <p className="stat">12 Active</p>
        <p className="sub-stat">3 Completed this month</p>
      </div>
      <div className="dashboard-card">
        <h3>🛒 Recent Orders</h3>
        <p className="stat">5 Pending</p>
        <p className="sub-stat">2 Delivered today</p>
      </div>
    </div>
    
    <div className="recent-activity">
      <h2>Recent Activity</h2>
      <div className="activity-list">
        <div className="activity-item">
          <span className="activity-icon">💰</span>
          <div className="activity-details">
            <p className="activity-title">Received 50 AETH</p>
            <p className="activity-time">2 hours ago</p>
          </div>
        </div>
        <div className="activity-item">
          <span className="activity-icon">📚</span>
          <div className="activity-details">
            <p className="activity-title">Completed "Advanced Trading Strategies"</p>
            <p className="activity-time">5 hours ago</p>
          </div>
        </div>
        <div className="activity-item">
          <span className="activity-icon">🛒</span>
          <div className="activity-details">
            <p className="activity-title">Order #12345 shipped</p>
            <p className="activity-time">1 day ago</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SocialMediaContent: React.FC = () => (
  <div className="social-media-content">
    <h1>Social Feed</h1>
    <div className="create-post">
      <textarea placeholder="What's on your mind?" />
      <div className="post-actions">
        <button>📷 Photo</button>
        <button>🎬 Video</button>
        <button>📊 Poll</button>
        <button className="post-btn">Post</button>
      </div>
    </div>
    <div className="feed">
      <div className="post">
        <div className="post-header">
          <img src="/api/placeholder/40/40" alt="User" />
          <div>
            <h4>John Doe</h4>
            <span>2 hours ago</span>
          </div>
        </div>
        <p>Just completed my first blockchain course! 🎉</p>
        <div className="post-actions">
          <button>👍 Like (24)</button>
          <button>💬 Comment (5)</button>
          <button>🔗 Share</button>
        </div>
      </div>
    </div>
  </div>
);

const ELearningContent: React.FC = () => (
  <div className="elearning-content">
    <h1>E-Learning Platform</h1>
    <div className="course-grid">
      <div className="course-card">
        <img src="/api/placeholder/300/200" alt="Course" />
        <h3>Blockchain Development</h3>
        <p>Learn to build decentralized applications</p>
        <div className="course-meta">
          <span>⭐ 4.8</span>
          <span>👥 1,234 students</span>
        </div>
        <button className="enroll-btn">Enroll Now</button>
      </div>
    </div>
  </div>
);

const ECommerceContent: React.FC = () => (
  <div className="ecommerce-content">
    <h1>E-Commerce Marketplace</h1>
    <div className="product-grid">
      <div className="product-card">
        <img src="/api/placeholder/250/250" alt="Product" />
        <h3>Smart Device</h3>
        <p className="price">$299.99</p>
        <button className="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  </div>
);

const TradingContent: React.FC = () => (
  <div className="trading-content">
    <h1>Trading Platform</h1>
    <div className="trading-dashboard">
      <div className="chart-section">
        <h2>BTC/USD</h2>
        <p className="price">$45,678.90</p>
        <p className="change positive">+2.5%</p>
      </div>
      <div className="order-book">
        <h3>Order Book</h3>
        {/* Order book content */}
      </div>
    </div>
  </div>
);

const BlockchainContent: React.FC = () => (
  <div className="blockchain-content">
    <h1>Blockchain Explorer</h1>
    <div className="blockchain-stats">
      <div className="stat-card">
        <h3>Latest Block</h3>
        <p>#123,456</p>
      </div>
      <div className="stat-card">
        <h3>Network Hash Rate</h3>
        <p>1.2 PH/s</p>
      </div>
    </div>
  </div>
);

const DefaultContent: React.FC<{ module: string }> = ({ module }) => (
  <div className="default-content">
    <h1>{module.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h1>
    <p>Content for {module} module will be displayed here.</p>
  </div>
);

