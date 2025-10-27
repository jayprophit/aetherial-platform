import React, { useState, useEffect } from 'react';
import {
  Cloud, Server, Database, Shield, Activity, Settings as SettingsIcon,
  ToggleLeft, ToggleRight, AlertTriangle, CheckCircle, XCircle,
  Users, ShoppingCart, GraduationCap, Briefcase, TrendingUp,
  Cpu, Blocks, Zap, Globe, Lock, Unlock, Tool, BarChart3
} from 'lucide-react';

interface PlatformSection {
  id: number;
  sectionKey: string;
  sectionName: string;
  description: string;
  isEnabled: boolean;
  inMaintenance: boolean;
  maintenanceMessage?: string;
  icon: string;
}

interface CloudSetting {
  id: number;
  provider: string;
  region: string;
  instanceType: string;
  autoScaling: boolean;
  cdnEnabled: boolean;
  backupEnabled: boolean;
  monitoringEnabled: boolean;
}

export default function OwnerPortal() {
  const [activeTab, setActiveTab] = useState('sections');
  const [sections, setSections] = useState<PlatformSection[]>([]);
  const [cloudSettings, setCloudSettings] = useState<CloudSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [platformMaintenanceMode, setPlatformMaintenanceMode] = useState(false);

  useEffect(() => {
    loadSections();
    loadCloudSettings();
  }, []);

  const loadSections = async () => {
    try {
      const response = await fetch('/api/platform/sections', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setSections(data.sections || []);
    } catch (error) {
      console.error('Failed to load sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCloudSettings = async () => {
    try {
      const response = await fetch('/api/settings/cloud', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setCloudSettings(data.settings || []);
    } catch (error) {
      console.error('Failed to load cloud settings:', error);
    }
  };

  const toggleSection = async (sectionKey: string, currentState: boolean) => {
    try {
      await fetch(`/api/platform/sections/${sectionKey}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ isEnabled: !currentState }),
      });
      loadSections();
    } catch (error) {
      console.error('Failed to toggle section:', error);
    }
  };

  const toggleMaintenance = async (sectionKey: string, currentState: boolean) => {
    try {
      await fetch(`/api/platform/sections/${sectionKey}/maintenance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          inMaintenance: !currentState,
          maintenanceMessage: 'This section is currently under maintenance. Please check back soon.',
        }),
      });
      loadSections();
    } catch (error) {
      console.error('Failed to toggle maintenance:', error);
    }
  };

  const togglePlatformMaintenance = async () => {
    try {
      await fetch('/api/platform/maintenance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          inMaintenance: !platformMaintenanceMode,
          maintenanceMessage: 'Platform is currently under maintenance. Please check back soon.',
        }),
      });
      setPlatformMaintenanceMode(!platformMaintenanceMode);
      loadSections();
    } catch (error) {
      console.error('Failed to toggle platform maintenance:', error);
    }
  };

  const getSectionIcon = (iconName: string) => {
    const icons: any = {
      'users': Users,
      'shopping-cart': ShoppingCart,
      'graduation-cap': GraduationCap,
      'briefcase': Briefcase,
      'trending-up': TrendingUp,
      'cpu': Cpu,
      'blocks': Blocks,
      'zap': Zap,
    };
    return icons[iconName] || Globe;
  };

  const tabs = [
    { id: 'sections', label: 'Platform Sections', icon: Globe },
    { id: 'cloud', label: 'Cloud Hosting', icon: Cloud },
    { id: 'features', label: 'Feature Toggles', icon: ToggleRight },
    { id: 'system', label: 'System Settings', icon: SettingsIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading owner portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 border-b border-purple-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500 p-3 rounded-lg">
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Owner Cloud Portal</h1>
                <p className="text-purple-200">Platform Oversight & Control</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-purple-800 px-4 py-2 rounded-lg">
                <Activity className="w-5 h-5 text-green-400 inline mr-2" />
                <span className="text-sm">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform-Wide Maintenance Toggle */}
      <div className="bg-red-900/20 border-b border-red-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-bold text-red-400">Platform-Wide Maintenance Mode</p>
                <p className="text-sm text-gray-400">Disable all sections at once for emergency maintenance</p>
              </div>
            </div>
            <button
              onClick={togglePlatformMaintenance}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition ${
                platformMaintenanceMode
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {platformMaintenanceMode ? (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Maintenance ON</span>
                </>
              ) : (
                <>
                  <Unlock className="w-5 h-5" />
                  <span>Maintenance OFF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'sections' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Platform Sections Control</h2>
            <p className="text-gray-400 mb-8">
              Enable or disable entire platform sections. Toggle maintenance mode for specific sections.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((section) => {
                const IconComponent = getSectionIcon(section.icon);
                return (
                  <div key={section.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${section.isEnabled ? 'bg-cyan-500/20' : 'bg-gray-700'}`}>
                          <IconComponent className={`w-6 h-6 ${section.isEnabled ? 'text-cyan-400' : 'text-gray-500'}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{section.sectionName}</h3>
                          <p className="text-sm text-gray-400">{section.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Enable/Disable Toggle */}
                      <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                        <div className="flex items-center space-x-2">
                          {section.isEnabled ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          <span className="text-sm font-medium">
                            {section.isEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleSection(section.sectionKey, section.isEnabled)}
                          className="focus:outline-none"
                        >
                          {section.isEnabled ? (
                            <ToggleRight className="w-10 h-10 text-green-500" />
                          ) : (
                            <ToggleLeft className="w-10 h-10 text-gray-500" />
                          )}
                        </button>
                      </div>

                      {/* Maintenance Mode Toggle */}
                      <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Tool className="w-5 h-5 text-yellow-500" />
                          <span className="text-sm font-medium">
                            Maintenance Mode
                          </span>
                        </div>
                        <button
                          onClick={() => toggleMaintenance(section.sectionKey, section.inMaintenance)}
                          className="focus:outline-none"
                          disabled={!section.isEnabled}
                        >
                          {section.inMaintenance ? (
                            <ToggleRight className="w-10 h-10 text-yellow-500" />
                          ) : (
                            <ToggleLeft className={`w-10 h-10 ${section.isEnabled ? 'text-gray-500' : 'text-gray-700'}`} />
                          )}
                        </button>
                      </div>
                    </div>

                    {section.inMaintenance && (
                      <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-xs text-yellow-400">
                          <AlertTriangle className="w-4 h-4 inline mr-1" />
                          {section.maintenanceMessage || 'Under maintenance'}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'cloud' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Cloud Hosting Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cloudSettings.map((setting) => (
                <div key={setting.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <Server className="w-6 h-6 text-purple-400" />
                    <h3 className="text-lg font-bold">{setting.provider.toUpperCase()}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Region:</span>
                      <span className="text-white">{setting.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Instance:</span>
                      <span className="text-white">{setting.instanceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Auto Scaling:</span>
                      <span className={setting.autoScaling ? 'text-green-400' : 'text-gray-400'}>
                        {setting.autoScaling ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">CDN:</span>
                      <span className={setting.cdnEnabled ? 'text-green-400' : 'text-gray-400'}>
                        {setting.cdnEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Backups:</span>
                      <span className={setting.backupEnabled ? 'text-green-400' : 'text-gray-400'}>
                        {setting.backupEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab !== 'sections' && activeTab !== 'cloud' && (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">
              {tabs.find(t => t.id === activeTab)?.label} coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

