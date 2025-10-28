/**
 * AETHERIAL Subscription Management Page
 * 
 * Military-Grade Membership Tiers & Billing
 * 
 * Features:
 * - Tier comparison and selection
 * - Payment processing
 * - Usage tracking
 * - Billing history
 * - Subscription management
 * 
 * @module pages/settings/Subscription
 */

import React, { useState, useEffect } from 'react';
import './Subscription.css';

interface Tier {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
    yearlyDiscount: number;
  };
  features: { [key: string]: boolean | number | string };
  limits: any;
  permissions: string[];
}

interface Subscription {
  id: number;
  userId: number;
  tier: string;
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod: string;
}

interface Usage {
  storage: { used: number; limit: number };
  apiCalls: { used: number; limit: number };
  projects: { used: number; limit: number };
  teamMembers: { used: number; limit: number };
  aiRequests: { used: number; limit: number };
}

const Subscription: React.FC = () => {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      
      // Load tiers
      const tiersRes = await fetch('/api/subscription/tiers');
      const tiersData = await tiersRes.json();
      setTiers(tiersData.tiers || []);
      
      // Load current subscription
      const subRes = await fetch('/api/subscription/current');
      const subData = await subRes.json();
      setCurrentSubscription(subData.subscription || null);
      
      // Load usage
      const usageRes = await fetch('/api/subscription/usage');
      const usageData = await usageRes.json();
      setUsage(usageData.usage || null);
      
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tierId: string) => {
    try {
      setSelectedTier(tierId);
      
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId,
          billingCycle
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Redirect to payment
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          alert('Subscription updated successfully!');
          loadSubscriptionData();
        }
      } else {
        alert(data.error || 'Failed to upgrade subscription');
      }
    } catch (error) {
      console.error('Failed to upgrade:', error);
      alert('Failed to upgrade subscription');
    } finally {
      setSelectedTier(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }
    
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Subscription cancelled. You will retain access until the end of your billing period.');
        loadSubscriptionData();
      } else {
        alert(data.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Failed to cancel:', error);
      alert('Failed to cancel subscription');
    }
  };

  const formatUsage = (used: number, limit: number): string => {
    if (limit === -1) return `${used} / Unlimited`;
    return `${used} / ${limit}`;
  };

  const getUsagePercentage = (used: number, limit: number): number => {
    if (limit === -1) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  if (loading) {
    return (
      <div className="subscription-page">
        <div className="loading-state">Loading subscription data...</div>
      </div>
    );
  }

  return (
    <div className="subscription-page">
      <div className="subscription-header">
        <h1>Subscription & Billing</h1>
        <p>Manage your membership tier and billing settings</p>
      </div>

      {/* Current Subscription */}
      {currentSubscription && (
        <div className="current-subscription">
          <h2>Current Plan</h2>
          <div className="subscription-card">
            <div className="subscription-info">
              <div className="tier-badge">{currentSubscription.tier.toUpperCase()}</div>
              <div className="subscription-details">
                <p><strong>Status:</strong> <span className={`status-${currentSubscription.status}`}>{currentSubscription.status}</span></p>
                <p><strong>Billing Cycle:</strong> {currentSubscription.billingCycle}</p>
                <p><strong>Renews:</strong> {new Date(currentSubscription.endDate).toLocaleDateString()}</p>
                <p><strong>Auto-Renew:</strong> {currentSubscription.autoRenew ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
            {currentSubscription.tier !== 'free' && (
              <button onClick={handleCancelSubscription} className="btn btn-error btn-sm">
                Cancel Subscription
              </button>
            )}
          </div>
        </div>
      )}

      {/* Usage Stats */}
      {usage && (
        <div className="usage-section">
          <h2>Usage This Month</h2>
          <div className="usage-grid">
            <div className="usage-card">
              <div className="usage-header">
                <span className="usage-label">Storage</span>
                <span className="usage-value">{formatUsage(usage.storage.used, usage.storage.limit)} GB</span>
              </div>
              <div className="usage-bar">
                <div 
                  className="usage-fill" 
                  style={{ width: `${getUsagePercentage(usage.storage.used, usage.storage.limit)}%` }}
                />
              </div>
            </div>

            <div className="usage-card">
              <div className="usage-header">
                <span className="usage-label">API Calls</span>
                <span className="usage-value">{formatUsage(usage.apiCalls.used, usage.apiCalls.limit)}</span>
              </div>
              <div className="usage-bar">
                <div 
                  className="usage-fill" 
                  style={{ width: `${getUsagePercentage(usage.apiCalls.used, usage.apiCalls.limit)}%` }}
                />
              </div>
            </div>

            <div className="usage-card">
              <div className="usage-header">
                <span className="usage-label">Projects</span>
                <span className="usage-value">{formatUsage(usage.projects.used, usage.projects.limit)}</span>
              </div>
              <div className="usage-bar">
                <div 
                  className="usage-fill" 
                  style={{ width: `${getUsagePercentage(usage.projects.used, usage.projects.limit)}%` }}
                />
              </div>
            </div>

            <div className="usage-card">
              <div className="usage-header">
                <span className="usage-label">Team Members</span>
                <span className="usage-value">{formatUsage(usage.teamMembers.used, usage.teamMembers.limit)}</span>
              </div>
              <div className="usage-bar">
                <div 
                  className="usage-fill" 
                  style={{ width: `${getUsagePercentage(usage.teamMembers.used, usage.teamMembers.limit)}%` }}
                />
              </div>
            </div>

            <div className="usage-card">
              <div className="usage-header">
                <span className="usage-label">AI Requests</span>
                <span className="usage-value">{formatUsage(usage.aiRequests.used, usage.aiRequests.limit)}</span>
              </div>
              <div className="usage-bar">
                <div 
                  className="usage-fill" 
                  style={{ width: `${getUsagePercentage(usage.aiRequests.used, usage.aiRequests.limit)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Cycle Toggle */}
      <div className="billing-cycle-toggle">
        <h2>Choose Your Plan</h2>
        <div className="toggle-buttons">
          <button 
            className={billingCycle === 'monthly' ? 'active' : ''}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button 
            className={billingCycle === 'yearly' ? 'active' : ''}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly <span className="discount-badge">Save 17%</span>
          </button>
        </div>
      </div>

      {/* Tier Comparison */}
      <div className="tiers-grid">
        {tiers.map((tier) => {
          const price = billingCycle === 'monthly' ? tier.price.monthly : tier.price.yearly / 12;
          const isCurrentTier = currentSubscription?.tier === tier.id;
          const isUpgrade = currentSubscription && tier.id !== 'free' && tier.id !== currentSubscription.tier;
          
          return (
            <div 
              key={tier.id} 
              className={`tier-card ${isCurrentTier ? 'current' : ''} ${tier.id === 'business' ? 'popular' : ''}`}
            >
              {tier.id === 'business' && <div className="popular-badge">Most Popular</div>}
              
              <div className="tier-header">
                <h3>{tier.name}</h3>
                <p className="tier-description">{tier.description}</p>
              </div>

              <div className="tier-pricing">
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">{price.toFixed(0)}</span>
                  <span className="period">/month</span>
                </div>
                {billingCycle === 'yearly' && tier.price.yearly > 0 && (
                  <p className="billing-note">Billed ${tier.price.yearly}/year</p>
                )}
              </div>

              <div className="tier-features">
                {Object.entries(tier.features).map(([feature, value]) => (
                  <div key={feature} className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span className="feature-text">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="tier-action">
                {isCurrentTier ? (
                  <button className="btn btn-outline" disabled>Current Plan</button>
                ) : (
                  <button 
                    className={`btn ${tier.id === 'enterprise' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleUpgrade(tier.id)}
                    disabled={selectedTier === tier.id}
                  >
                    {selectedTier === tier.id ? 'Processing...' : isUpgrade ? 'Upgrade' : 'Get Started'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enterprise Contact */}
      <div className="enterprise-contact">
        <h2>Need a Custom Plan?</h2>
        <p>Contact our sales team for custom enterprise solutions with dedicated support and infrastructure.</p>
        <button className="btn btn-primary">Contact Sales</button>
      </div>
    </div>
  );
};

export default Subscription;

