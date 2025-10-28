import React, { useState } from 'react';
import './LeftSidebar.css';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  children?: MenuItem[];
}

// Complete menu structure from Figma design
const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'My Account (Dashboard)',
    icon: '🏠',
    children: [
      { id: 'messages', label: 'Messages', icon: '💬', children: [
        { id: 'social-media', label: 'Social media', icon: '👥' },
        { id: 'elearning-msg', label: 'E-Learning', icon: '📚' },
        { id: 'ecommerce-msg', label: 'E-commerce', icon: '🛒' },
        { id: 'jobs-msg', label: 'Jobs', icon: '💼' },
        { id: 'community-msg', label: 'Community', icon: '🌐' },
        { id: 'events-msg', label: 'Events', icon: '📅' },
        { id: 'rd-labs-msg', label: 'R&D Labs', icon: '🔬' },
        { id: 'estate-agent-msg', label: 'Estate Agent', icon: '🏘️' },
        { id: 'hotels-msg', label: 'Hotels & Resturants', icon: '🏨' },
      ]},
      { id: 'notifications', label: 'Notifications', icon: '🔔' },
      { id: 'feed', label: 'Feed (Home)', icon: '📰' },
    ]
  },
  {
    id: 'social-media',
    label: 'Social Media',
    icon: '👥',
    children: [
      { id: 'social-feed', label: 'Feed', icon: '📱' },
      { id: 'video-shorts', label: 'Video (shorts)', icon: '🎬' },
      { id: 'friends', label: 'Freinds', icon: '👫' },
      { id: 'browse-courses-social', label: 'Browse Courses', icon: '📖' },
      { id: 'my-courses-social', label: 'My Courses', icon: '📝' },
      { id: 'ai-learning-path', label: 'Ai assisted Learning Path', icon: '🤖' },
      { id: 'certificates', label: 'Certificates', icon: '🎓' },
      { id: 'cv-builder', label: 'CV Builder', icon: '📄' },
      { id: 'blockchain-cv', label: 'Blockchain CV', icon: '⛓️' },
      { id: 'course-materials', label: 'Course Materials', icon: '📚' },
      { id: 'instructor-tools', label: 'Instructor tools', icon: '👨‍🏫' },
    ]
  },
  {
    id: 'elearning',
    label: 'E-Learning (Pay to Learn)',
    icon: '📚',
    children: [
      { id: 'browse-courses', label: 'Browse Courses', icon: '🔍' },
      { id: 'my-courses', label: 'My Courses', icon: '📖' },
      { id: 'ai-learning', label: 'AI-assisted Learning Path', icon: '🤖' },
      { id: 'certificates-earn', label: 'Certificates', icon: '🏆' },
      { id: 'cv-builder-learn', label: 'CV Builder', icon: '📝' },
      { id: 'blockchain-cv-learn', label: 'Blockchain CV', icon: '⛓️' },
      { id: 'course-materials-learn', label: 'Course Materials', icon: '📚' },
      { id: 'instructor-tools-learn', label: 'Instructor tools', icon: '👨‍🏫' },
    ]
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    icon: '🛒',
    children: [
      { id: 'browse-products', label: 'Browse Products', icon: '🔍' },
      { id: 'categories', label: 'Categories', icon: '📂' },
      { id: 'my-cart', label: 'My Cart', icon: '🛒' },
      { id: 'orders', label: 'Orders', icon: '📦' },
      { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
      { id: 'seller-dashboard', label: 'Sellers Dashboard', icon: '💼' },
      { id: 'product-listing', label: 'Product Listing', icon: '📝' },
      { id: 'shipping-cart', label: 'Shipping Cart', icon: '🚚' },
      { id: 'blue-prints', label: 'Blue Prints', icon: '📐' },
      { id: 'patents', label: 'Patents', icon: '⚖️' },
    ]
  },
  {
    id: 'jobs',
    label: 'Job Search',
    icon: '💼',
    children: [
      { id: 'search-jobs', label: 'Search Jobs', icon: '🔍' },
      { id: 'geographic-search', label: 'Geographic Search', icon: '🗺️' },
      { id: 'my-application', label: 'My Application', icon: '📋' },
      { id: 'employer-signup', label: 'Employer Sign Up', icon: '🏢' },
      { id: 'freelance-barter', label: 'Freelance Barter', icon: '🤝' },
      { id: 'wage-calculator', label: 'Wage Claculator', icon: '💰' },
      { id: 'skill-verification', label: 'Skill Verification (AI CV Comfirmation)', icon: '✅' },
    ]
  },
  {
    id: 'events',
    label: 'Events',
    icon: '📅',
    children: [
      { id: 'clubs', label: 'Clubs', icon: '🎭' },
      { id: 'bars', label: 'Bars', icon: '🍺' },
      { id: 'restaurants', label: 'Resturants', icon: '🍽️' },
      { id: 'stadiums', label: 'Stadiums', icon: '🏟️' },
      { id: 'concerts', label: 'Concerts', icon: '🎵' },
    ]
  },
  {
    id: 'estate-agents', label: 'Estate agents (Housing)', icon: '🏘️'
  },
  {
    id: 'hotels', label: 'Hotels & Resturants', icon: '🏨'
  },
  {
    id: 'trading',
    label: 'Trading',
    icon: '📈',
    children: [
      { id: 'fiat-trading', label: 'Fiat Trading (Forex)', icon: '💱' },
      { id: 'crypto-trading', label: 'Cryptocurrency Trading', icon: '₿' },
      { id: 'ai-trading', label: 'Ai trading', icon: '🤖' },
      { id: 'portfolio-management', label: 'Portfolio Mangement', icon: '📊' },
      { id: 'market-analysis', label: 'Market Analysis', icon: '📉' },
      { id: 'flash-loan-trading', label: 'Flash Loan Trading', icon: '⚡' },
      { id: 'traditional-markets', label: 'Traditional Markets', icon: '📰' },
      { id: 'bonds-shares', label: 'Bonds, Shares, Comodaties', icon: '💼' },
      { id: 'penny-trading', label: 'Penny Trading', icon: '🪙' },
    ]
  },
  {
    id: 'supply-chain',
    label: 'Supply Chain',
    icon: '🚚',
    children: [
      { id: 'quality', label: 'Quality', icon: '⭐' },
      { id: 'quantity', label: 'Quantity', icon: '📦' },
      { id: 'supplier', label: 'Supplier', icon: '🏭' },
    ]
  },
  {
    id: 'gaming',
    label: 'Gaming - (Pay to Play)',
    icon: '🎮',
    children: [
      { id: 'crypto-games', label: 'Crypto Games', icon: '🎲' },
    ]
  },
  {
    id: 'rewards',
    label: 'Rewards/ Tokens/ Air Drops & Bounaces',
    icon: '🎁'
  },
  {
    id: 'ai-tools',
    label: 'AI Tools',
    icon: '🤖',
    children: [
      { id: 'design-creative', label: 'Design & Creative', icon: '🎨', children: [
        { id: 'ai-color-analysis', label: 'AI Color Analysis', icon: '🎨' },
        { id: 'sketch-converter', label: 'Sketch Photo Converter', icon: '✏️' },
      ]},
      { id: 'business-tools', label: 'Business Tools', icon: '💼' },
      { id: 'development-tools', label: 'Development  Tools', icon: '💻' },
      { id: 'communication-tools', label: 'Communication Tools', icon: '💬' },
      { id: 'research-analysis', label: 'Research & Analysis', icon: '🔬' },
      { id: 'production-tools-1', label: 'Production Tools', icon: '🎬' },
      { id: 'production-tools-2', label: 'Production Tools', icon: '🎥' },
      { id: 'unified-quantum-ai', label: 'Unified Quantum AI', icon: '⚛️' },
      { id: 'chat-bot', label: 'Chat Bot', icon: '💬' },
      { id: 'content-creation', label: 'Content Creation', icon: '📝' },
      { id: 'book-writing', label: 'Book Writing', icon: '📚' },
      { id: 'course-creation', label: 'Course creation', icon: '🎓' },
      { id: 'ai-video-design', label: 'AI Video Design', icon: '🎬' },
      { id: 'ai-interior-designer', label: 'AI Interior Designer', icon: '🏠' },
      { id: 'theme-builder', label: 'Theme Builder', icon: '🎨' },
      { id: 'make-meme', label: 'Make a Meme', icon: '😂' },
      { id: 'logo-generator', label: 'Logo Generator', icon: '🎯' },
      { id: 'banner-creator', label: 'Banner Creator', icon: '🖼️' },
      { id: 'market-research', label: 'Market Research Tool', icon: '📊' },
      { id: 'swat-analysis', label: 'Swat Analysis', icon: '📈' },
      { id: 'business-canvas', label: 'Business Canvas Maker', icon: '📋' },
      { id: 'ai-website-builder', label: 'AI Website Builder', icon: '🌐' },
      { id: 'github-deployment', label: 'Github Repository Deployment', icon: '📦' },
      { id: 'web-development', label: 'Web Development', icon: '💻' },
      { id: 'api-builder', label: 'API Bullilder', icon: '🔌' },
      { id: 'game-design', label: 'Game Design', icon: '🎮' },
      { id: 'cad-design', label: 'CAD Design', icon: '📐' },
      { id: 'app-builder', label: 'APP Builder', icon: '📱' },
      { id: 'wide-research', label: 'Wide Research', icon: '🔍' },
      { id: 'deep-research', label: 'Deep Research', icon: '🔬' },
      { id: 'ai-fact-checker', label: 'AI Fact Checker', icon: '✅' },
      { id: 'nanobrain-ai', label: 'Nanobrain AI', icon: '🧠' },
      { id: 'quantum-ai-assistant', label: 'Quantum AI assistant', icon: '⚛️' },
      { id: 'ai-trading-tool', label: 'AI Trading', icon: '📈' },
      { id: 'mcp', label: 'MCP', icon: '🔧' },
    ]
  },
  {
    id: 'quantum-computing',
    label: 'Quantum Computing',
    icon: '⚛️',
    children: [
      { id: 'simulator', label: 'Simulator', icon: '🖥️' },
    ]
  },
  {
    id: 'iot-manufacturing',
    label: 'IoT Manufacturing',
    icon: '🏭'
  },
  {
    id: 'robotics',
    label: 'Robotics',
    icon: '🤖'
  },
  {
    id: 'health-care',
    label: 'Health Care',
    icon: '⚕️'
  },
  {
    id: 'claude-services',
    label: 'Claude Services',
    icon: '🤖'
  },
  {
    id: 'business-tools-main',
    label: 'Business Tools',
    icon: '💼'
  },
  {
    id: 'monetization',
    label: 'Monetization',
    icon: '💰'
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: '💬',
    children: [
      { id: 'chat-app', label: 'Chat app (Voip)', icon: '📱', children: [
        { id: 'text', label: 'Text', icon: '💬' },
        { id: 'call', label: 'Call', icon: '📞' },
        { id: 'video-call', label: 'Video call', icon: '📹' },
        { id: 'voice-notes', label: 'Voice notes', icon: '🎤' },
        { id: 'files', label: 'Files', icon: '📎' },
        { id: 'status', label: 'Status', icon: '📊' },
      ]},
    ]
  },
  {
    id: 'blockchain',
    label: 'Blockchain & Web 3',
    icon: '⛓️',
    children: [
      { id: '3d-blockchain', label: '3D Blockchain', icon: '🔷' },
      { id: 'multi-chain-wallet', label: 'Multi-Chain Wallet', icon: '👛' },
      { id: 'defi-protocols', label: 'Defi Protocols', icon: '💎' },
      { id: 'flash-loans', label: 'Flash Loans', icon: '⚡' },
      { id: 'lending-borrowing', label: 'Lending & Borrowing (P2P)', icon: '🤝' },
      { id: 'yield-farming', label: 'Yeild Farming', icon: '🌾' },
      { id: 'arbitrage', label: 'Arbitrage', icon: '💱' },
      { id: 'dao-governance', label: 'DAO Governance', icon: '🗳️' },
      { id: 'blockchain-cv-main', label: 'Blockchain CV', icon: '📄' },
      { id: 'cryptocurrencies', label: 'Cryptocurrencies', icon: '₿' },
      { id: 'nft-marketplace', label: 'NFT Marketplace', icon: '🖼️' },
      { id: 'smart-contracts', label: 'Smart Contracts', icon: '📜' },
      { id: 'staking-pools', label: 'Staking Pools', icon: '💰' },
      { id: 'cross-chain-bridge', label: 'Cross-Chain Bridge', icon: '🌉' },
      { id: 'vault-system', label: 'Vault System', icon: '🔐' },
      { id: 'pow-consensus', label: 'Pow Consensus', icon: '⛏️' },
      { id: 'forking-timer', label: 'Forking (timer)', icon: '⏱️' },
    ]
  },
  {
    id: 'rd-lab',
    label: 'R&D (Reasearch and Development) Lab',
    icon: '🔬',
    children: [
      { id: 'crisphr-gene', label: 'Crisphr Gene Lab', icon: '🧬' },
      { id: 'rife-frequency', label: 'Rife Freaquency Healing', icon: '🎵' },
      { id: 'element-laboratory', label: 'Element Laboratory', icon: '⚗️' },
      { id: 'cymatic-technology', label: 'Cymatic Technology', icon: '🌊' },
      { id: 'research-funding', label: 'Research Funding Pools', icon: '💰' },
    ]
  },
  {
    id: 'creation-tools',
    label: 'Creation Tools (IDE)',
    icon: '🛠️',
    children: [
      { id: 'website-builder', label: 'Website builder', icon: '🌐' },
      { id: 'mcp-ide', label: 'MCP', icon: '🔧' },
    ]
  },
  {
    id: 'transaction-history',
    label: 'Transaction History',
    icon: '📜',
    children: [
      { id: 'ecommerce-buys', label: 'E-commerce', icon: '🛒', children: [
        { id: 'ecom-sells', label: "Sell's", icon: '💵' },
        { id: 'ecom-buys', label: "Buy's", icon: '🛍️' },
      ]},
      { id: 'elearning-trans', label: 'E-Learning', icon: '📚', children: [
        { id: 'elearn-sells', label: "Sell's", icon: '💵' },
        { id: 'elearn-buys', label: "Buy's", icon: '🛍️' },
      ]},
      { id: 'trading-trans', label: 'Trading', icon: '📈', children: [
        { id: 'trade-sells', label: "Sell's", icon: '💵' },
        { id: 'trade-buys', label: "Buy's", icon: '🛍️' },
      ]},
      { id: 'blockchain-train', label: 'Blockchain Traing', icon: '⛓️', children: [
        { id: 'bc-send', label: 'Send', icon: '📤' },
        { id: 'bc-recieve', label: 'Recieve', icon: '📥' },
      ]},
    ]
  },
  {
    id: 'profile-settings',
    label: 'Profile Settings',
    icon: '⚙️',
    children: [
      { id: 'name', label: 'Name', icon: '👤' },
      { id: 'email', label: 'Email', icon: '📧' },
      { id: 'contact-number', label: 'Contact Number', icon: '📱' },
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    children: [
      { id: 'kyc', label: 'KYC', icon: '🆔' },
      { id: '3rd-party-auth', label: '3rd Party Authentication', icon: '🔐' },
      { id: 'admin-toggle', label: 'Administration Toggle (access)', icon: '👨‍💼', children: [
        { id: 'elearning-admin', label: 'E-Learning', icon: '📚', children: [
          { id: 'course-creation-admin', label: 'Course Creation', icon: '📝' },
        ]},
        { id: 'ecommerce-admin', label: 'E-Commerce (Sellers Dashboard)', icon: '🛒', children: [
          { id: 'product-listing-admin', label: 'Product Listing', icon: '📦' },
        ]},
        { id: 'social-media-admin', label: 'Social Media', icon: '👥', children: [
          { id: 'community-groups', label: 'Community Groups', icon: '👥' },
          { id: 'business-posts', label: 'Business Posts', icon: '💼' },
        ]},
        { id: 'jobs-admin', label: 'Jobs', icon: '💼', children: [
          { id: 'job-advertisement', label: 'Job Advertisement', icon: '📢' },
          { id: 'recruitment', label: 'Recruitment', icon: '👔' },
        ]},
        { id: 'events-admin', label: 'Events', icon: '📅' },
        { id: 'rd-labs-admin', label: 'R&D Labs', icon: '🔬', children: [
          { id: 'research-funding-pools', label: 'Research Funding Pools', icon: '💰' },
        ]},
        { id: 'sales-admin', label: 'Sales', icon: '💰', children: [
          { id: 'elearning-sales', label: 'E-Learning', icon: '📚' },
          { id: 'ecommerce-sales', label: 'E- Commerce', icon: '🛒' },
          { id: 'trading-sales', label: 'Trading', icon: '📈' },
          { id: 'events-sales', label: 'Events', icon: '📅' },
        ]},
      ]},
    ]
  },
  {
    id: 'qa',
    label: 'Q&A',
    icon: '❓',
    children: [
      { id: 'privacy-policy', label: 'Privacy Policy', icon: '🔒' },
      { id: 'contact-us', label: 'Contact Us', icon: '📧' },
      { id: 'about-us', label: 'About Us', icon: 'ℹ️' },
    ]
  },
  {
    id: 'creator-list',
    label: 'Creator List',
    icon: '👨‍💻'
  },
  {
    id: 'login',
    label: 'Login',
    icon: '🔑'
  },
];

interface LeftSidebarProps {
  collapsed: boolean;
  onModuleChange: (module: string) => void;
  currentModule: string;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ 
  collapsed, 
  onModuleChange, 
  currentModule 
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = currentModule === item.id;

    return (
      <div key={item.id} className={`menu-item level-${level}`}>
        <div 
          className={`menu-item-content ${isActive ? 'active' : ''}`}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            } else {
              onModuleChange(item.id);
            }
          }}
        >
          <span className="menu-icon">{item.icon}</span>
          {!collapsed && (
            <>
              <span className="menu-label">{item.label}</span>
              {hasChildren && (
                <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
              )}
            </>
          )}
        </div>
        
        {hasChildren && isExpanded && !collapsed && (
          <div className="menu-children">
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`left-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2>{collapsed ? 'A' : 'AETHERIAL'}</h2>
      </div>
      
      <div className="menu-items">
        {menuItems.map(item => renderMenuItem(item))}
      </div>
    </div>
  );
};

