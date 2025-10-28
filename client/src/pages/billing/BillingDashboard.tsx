/**
 * AETHERIAL Platform - Billing & Subscriptions Dashboard
 * Complete billing, subscriptions, and payment management system
 */

import React, { useState, useEffect } from 'react';
import { unifiedSystemHub } from '../../lib/integration/unified-system-hub';
import './BillingDashboard.css';

interface Subscription {
  id: string;
  plan: 'Free' | 'Basic' | 'Pro' | 'Enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  price: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  features: string[];
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  downloadUrl: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'crypto' | 'paypal';
  last4: string;
  expiryDate?: string;
  isDefault: boolean;
}

const SUBSCRIPTION_PLANS = [
  {
    name: 'Free',
    price: 0,
    billingCycle: 'forever',
    features: [
      'Basic AI Tools',
      '5 Projects',
      '1GB Storage',
      'Community Support',
      'Standard Security'
    ],
    color: '#667eea'
  },
  {
    name: 'Basic',
    price: 9.99,
    billingCycle: 'monthly',
    features: [
      'All Free Features',
      'Advanced AI Tools',
      '50 Projects',
      '10GB Storage',
      'Email Support',
      'Priority Processing'
    ],
    color: '#764ba2'
  },
  {
    name: 'Pro',
    price: 29.99,
    billingCycle: 'monthly',
    features: [
      'All Basic Features',
      'Quantum AI Access',
      'Unlimited Projects',
      '100GB Storage',
      '24/7 Support',
      'API Access',
      'Custom Integrations'
    ],
    color: '#f093fb',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 99.99,
    billingCycle: 'monthly',
    features: [
      'All Pro Features',
      'Dedicated AI Instance',
      'Unlimited Storage',
      'White Label Options',
      'Dedicated Support Team',
      'Custom Development',
      'SLA Guarantee',
      'Advanced Analytics'
    ],
    color: '#4facfe'
  }
];

export const BillingDashboard: React.FC = () => {
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'invoices' | 'payment'>('overview');

  useEffect(() => {
    unifiedSystemHub.publishEvent({
      id: `billing-init-${Date.now()}`,
      timestamp: new Date(),
      source: 'billing-dashboard',
      type: 'billing.system.initialized',
      data: { plans: SUBSCRIPTION_PLANS.length },
      priority: 'high',
      propagate: true,
    });

    // Simulate loading data
    setTimeout(() => {
      setCurrentSubscription({
        id: 'sub_1',
        plan: 'Pro',
        status: 'active',
        price: 29.99,
        billingCycle: 'monthly',
        nextBillingDate: '2025-11-28',
        features: SUBSCRIPTION_PLANS[2].features
      });

      setInvoices([
        {
          id: 'inv_001',
          date: '2025-10-28',
          amount: 29.99,
          status: 'paid',
          description: 'Pro Plan - Monthly',
          downloadUrl: '#'
        },
        {
          id: 'inv_002',
          date: '2025-09-28',
          amount: 29.99,
          status: 'paid',
          description: 'Pro Plan - Monthly',
          downloadUrl: '#'
        }
      ]);

      setPaymentMethods([
        {
          id: 'pm_001',
          type: 'card',
          last4: '4242',
          expiryDate: '12/26',
          isDefault: true
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleUpgrade = (planName: string) => {
    unifiedSystemHub.publishEvent({
      id: `billing-upgrade-${Date.now()}`,
      timestamp: new Date(),
      source: 'billing-dashboard',
      type: 'billing.subscription.upgrade',
      data: { plan: planName },
      priority: 'high',
      propagate: true,
    });
    alert(`Upgrading to ${planName} plan...`);
  };

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription?')) {
      unifiedSystemHub.publishEvent({
        id: `billing-cancel-${Date.now()}`,
        timestamp: new Date(),
        source: 'billing-dashboard',
        type: 'billing.subscription.cancelled',
        data: { subscriptionId: currentSubscription?.id },
        priority: 'high',
        propagate: true,
      });
      alert('Subscription cancelled. You will retain access until the end of your billing period.');
    }
  };

  if (loading) {
    return (
      <div className="billing-dashboard">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-dashboard">
      <header className="billing-header">
        <h1>💳 Billing & Subscriptions</h1>
        <p>Manage your subscription, invoices, and payment methods</p>
      </header>

      <div className="billing-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'plans' ? 'active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          Plans & Pricing
        </button>
        <button 
          className={`tab ${activeTab === 'invoices' ? 'active' : ''}`}
          onClick={() => setActiveTab('invoices')}
        >
          Invoices
        </button>
        <button 
          className={`tab ${activeTab === 'payment' ? 'active' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          Payment Methods
        </button>
      </div>

      <div className="billing-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="current-plan-card">
              <h2>Current Subscription</h2>
              {currentSubscription ? (
                <>
                  <div className="plan-badge">{currentSubscription.plan} Plan</div>
                  <div className="plan-price">${currentSubscription.price}/{currentSubscription.billingCycle}</div>
                  <div className="plan-status">
                    <span className={`status-badge ${currentSubscription.status}`}>
                      {currentSubscription.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="next-billing">
                    Next billing date: <strong>{currentSubscription.nextBillingDate}</strong>
                  </div>
                  <div className="plan-features">
                    <h3>Your Features:</h3>
                    <ul>
                      {currentSubscription.features.map((feature, index) => (
                        <li key={index}>✓ {feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="plan-actions">
                    <button className="btn btn-primary" onClick={() => setActiveTab('plans')}>
                      Upgrade Plan
                    </button>
                    <button className="btn btn-secondary" onClick={handleCancelSubscription}>
                      Cancel Subscription
                    </button>
                  </div>
                </>
              ) : (
                <div className="no-subscription">
                  <p>You don't have an active subscription</p>
                  <button className="btn btn-primary" onClick={() => setActiveTab('plans')}>
                    View Plans
                  </button>
                </div>
              )}
            </div>

            <div className="billing-summary">
              <h2>Billing Summary</h2>
              <div className="summary-grid">
                <div className="summary-item">
                  <div className="summary-label">Total Spent</div>
                  <div className="summary-value">$59.98</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Next Payment</div>
                  <div className="summary-value">$29.99</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Invoices</div>
                  <div className="summary-value">{invoices.length}</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Payment Methods</div>
                  <div className="summary-value">{paymentMethods.length}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="plans-section">
            <h2>Choose Your Plan</h2>
            <div className="plans-grid">
              {SUBSCRIPTION_PLANS.map((plan, index) => (
                <div key={index} className={`plan-card ${plan.popular ? 'popular' : ''}`}>
                  {plan.popular && <div className="popular-badge">Most Popular</div>}
                  <h3>{plan.name}</h3>
                  <div className="plan-price-display">
                    <span className="currency">$</span>
                    <span className="amount">{plan.price}</span>
                    <span className="period">/{plan.billingCycle}</span>
                  </div>
                  <ul className="features-list">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>✓ {feature}</li>
                    ))}
                  </ul>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleUpgrade(plan.name)}
                    disabled={currentSubscription?.plan === plan.name}
                  >
                    {currentSubscription?.plan === plan.name ? 'Current Plan' : `Choose ${plan.name}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="invoices-section">
            <h2>Invoice History</h2>
            <div className="invoices-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(invoice => (
                    <tr key={invoice.id}>
                      <td>{invoice.date}</td>
                      <td>{invoice.description}</td>
                      <td>${invoice.amount.toFixed(2)}</td>
                      <td>
                        <span className={`status-badge ${invoice.status}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td>
                        <a href={invoice.downloadUrl} className="btn btn-small">Download</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="payment-section">
            <h2>Payment Methods</h2>
            <div className="payment-methods">
              {paymentMethods.map(method => (
                <div key={method.id} className="payment-method-card">
                  <div className="method-icon">
                    {method.type === 'card' && '💳'}
                    {method.type === 'bank' && '🏦'}
                    {method.type === 'crypto' && '₿'}
                    {method.type === 'paypal' && '💰'}
                  </div>
                  <div className="method-details">
                    <div className="method-type">{method.type.toUpperCase()}</div>
                    <div className="method-number">•••• {method.last4}</div>
                    {method.expiryDate && <div className="method-expiry">Expires {method.expiryDate}</div>}
                    {method.isDefault && <span className="default-badge">Default</span>}
                  </div>
                  <div className="method-actions">
                    <button className="btn btn-small">Edit</button>
                    <button className="btn btn-small btn-danger">Remove</button>
                  </div>
                </div>
              ))}
              <button className="btn btn-primary add-payment-btn">
                + Add Payment Method
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingDashboard;

