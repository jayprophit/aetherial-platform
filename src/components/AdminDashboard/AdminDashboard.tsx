import React, { useState, useEffect, useCallback } from 'react';

// --- AETHERIAL Platform Core Interfaces ---

/**
 * @interface User
 * Represents a user in the system.
 */
interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'moderator' | 'user' | 'guest';
  status: 'active' | 'suspended' | 'pending';
  registrationDate: string;
  lastLogin: string;
  // AETHERIAL Enhancement: Wallet Address for DeFi/Blockchain integration
  walletAddress: string;
}

/**
 * @interface ContentItem
 * Represents a piece of user-generated content for moderation.
 */
interface ContentItem {
  id: string;
  authorId: string;
  type: 'post' | 'comment' | 'media';
  status: 'pending' | 'approved' | 'rejected';
  reportedCount: number;
  contentSnippet: string;
  createdAt: string;
}

/**
 * @interface AnalyticsData
 * High-level system performance and usage metrics.
 */
interface AnalyticsData {
  totalUsers: number;
  activeUsers24h: number;
  newRegistrationsToday: number;
  moderationQueueCount: number;
  systemHealthScore: number; // 0-100
  // AETHERIAL Enhancement: DeFi/Blockchain Metrics
  totalValueLocked: number; // In USD or native token
  transactionVolume24h: number;
}

/**
 * @interface SystemSettings
 * Represents the configurable system parameters.
 */
interface SystemSettings {
  maintenanceMode: boolean;
  maxUploadSizeMB: number;
  aiModerationEnabled: boolean;
  // AETHERIAL Enhancement: Blockchain Configuration
  blockchainNetwork: 'mainnet' | 'testnet' | 'dev';
  gasPriceLimit: number; // In Gwei
}

// --- Sample Data (In a real application, this would be fetched from an API) ---

const sampleUsers: User[] = [
  { id: 'u001', username: 'alpha_admin', email: 'admin@aetherial.com', role: 'admin', status: 'active', registrationDate: '2024-01-15', lastLogin: '2025-10-27', walletAddress: '0xAdM1nWalletHash123...' },
  { id: 'u002', username: 'mod_squad', email: 'mod@aetherial.com', role: 'moderator', status: 'active', registrationDate: '2024-03-01', lastLogin: '2025-10-26', walletAddress: '0xModWalletHash456...' },
  { id: 'u003', username: 'regular_joe', email: 'joe@aetherial.com', role: 'user', status: 'suspended', registrationDate: '2024-05-10', lastLogin: '2025-10-20', walletAddress: '0xJoeWalletHash789...' },
  { id: 'u004', username: 'new_user', email: 'new@aetherial.com', role: 'user', status: 'pending', registrationDate: '2025-10-28', lastLogin: '2025-10-28', walletAddress: '0xNewWalletHash012...' },
];

const sampleContent: ContentItem[] = [
  { id: 'c001', authorId: 'u003', type: 'post', status: 'pending', reportedCount: 5, contentSnippet: 'This post contains questionable language...', createdAt: '2025-10-27T10:00:00Z' },
  { id: 'c002', authorId: 'u002', type: 'comment', status: 'approved', reportedCount: 0, contentSnippet: 'Great point, I agree!', createdAt: '2025-10-26T15:30:00Z' },
  { id: 'c003', authorId: 'u004', type: 'media', status: 'pending', reportedCount: 12, contentSnippet: 'Reported image for copyright infringement.', createdAt: '2025-10-28T08:00:00Z' },
];

const sampleAnalytics: AnalyticsData = {
  totalUsers: 15400,
  activeUsers24h: 3200,
  newRegistrationsToday: 150,
  moderationQueueCount: 18,
  systemHealthScore: 98,
  totalValueLocked: 1250000.50, // $1.25M TVL
  transactionVolume24h: 45000.75,
};

const sampleSettings: SystemSettings = {
  maintenanceMode: false,
  maxUploadSizeMB: 50,
  aiModerationEnabled: true,
  blockchainNetwork: 'mainnet',
  gasPriceLimit: 100,
};

// --- Component Props Interface (Minimal for a standalone page component) ---

interface AdminDashboardProps {
  // Could include a prop for the current admin user's details or permissions
}

// --- Main Component ---

/**
 * @component AdminDashboard
 * @description The main administration and control panel for the AETHERIAL platform.
 * It provides tools for user management, content moderation, system analytics, and configuration.
 */
const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  // State for active section (Users, Moderation, Analytics, Settings)
  const [activeTab, setActiveTab] = useState<'users' | 'moderation' | 'analytics' | 'settings'>('analytics');
  
  // State for data (simulating API fetch)
  const [users, setUsers] = useState<User[]>([]);
  const [contentQueue, setContentQueue] = useState<ContentItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>(sampleAnalytics);
  const [settings, setSettings] = useState<SystemSettings>(sampleSettings);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate data fetching on component mount
  useEffect(() => {
    // In a real app, this would be an async call to your backend API
    setUsers(sampleUsers);
    setContentQueue(sampleContent);
    // Analytics and Settings are already initialized with sample data above
    setLoading(false);
  }, []);

  // --- Utility Functions (Simulated Actions) ---

  /**
   * @function handleUserAction
   * @description Simulates an action on a user (e.g., suspend, activate, change role).
   */
  const handleUserAction = useCallback((userId: string, action: 'suspend' | 'activate' | 'promote' | 'demote' | 'traceWallet') => {
    console.log(`Action: ${action} on user: ${userId}`);
    // Logic to update state and call API
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        if (action === 'suspend') return { ...user, status: 'suspended' };
        if (action === 'activate') return { ...user, status: 'active' };
        if (action === 'promote') return { ...user, role: user.role === 'user' ? 'moderator' : user.role };
        if (action === 'demote') return { ...user, role: user.role === 'moderator' ? 'user' : user.role };
        if (action === 'traceWallet') {
          const userToTrace = prevUsers.find(u => u.id === userId);
          if (userToTrace) {
            alert(`Simulating trace of wallet: ${userToTrace.walletAddress} on ${settings.blockchainNetwork} explorer.`);
          }
        }
        return user;
      }
      return user;
    }));
  }, []);

  /**
   * @function handleModerationAction
   * @description Simulates an action on a content item (e.g., approve, reject).
   */
  const handleModerationAction = useCallback((contentId: string, action: 'approve' | 'reject') => {
    console.log(`Action: ${action} on content: ${contentId}`);
    // Logic to update state and call API
    setContentQueue(prevContent => prevContent.filter(item => item.id !== contentId));
    // In a real app, you'd update the item status and move it out of the queue
  }, []);

  /**
   * @function handleSettingsUpdate
   * @description Simulates updating system settings.
   */
  const handleSettingsUpdate = useCallback((newSettings: Partial<SystemSettings>) => {
    console.log('Updating settings:', newSettings);
    // Logic to call API and update state
    setSettings(prevSettings => ({ ...prevSettings, ...newSettings }));
  }, []);

  // --- Rendering Functions for Sub-Sections ---

  /**
   * @function renderUserManagement
   * @description Renders the User Management table and controls.
   */
  const renderUserManagement = () => (
    <div className="admin-section user-management">
      <h2>User Management</h2>
      {/* Search/Filter Bar (Simulated) */}
      <div className="filter-bar" style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="Search users by ID, username, or wallet..." style={{ padding: '10px', width: '300px', marginRight: '10px' }} />
        <select style={{ padding: '10px' }}>
          <option value="">Filter by Role</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="user">User</option>
        </select>
        <select style={{ padding: '10px', marginLeft: '10px' }}>
          <option value="">Filter by Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
          <option value="wallet">Has Wallet</option>
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc', backgroundColor: '#f9f9f9' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Username</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Role</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Wallet</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{user.id}</td>
              <td style={{ padding: '10px' }}>{user.username}</td>
              <td style={{ padding: '10px' }}>{user.role}</td>
              <td style={{ padding: '10px' }}>{user.status}</td>
              <td style={{ padding: '10px', fontSize: '0.8em', display: 'flex', alignItems: 'center' }}>
                {user.walletAddress.substring(0, 10)}...
                <button 
                  onClick={() => handleUserAction(user.id, 'traceWallet')} 
                  style={{ marginLeft: '5px', background: '#333', color: 'white', border: 'none', padding: '3px 8px', fontSize: '0.7em', cursor: 'pointer', borderRadius: '4px' }}
                  title="Trace Wallet on Block Explorer"
                >
                  Trace
                </button>
              </td>
              <td style={{ padding: '10px' }}>
                {user.status !== 'suspended' ? (
                  <button onClick={() => handleUserAction(user.id, 'suspend')} style={{ marginRight: '5px', background: 'red', color: 'white', border: 'none', padding: '5px' }}>Suspend</button>
                ) : (
                  <button onClick={() => handleUserAction(user.id, 'activate')} style={{ marginRight: '5px', background: 'green', color: 'white', border: 'none', padding: '5px' }}>Activate</button>
                )}
                {user.role === 'user' && <button onClick={() => handleUserAction(user.id, 'promote')} style={{ background: 'blue', color: 'white', border: 'none', padding: '5px' }}>Promote</button>}
                {user.role === 'moderator' && <button onClick={() => handleUserAction(user.id, 'demote')} style={{ background: 'orange', color: 'white', border: 'none', padding: '5px' }}>Demote</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );

  /**
   * @function renderContentModeration
   * @description Renders the Content Moderation queue and controls.
   */
  const renderContentModeration = () => (
    <div className="admin-section content-moderation">
      <h2>Content Moderation Queue ({contentQueue.length} Pending)</h2>
      {/* AETHERIAL Enhancement: AI Moderation Toggle */}
      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
        <strong>AI Moderation Status:</strong> {settings.aiModerationEnabled ? 'Enabled' : 'Disabled'}
        <span style={{ marginLeft: '10px', color: 'blue', cursor: 'pointer' }}> (View AI Log)</span>
        <button style={{ marginLeft: '15px', padding: '5px' }} onClick={() => handleSettingsUpdate({ aiModerationEnabled: !settings.aiModerationEnabled })}>
          {settings.aiModerationEnabled ? 'Disable AI' : 'Enable AI'}
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc', backgroundColor: '#f9f9f9' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Type</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Reports</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Snippet</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contentQueue.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{item.id}</td>
              <td style={{ padding: '10px' }}>{item.type}</td>
              <td style={{ padding: '10px' }}>{item.reportedCount}</td>
              <td style={{ padding: '10px', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.contentSnippet}</td>
              <td style={{ padding: '10px' }}>
                <button onClick={() => handleModerationAction(item.id, 'approve')} style={{ marginRight: '5px', background: 'green', color: 'white', border: 'none', padding: '5px' }}>Approve</button>
                <button onClick={() => handleModerationAction(item.id, 'reject')} style={{ background: 'red', color: 'white', border: 'none', padding: '5px' }}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );

  /**
   * @function renderAnalytics
   * @description Renders the system and AETHERIAL-specific analytics.
   */
  const renderAnalytics = () => (
    <div className="admin-section analytics">
      <h2>System Analytics & Performance</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {/* Standard Metrics */}
        <MetricCard title="Total Users" value={analytics.totalUsers.toLocaleString()} />
        <MetricCard title="Active Users (24h)" value={analytics.activeUsers24h.toLocaleString()} />
        <MetricCard title="New Today" value={analytics.newRegistrationsToday.toLocaleString()} />
        <MetricCard title="Health Score" value={`${analytics.systemHealthScore}%`} color={analytics.systemHealthScore > 90 ? 'green' : 'orange'} />

        {/* AETHERIAL DeFi/Blockchain Metrics */}
        <MetricCard title="Total Value Locked" value={`$${analytics.totalValueLocked.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} color="blue" />
        <MetricCard title="24h Tx Volume" value={`$${analytics.transactionVolume24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} color="purple" />
        {/* Placeholder for more detailed charts/graphs */}
        <div style={{ gridColumn: 'span 4', height: '200px', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Placeholder for Interactive Charts (e.g., User Growth, TVL Over Time)
        </div>
      </div>
    </div>
  );

  /**
   * @function renderSystemSettings
   * @description Renders the system configuration and AETHERIAL Blockchain settings.
   */
  const renderSystemSettings = () => (
    <div className="admin-section system-settings">
      <h2>System Configuration</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* General Settings */}
        <div className="settings-group general-settings">
          <h3>General</h3>
          <SettingToggle 
            label="Maintenance Mode" 
            checked={settings.maintenanceMode} 
            onChange={() => handleSettingsUpdate({ maintenanceMode: !settings.maintenanceMode })}
            description="Toggle to put the entire platform into a read-only maintenance state."
          />
          <SettingInput 
            label="Max Upload Size (MB)" 
            value={settings.maxUploadSizeMB} 
            type="number"
            onChange={(e) => handleSettingsUpdate({ maxUploadSizeMB: parseInt(e.target.value) })}
            description="Maximum file size users can upload."
          />
        </div>

        {/* AETHERIAL Blockchain Settings */}
        <div className="settings-group blockchain-settings">
          <h3>AETHERIAL Blockchain & DeFi</h3>
          <SettingSelect
            label="Blockchain Network"
            value={settings.blockchainNetwork}
            options={['mainnet', 'testnet', 'dev']}
            onChange={(e) => handleSettingsUpdate({ blockchainNetwork: e.target.value as 'mainnet' | 'testnet' | 'dev' })}
            description="Select the operational blockchain network for all transactions."
          />
          <SettingInput 
            label="Max Gas Price Limit (Gwei)" 
            value={settings.gasPriceLimit} 
            type="number"
            onChange={(e) => handleSettingsUpdate({ gasPriceLimit: parseInt(e.target.value) })}
            description="Sets the maximum gas price for platform-initiated transactions to prevent high fees."
          />
          <button style={{ padding: '10px', background: 'darkblue', color: 'white', border: 'none', marginTop: '15px' }}>
            View Smart Contract Registry
          </button>
        </div>
      </div>
    </div>
  );

  // --- Helper Components (Inline for simplicity, would be separate files in production) ---

  const MetricCard: React.FC<{ title: string, value: string, color?: string }> = ({ title, value, color = '#333' }) => (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
      <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#777' }}>{title}</p>
      <h3 style={{ margin: '0', fontSize: '24px', color: color }}>{value}</h3>
    </div>
  );

  const SettingToggle: React.FC<{ label: string, checked: boolean, onChange: () => void, description: string }> = ({ label, checked, onChange, description }) => (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px', padding: '10px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontWeight: 'bold' }}>{label}</label>
        <input type="checkbox" checked={checked} onChange={onChange} style={{ transform: 'scale(1.2)' }} />
      </div>
      <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>{description}</p>
    </div>
  );

  const SettingInput: React.FC<{ label: string, value: number, type: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, description: string }> = ({ label, value, type, onChange, description }) => (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px', padding: '10px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
      <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>{label}</label>
      <input type={type} value={value} onChange={onChange} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
      <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>{description}</p>
    </div>
  );

  const SettingSelect: React.FC<{ label: string, value: string, options: string[], onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, description: string }> = ({ label, value, options, onChange, description }) => (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '15px', padding: '10px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
      <label style={{ fontWeight: 'bold', marginBottom: '5px' }}>{label}</label>
      <select value={value} onChange={onChange} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
        {options.map(option => <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>)}
      </select>
      <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>{description}</p>
    </div>
  );


  // --- Main Render Logic ---

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Admin Dashboard Data...</div>;
  }

  return (
    <div className="admin-dashboard-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f9', minHeight: '100vh', overflowX: 'auto' }}>
      <header style={{ borderBottom: '1px solid #ddd', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, color: '#333' }}>AETHERIAL Platform Admin Dashboard</h1>
        <div style={{ color: '#555' }}>Welcome, Admin User</div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{ marginBottom: '30px' }}>
        <button 
          onClick={() => setActiveTab('analytics')} 
          style={{ padding: '10px 20px', marginRight: '10px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'analytics' ? '#007bff' : '#e9ecef', color: activeTab === 'analytics' ? 'white' : '#333' }}
        >
          Analytics
        </button>
        <button 
          onClick={() => setActiveTab('users')} 
          style={{ padding: '10px 20px', marginRight: '10px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'users' ? '#007bff' : '#e9ecef', color: activeTab === 'users' ? 'white' : '#333' }}
        >
          User Management
        </button>
        <button 
          onClick={() => setActiveTab('moderation')} 
          style={{ padding: '10px 20px', marginRight: '10px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'moderation' ? '#007bff' : '#e9ecef', color: activeTab === 'moderation' ? 'white' : '#333' }}
        >
          Content Moderation
        </button>
        <button 
          onClick={() => setActiveTab('settings')} 
          style={{ padding: '10px 20px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'settings' ? '#007bff' : '#e9ecef', color: activeTab === 'settings' ? 'white' : '#333' }}
        >
          System Settings
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="dashboard-content" style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        {/* Conditional Rendering based on activeTab */}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'users' && renderUserManagement()}
        {activeTab === 'moderation' && renderContentModeration()}
        {activeTab === 'settings' && renderSystemSettings()}
      </main>

      {/* Responsive Design Consideration: Simple footer for context */}
      <footer style={{ textAlign: 'center', marginTop: '30px', color: '#999', fontSize: '12px' }}>
        AETHERIAL Admin Panel - Optimized for desktop and tablet views. Tables will scroll horizontally on small screens.
        <p style={{ marginTop: '5px' }}>
          <span style={{ fontWeight: 'bold' }}>Responsive Design Note:</span> The main container uses <code>overflowX: 'auto'</code> and tables have a <code>minWidth</code> to ensure a good experience on smaller screens by enabling horizontal scrolling for data tables.
        </p>
      </footer>
    </div>
  );
};

// Export the component as default
export default AdminDashboard;