import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Settings, User, CreditCard, Shield, Lock, Bell, Zap, Cpu, DollarSign, Wallet } from 'lucide-react'; // Using lucide-react for icons

// --- 1. TypeScript Interfaces and Types ---

/**
 * Interface for the user's profile information.
 */
interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  profilePictureUrl: string;
  walletAddress: string; // AETHERIAL: Blockchain integration - Primary wallet address
}

/**
 * Interface for account settings.
 */
interface AccountSettings {
  email: string;
  phoneNumber: string;
  language: string;
  timezone: string;
  currency: 'USD' | 'ETH' | 'AETH'; // AETHERIAL: Cryptocurrency/Token option
}

/**
 * Interface for KYC (Know Your Customer) status.
 */
interface KycStatus {
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_STARTED';
  lastSubmissionDate: string | null;
  verificationLevel: 'Basic' | 'Advanced';
}

/**
 * Interface for security settings.
 */
interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  activeSessions: number;
  recoveryPhraseSet: boolean; // AETHERIAL: Security enhancement - for wallet/account recovery
}

/**
 * Interface for privacy settings.
 */
interface PrivacySettings {
  profileVisibility: 'Public' | 'Friends' | 'Private';
  dataSharingEnabled: boolean;
  aiPersonalizationEnabled: boolean; // AETHERIAL: AI integration - opt-in for AI-driven features
}

/**
 * Interface for notification settings.
 */
interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  defiAlerts: boolean; // AETHERIAL: DeFi integration - alerts for staking/governance
}

/**
 * Master interface for all settings data.
 */
interface SettingsData {
  profile: UserProfile;
  account: AccountSettings;
  kyc: KycStatus;
  security: SecuritySettings;
  privacy: PrivacySettings;
  notifications: NotificationSettings;
}

// --- 2. Sample Data (Simulating API Fetch) ---

const initialSettingsData: SettingsData = {
  profile: {
    firstName: 'Jay',
    lastName: 'Prophet',
    username: 'jayprophit',
    bio: 'Building the Aetherial Platform. Web3 enthusiast and full-stack developer.',
    profilePictureUrl: 'https://i.imgur.com/example.png',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
  },
  account: {
    email: 'jay.prophet@aetherial.io',
    phoneNumber: '+1-555-123-4567',
    language: 'en-US',
    timezone: 'PST',
    currency: 'AETH',
  },
  kyc: {
    status: 'VERIFIED',
    lastSubmissionDate: '2025-10-20',
    verificationLevel: 'Advanced',
  },
  security: {
    twoFactorEnabled: true,
    lastPasswordChange: '2025-09-01',
    activeSessions: 3,
    recoveryPhraseSet: true,
  },
  privacy: {
    profileVisibility: 'Public',
    dataSharingEnabled: false,
    aiPersonalizationEnabled: true,
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    defiAlerts: true,
  },
};

// --- 3. Component Structure and State Management ---

/**
 * The main Settings Page component.
 * It manages all the state for the different settings sections.
 */
const SettingsPage: React.FC = () => {
  // State for all user settings
  const [settings, setSettings] = useState<SettingsData>(initialSettingsData);
  // State to manage loading and saving status
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  // State to control which tab is currently active
  const [activeTab, setActiveTab] = useState<keyof SettingsData>('profile');
  // State for showing a success/error message after saving
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Simulate fetching data on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Simulate network delay and API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // In a real app, you would fetch and set the data here: setSettings(fetchedData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  /**
   * Generic handler for form input changes (text, select, checkbox).
   * @param section The top-level settings section (e.g., 'profile').
   * @param field The specific field within the section (e.g., 'firstName').
   * @param value The new value for the field.
   */
  const handleInputChange = useCallback(<K extends keyof SettingsData, F extends keyof SettingsData[K]>(
    section: K,
    field: F,
    value: SettingsData[K][F]
  ) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [field]: value,
      },
    }));
  }, []);

  /**
   * Simulate saving data to the API.
   */
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setMessage(null);
    console.log('Attempting to save settings:', settings);
    try {
      // Simulate API POST/PUT call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      // In a real application, handle specific API errors
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  }, [settings]);

  // Helper component for a generic form field
  const FormField: React.FC<{
    label: string;
    children: React.ReactNode;
    className?: string;
  }> = ({ label, children, className = '' }) => (
    <div className={`form-field ${className}`}>
      <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
      {children}
    </div>
  );

  // Helper component for a toggle switch (checkbox)
  const ToggleField: React.FC<{
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description: string;
  }> = ({ label, checked, onChange, description }) => (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        {/* Toggle switch visual */}
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  // --- 4. Section Renderers ---

  const renderProfileSettings = useMemo(() => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold border-b pb-2 flex items-center"><User className="w-5 h-5 mr-2" /> Profile Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="First Name">
          <input
            type="text"
            value={settings.profile.firstName}
            onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </FormField>
        <FormField label="Last Name">
          <input
            type="text"
            value={settings.profile.lastName}
            onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </FormField>
      </div>
      <FormField label="Username">
        <input
          type="text"
          value={settings.profile.username}
          onChange={(e) => handleInputChange('profile', 'username', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </FormField>
      <FormField label="Bio">
        <textarea
          value={settings.profile.bio}
          onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </FormField>
      {/* AETHERIAL Enhancement: Wallet Address Display */}
      <FormField label="Connected Wallet Address (Immutable)">
        <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono break-all">
          <Wallet className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
          <span className="truncate">{settings.profile.walletAddress}</span>
          <button
            // NOTE: navigator.clipboard.writeText is a browser API and is not available in the sandbox environment.
            // In a real React app, this would copy the wallet address.
            onClick={() => console.log(`Copied: ${settings.profile.walletAddress}`)}
            className="ml-auto text-blue-500 hover:text-blue-700 text-xs font-semibold flex-shrink-0"
          >
            Copy
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">This address is linked to your on-chain identity and cannot be changed.</p>
      </FormField>
    </div>
  ), [settings.profile, handleInputChange]);

  const renderAccountSettings = useMemo(() => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold border-b pb-2 flex items-center"><CreditCard className="w-5 h-5 mr-2" /> Account Details</h2>
      <FormField label="Email">
        <input
          type="email"
          value={settings.account.email}
          onChange={(e) => handleInputChange('account', 'email', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </FormField>
      <FormField label="Preferred Currency">
        <div className="relative">
          <select
            value={settings.account.currency}
            onChange={(e) => handleInputChange('account', 'currency', e.target.value as AccountSettings['currency'])}
            className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="ETH">ETH - Ethereum</option>
            <option value="AETH">AETH - Aetherial Token (Default)</option>
          </select>
          <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <p className="text-xs text-gray-500 mt-1">This affects how balances and transactions are displayed.</p>
      </FormField>
      <div className="pt-4 border-t">
        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
          Deactivate Account
        </button>
        <p className="text-sm text-gray-500 mt-2">Permanently remove your account and all associated data.</p>
      </div>
    </div>
  ), [settings.account, handleInputChange]);

  const renderKycSettings = useMemo(() => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold border-b pb-2 flex items-center"><Shield className="w-5 h-5 mr-2" /> KYC Verification</h2>
      <div className="p-4 rounded-lg" style={{ backgroundColor: settings.kyc.status === 'VERIFIED' ? '#e6ffed' : settings.kyc.status === 'PENDING' ? '#fffbe6' : '#fee2e2' }}>
        <p className="text-lg font-bold flex items-center">
          Status:
          <span className={`ml-2 ${settings.kyc.status === 'VERIFIED' ? 'text-green-700' : 'text-red-700'}`}>
            {settings.kyc.status}
          </span>
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Verification Level: <span className="font-semibold">{settings.kyc.verificationLevel}</span>
        </p>
        {settings.kyc.lastSubmissionDate && (
          <p className="text-xs text-gray-500 mt-1">Last Submission: {settings.kyc.lastSubmissionDate}</p>
        )}
      </div>
      {settings.kyc.status !== 'VERIFIED' && (
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
          Start/Update KYC Submission
        </button>
      )}
      {settings.kyc.status === 'VERIFIED' && (
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200">
          View Verification Documents
        </button>
      )}
    </div>
  ), [settings.kyc]);

  const renderSecuritySettings = useMemo(() => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold border-b pb-2 flex items-center"><Lock className="w-5 h-5 mr-2" /> Security</h2>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <ToggleField
          label="Two-Factor Authentication (2FA)"
          description="Add an extra layer of security to your account."
          checked={settings.security.twoFactorEnabled}
          onChange={(checked) => handleInputChange('security', 'twoFactorEnabled', checked)}
        />
        <div className="py-3 border-b">
          <p className="font-medium text-gray-900">Password</p>
          <p className="text-sm text-gray-500 mb-2">Last changed: {settings.security.lastPasswordChange}</p>
          <button className="text-blue-500 hover:text-blue-700 font-bold text-sm">
            Change Password
          </button>
        </div>
        {/* AETHERIAL Enhancement: Recovery Phrase */}
        <div className="py-3">
          <p className="font-medium text-gray-900">Recovery Phrase</p>
          <p className="text-sm text-gray-500 mb-2">
            Your unique 12-word phrase for wallet and account recovery.
          </p>
          <button
            className={`font-bold py-2 px-4 rounded-lg transition duration-200 text-sm ${
              settings.security.recoveryPhraseSet
                ? 'bg-green-100 text-green-700 cursor-default'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
            disabled={settings.security.recoveryPhraseSet}
          >
            {settings.security.recoveryPhraseSet ? 'Recovery Phrase Set' : 'Set Recovery Phrase Now'}
          </button>
        </div>
      </div>
      <div className="pt-4 border-t">
        <p className="font-medium text-gray-900 mb-2">Active Sessions</p>
        <p className="text-sm text-gray-500">You are currently logged in on {settings.security.activeSessions} devices.</p>
        <button className="text-red-500 hover:text-red-700 font-bold text-sm mt-1">
          Log out of all other sessions
        </button>
      </div>
    </div>
  ), [settings.security, handleInputChange]);

  const renderPrivacySettings = useMemo(() => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold border-b pb-2 flex items-center"><Zap className="w-5 h-5 mr-2" /> Privacy</h2>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <FormField label="Profile Visibility">
          <select
            value={settings.privacy.profileVisibility}
            onChange={(e) => handleInputChange('privacy', 'profileVisibility', e.target.value as PrivacySettings['profileVisibility'])}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Public">Public - Visible to everyone</option>
            <option value="Friends">Friends - Visible only to connections</option>
            <option value="Private">Private - Visible only to you</option>
          </select>
        </FormField>
        {/* AETHERIAL Enhancement: AI Personalization */}
        <ToggleField
          label="AI-Driven Personalization"
          description="Allow our AI to analyze your activity to personalize content and recommendations."
          checked={settings.privacy.aiPersonalizationEnabled}
          onChange={(checked) => handleInputChange('privacy', 'aiPersonalizationEnabled', checked)}
        />
        <ToggleField
          label="Data Sharing"
          description="Share anonymized data with third-party partners for platform improvement."
          checked={settings.privacy.dataSharingEnabled}
          onChange={(checked) => handleInputChange('privacy', 'dataSharingEnabled', checked)}
        />
      </div>
      <div className="pt-4 border-t">
        <button className="text-blue-500 hover:text-blue-700 font-bold text-sm">
          Download My Data
        </button>
        <p className="text-sm text-gray-500 mt-2">Request a copy of all your personal data stored on the platform.</p>
      </div>
    </div>
  ), [settings.privacy, handleInputChange]);

  const renderNotificationSettings = useMemo(() => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold border-b pb-2 flex items-center"><Bell className="w-5 h-5 mr-2" /> Notifications</h2>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <p className="font-semibold text-lg mb-4">General Alerts</p>
        <ToggleField
          label="Email Notifications"
          description="Receive important updates and announcements via email."
          checked={settings.notifications.emailNotifications}
          onChange={(checked) => handleInputChange('notifications', 'emailNotifications', checked)}
        />
        <ToggleField
          label="Push Notifications"
          description="Receive real-time alerts on your mobile or desktop device."
          checked={settings.notifications.pushNotifications}
          onChange={(checked) => handleInputChange('notifications', 'pushNotifications', checked)}
        />
        <ToggleField
          label="SMS Notifications"
          description="Receive critical security alerts via text message."
          checked={settings.notifications.smsNotifications}
          onChange={(checked) => handleInputChange('notifications', 'smsNotifications', checked)}
        />
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <p className="font-semibold text-lg mb-4 flex items-center"><Cpu className="w-5 h-5 mr-2" /> AETHERIAL & DeFi Alerts</p>
        {/* AETHERIAL Enhancement: DeFi Alerts */}
        <ToggleField
          label="Decentralized Finance (DeFi) Alerts"
          description="Get notified about staking rewards, governance proposals, and smart contract activity."
          checked={settings.notifications.defiAlerts}
          onChange={(checked) => handleInputChange('notifications', 'defiAlerts', checked)}
        />
      </div>
    </div>
  ), [settings.notifications, handleInputChange]);

  const renderActiveTab = () => {
    if (isLoading) {
      return <div className="text-center py-10 text-lg text-gray-500 flex items-center justify-center"><Settings className="w-6 h-6 animate-spin mr-2" /> Loading settings...</div>;
    }

    switch (activeTab) {
      case 'profile':
        return renderProfileSettings;
      case 'account':
        return renderAccountSettings;
      case 'kyc':
        return renderKycSettings;
      case 'security':
        return renderSecuritySettings;
      case 'privacy':
        return renderPrivacySettings;
      case 'notifications':
        return renderNotificationSettings;
      default:
        return <div className="text-center py-10 text-red-500">Settings section not found.</div>;
    }
  };

  const tabs: { id: keyof SettingsData; label: string; icon: React.FC<React.ComponentProps<typeof Settings>> }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: CreditCard },
    { id: 'kyc', label: 'KYC', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'privacy', label: 'Privacy', icon: Zap },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto bg-white shadow-2xl rounded-xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-4 flex items-center">
        <Settings className="w-8 h-8 mr-3 text-blue-600" /> User Settings
      </h1>

      {/* Responsive Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setMessage(null); // Clear message on tab change
            }}
            className={`flex items-center py-2 px-4 text-sm font-medium transition-colors duration-200 rounded-lg whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-700 border-blue-500'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Content Area */}
      <div className="min-h-[400px] p-4 border border-gray-200 rounded-xl bg-gray-50">
        {renderActiveTab()}
      </div>

      {/* Save Button and Status Message */}
      <div className="mt-8 pt-4 border-t flex flex-col sm:flex-row justify-between items-center">
        {message && (
          <div
            className={`mb-4 sm:mb-0 p-3 rounded-lg text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={isLoading || isSaving}
          className={`py-3 px-8 rounded-full text-white font-semibold shadow-lg transition duration-200 flex items-center justify-center ${
            isSaving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isSaving ? (
            <>
              <Settings className="w-4 h-4 animate-spin mr-2" /> Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;