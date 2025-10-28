import React, { useState, useEffect } from 'react';
import './MembershipTiers.css';

interface Tier {
  id: number;
  name: string;
  displayName: string;
  level: number;
  minPoints: number;
  benefits: string[];
  pointsMultiplier: string;
  discountPercentage: number;
  features: string[];
  monthlyPrice: string | null;
  yearlyPrice: string | null;
  description: string;
  icon: string;
  color: string;
}

interface UserPoints {
  totalPoints: number;
  availablePoints: number;
  membershipTier: string;
}

const MembershipTiers: React.FC = () => {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch membership tiers
      const tiersRes = await fetch('/api/membership/tiers');
      const tiersData = await tiersRes.json();
      setTiers(tiersData || []);

      // Fetch user points
      const pointsRes = await fetch('/api/points');
      const pointsData = await pointsRes.json();
      setUserPoints(pointsData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleUpgradeTier = async (tierId: number) => {
    try {
      const res = await fetch('/api/membership/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId }),
      });

      if (res.ok) {
        alert('Membership upgraded successfully!');
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to upgrade membership');
      }
    } catch (error) {
      console.error('Error upgrading tier:', error);
      alert('Error upgrading membership');
    }
  };

  const getTierIcon = (name: string) => {
    switch (name) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'platinum': return '💎';
      default: return '⭐';
    }
  };

  const getTierColor = (name: string) => {
    switch (name) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      case 'platinum': return '#E5E4E2';
      default: return '#667eea';
    }
  };

  const isCurrentTier = (tierName: string) => {
    return userPoints?.membershipTier === tierName;
  };

  const canUpgrade = (tier: Tier) => {
    if (!userPoints) return false;
    return userPoints.totalPoints >= tier.minPoints && !isCurrentTier(tier.name);
  };

  if (loading) {
    return (
      <div className="membership-tiers">
        <div className="loading">Loading membership tiers...</div>
      </div>
    );
  }

  return (
    <div className="membership-tiers">
      <div className="tiers-header">
        <h1>💎 Membership Tiers</h1>
        <p>Unlock exclusive benefits and features as you level up!</p>
        
        {userPoints && (
          <div className="current-tier-badge" style={{ backgroundColor: getTierColor(userPoints.membershipTier) }}>
            <span className="badge-icon">{getTierIcon(userPoints.membershipTier)}</span>
            <span className="badge-text">Current Tier: {userPoints.membershipTier.toUpperCase()}</span>
            <span className="badge-points">{userPoints.totalPoints.toLocaleString()} points</span>
          </div>
        )}
      </div>

      {/* Billing Toggle */}
      <div className="billing-toggle">
        <button 
          className={`billing-btn ${selectedBilling === 'monthly' ? 'active' : ''}`}
          onClick={() => setSelectedBilling('monthly')}
        >
          Monthly
        </button>
        <button 
          className={`billing-btn ${selectedBilling === 'yearly' ? 'active' : ''}`}
          onClick={() => setSelectedBilling('yearly')}
        >
          Yearly <span className="save-badge">Save 20%</span>
        </button>
      </div>

      {/* Tiers Grid */}
      <div className="tiers-grid">
        {tiers.sort((a, b) => a.level - b.level).map((tier) => (
          <div 
            key={tier.id} 
            className={`tier-card ${isCurrentTier(tier.name) ? 'current' : ''}`}
            style={{ borderColor: getTierColor(tier.name) }}
          >
            <div className="tier-header" style={{ background: `linear-gradient(135deg, ${getTierColor(tier.name)}, ${getTierColor(tier.name)}dd)` }}>
              <div className="tier-icon">{getTierIcon(tier.name)}</div>
              <h3>{tier.displayName}</h3>
              {isCurrentTier(tier.name) && <span className="current-badge">Current Tier</span>}
            </div>

            <div className="tier-body">
              <div className="tier-price">
                {tier.monthlyPrice || tier.yearlyPrice ? (
                  <>
                    <span className="price-amount">
                      ${selectedBilling === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice}
                    </span>
                    <span className="price-period">/{selectedBilling === 'monthly' ? 'month' : 'year'}</span>
                  </>
                ) : (
                  <span className="price-free">Free</span>
                )}
              </div>

              <div className="tier-requirements">
                <div className="requirement">
                  <span className="req-label">Minimum Points:</span>
                  <span className="req-value">{tier.minPoints.toLocaleString()}</span>
                </div>
                <div className="requirement">
                  <span className="req-label">Points Multiplier:</span>
                  <span className="req-value">{tier.pointsMultiplier}x</span>
                </div>
                <div className="requirement">
                  <span className="req-label">Discount:</span>
                  <span className="req-value">{tier.discountPercentage}%</span>
                </div>
              </div>

              <div className="tier-benefits">
                <h4>Benefits</h4>
                <ul>
                  {tier.benefits.map((benefit, index) => (
                    <li key={index}>
                      <span className="benefit-icon">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="tier-features">
                <h4>Features</h4>
                <ul>
                  {tier.features.map((feature, index) => (
                    <li key={index}>
                      <span className="feature-icon">⚡</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                className={`upgrade-btn ${isCurrentTier(tier.name) ? 'current' : canUpgrade(tier) ? 'available' : 'locked'}`}
                onClick={() => handleUpgradeTier(tier.id)}
                disabled={isCurrentTier(tier.name) || !canUpgrade(tier)}
                style={{ 
                  background: isCurrentTier(tier.name) ? '#ccc' : canUpgrade(tier) ? `linear-gradient(135deg, ${getTierColor(tier.name)}, ${getTierColor(tier.name)}dd)` : '#e0e0e0'
                }}
              >
                {isCurrentTier(tier.name) ? 'Current Tier' : canUpgrade(tier) ? 'Upgrade Now' : `Requires ${tier.minPoints.toLocaleString()} points`}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="comparison-section">
        <h2>Tier Comparison</h2>
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                {tiers.sort((a, b) => a.level - b.level).map(tier => (
                  <th key={tier.id} style={{ color: getTierColor(tier.name) }}>
                    {getTierIcon(tier.name)} {tier.displayName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Minimum Points</td>
                {tiers.sort((a, b) => a.level - b.level).map(tier => (
                  <td key={tier.id}>{tier.minPoints.toLocaleString()}</td>
                ))}
              </tr>
              <tr>
                <td>Points Multiplier</td>
                {tiers.sort((a, b) => a.level - b.level).map(tier => (
                  <td key={tier.id}>{tier.pointsMultiplier}x</td>
                ))}
              </tr>
              <tr>
                <td>Discount</td>
                {tiers.sort((a, b) => a.level - b.level).map(tier => (
                  <td key={tier.id}>{tier.discountPercentage}%</td>
                ))}
              </tr>
              <tr>
                <td>Monthly Price</td>
                {tiers.sort((a, b) => a.level - b.level).map(tier => (
                  <td key={tier.id}>{tier.monthlyPrice ? `$${tier.monthlyPrice}` : 'Free'}</td>
                ))}
              </tr>
              <tr>
                <td>Yearly Price</td>
                {tiers.sort((a, b) => a.level - b.level).map(tier => (
                  <td key={tier.id}>{tier.yearlyPrice ? `$${tier.yearlyPrice}` : 'Free'}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>How do I upgrade my tier?</h4>
            <p>Earn points by engaging with the platform. Once you reach the minimum points for a tier, you can upgrade instantly!</p>
          </div>
          <div className="faq-item">
            <h4>What happens to my points when I upgrade?</h4>
            <p>Your points remain the same! Upgrading tiers unlocks additional benefits and multipliers for future points earning.</p>
          </div>
          <div className="faq-item">
            <h4>Can I downgrade my tier?</h4>
            <p>Tiers are based on your total points earned. As long as you maintain the minimum points, you'll keep your tier.</p>
          </div>
          <div className="faq-item">
            <h4>Do tiers expire?</h4>
            <p>No! Once you reach a tier, it's yours to keep as long as you maintain the minimum points requirement.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipTiers;

