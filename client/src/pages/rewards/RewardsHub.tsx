import React, { useState, useEffect } from 'react';
import './RewardsHub.css';

interface PointsBalance {
  totalPoints: number;
  availablePoints: number;
  usedPoints: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  membershipTier: string;
}

interface Transaction {
  id: number;
  type: string;
  category: string;
  activity: string;
  points: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

interface Reward {
  id: number;
  name: string;
  description: string;
  category: string;
  pointsCost: number;
  rewardType: string;
  rewardValue: string;
  stock: number | null;
  image: string;
  isActive: boolean;
}

interface EarningRule {
  id: number;
  category: string;
  activity: string;
  points: number;
  maxPerDay: number | null;
  description: string;
}

const RewardsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pointsBalance, setPointsBalance] = useState<PointsBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [earningRules, setEarningRules] = useState<EarningRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPointsData();
  }, []);

  const fetchPointsData = async () => {
    try {
      setLoading(true);
      
      // Fetch points balance
      const balanceRes = await fetch('/api/points');
      const balanceData = await balanceRes.json();
      setPointsBalance(balanceData);

      // Fetch transactions
      const transactionsRes = await fetch('/api/points/transactions?limit=50');
      const transactionsData = await transactionsRes.json();
      setTransactions(transactionsData.transactions || []);

      // Fetch rewards catalog
      const rewardsRes = await fetch('/api/rewards/catalog');
      const rewardsData = await rewardsRes.json();
      setRewards(rewardsData || []);

      // Fetch earning rules
      const rulesRes = await fetch('/api/points/rules');
      const rulesData = await rulesRes.json();
      setEarningRules(rulesData || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching points data:', error);
      setLoading(false);
    }
  };

  const handleRedeemReward = async (rewardId: number, pointsCost: number) => {
    if (!pointsBalance || pointsBalance.availablePoints < pointsCost) {
      alert('Insufficient points!');
      return;
    }

    try {
      const res = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId }),
      });

      if (res.ok) {
        alert('Reward redeemed successfully!');
        fetchPointsData();
      } else {
        alert('Failed to redeem reward');
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert('Error redeeming reward');
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      case 'platinum': return '#E5E4E2';
      default: return '#CD7F32';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'platinum': return '💎';
      default: return '🥉';
    }
  };

  if (loading) {
    return (
      <div className="rewards-hub">
        <div className="loading">Loading rewards data...</div>
      </div>
    );
  }

  return (
    <div className="rewards-hub">
      <div className="rewards-header">
        <h1>🎁 Points & Rewards Hub</h1>
        <p>Earn points for activities and redeem amazing rewards!</p>
      </div>

      {/* Points Balance Card */}
      <div className="points-balance-card" style={{ borderColor: getTierColor(pointsBalance?.membershipTier || 'bronze') }}>
        <div className="balance-header">
          <div className="tier-badge" style={{ backgroundColor: getTierColor(pointsBalance?.membershipTier || 'bronze') }}>
            <span className="tier-icon">{getTierIcon(pointsBalance?.membershipTier || 'bronze')}</span>
            <span className="tier-name">{pointsBalance?.membershipTier?.toUpperCase()}</span>
          </div>
          <div className="available-points">
            <span className="points-label">Available Points</span>
            <span className="points-value">{pointsBalance?.availablePoints?.toLocaleString() || 0}</span>
          </div>
        </div>
        
        <div className="balance-stats">
          <div className="stat">
            <span className="stat-label">Total Earned</span>
            <span className="stat-value">{pointsBalance?.lifetimeEarned?.toLocaleString() || 0}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Spent</span>
            <span className="stat-value">{pointsBalance?.lifetimeSpent?.toLocaleString() || 0}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Points</span>
            <span className="stat-value">{pointsBalance?.totalPoints?.toLocaleString() || 0}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="rewards-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab ${activeTab === 'earn' ? 'active' : ''}`}
          onClick={() => setActiveTab('earn')}
        >
          💰 Earn Points
        </button>
        <button 
          className={`tab ${activeTab === 'redeem' ? 'active' : ''}`}
          onClick={() => setActiveTab('redeem')}
        >
          🎁 Redeem Rewards
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📜 History
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <h2>Welcome to Rewards Hub!</h2>
            <p>Earn points by engaging with the platform and redeem them for exclusive rewards.</p>
            
            <div className="quick-stats">
              <div className="quick-stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <div className="stat-title">Your Tier</div>
                  <div className="stat-number">{pointsBalance?.membershipTier?.toUpperCase()}</div>
                </div>
              </div>
              <div className="quick-stat-card">
                <div className="stat-icon">💎</div>
                <div className="stat-info">
                  <div className="stat-title">Available Points</div>
                  <div className="stat-number">{pointsBalance?.availablePoints?.toLocaleString()}</div>
                </div>
              </div>
              <div className="quick-stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <div className="stat-title">Lifetime Earned</div>
                  <div className="stat-number">{pointsBalance?.lifetimeEarned?.toLocaleString()}</div>
                </div>
              </div>
              <div className="quick-stat-card">
                <div className="stat-icon">🛍️</div>
                <div className="stat-info">
                  <div className="stat-title">Lifetime Spent</div>
                  <div className="stat-number">{pointsBalance?.lifetimeSpent?.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="how-it-works">
              <h3>How It Works</h3>
              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Earn Points</h4>
                    <p>Complete activities like posting, commenting, purchasing, learning, and trading</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Accumulate Points</h4>
                    <p>Watch your points balance grow as you engage with the platform</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Redeem Rewards</h4>
                    <p>Use your points to get discounts, products, features, and more!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'earn' && (
          <div className="earn-tab">
            <h2>Ways to Earn Points</h2>
            <p>Complete these activities to earn points and level up your membership tier!</p>
            
            <div className="earning-rules">
              {earningRules.length > 0 ? (
                earningRules.map((rule) => (
                  <div key={rule.id} className="earning-rule-card">
                    <div className="rule-icon">
                      {rule.category === 'social' && '👥'}
                      {rule.category === 'commerce' && '🛒'}
                      {rule.category === 'learning' && '🎓'}
                      {rule.category === 'trading' && '📈'}
                      {rule.category === 'content' && '✍️'}
                    </div>
                    <div className="rule-details">
                      <h4>{rule.activity}</h4>
                      <p>{rule.description || `Earn points by ${rule.activity}`}</p>
                      {rule.maxPerDay && <span className="rule-limit">Max {rule.maxPerDay}/day</span>}
                    </div>
                    <div className="rule-points">
                      +{rule.points} pts
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-rules">
                  <p>No earning rules available yet. Check back soon!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'redeem' && (
          <div className="redeem-tab">
            <h2>Redeem Your Points</h2>
            <p>Choose from our catalog of exclusive rewards!</p>
            
            <div className="rewards-catalog">
              {rewards.length > 0 ? (
                rewards.filter(r => r.isActive).map((reward) => (
                  <div key={reward.id} className="reward-card">
                    <div className="reward-image">
                      {reward.image ? (
                        <img src={reward.image} alt={reward.name} />
                      ) : (
                        <div className="reward-placeholder">
                          {reward.category === 'discount' && '💸'}
                          {reward.category === 'product' && '📦'}
                          {reward.category === 'feature' && '⚡'}
                          {reward.category === 'voucher' && '🎟️'}
                        </div>
                      )}
                    </div>
                    <div className="reward-details">
                      <h4>{reward.name}</h4>
                      <p>{reward.description}</p>
                      <div className="reward-footer">
                        <div className="reward-cost">
                          <span className="cost-label">Cost:</span>
                          <span className="cost-value">{reward.pointsCost.toLocaleString()} pts</span>
                        </div>
                        <button 
                          className="redeem-btn"
                          onClick={() => handleRedeemReward(reward.id, reward.pointsCost)}
                          disabled={!pointsBalance || pointsBalance.availablePoints < reward.pointsCost}
                        >
                          {pointsBalance && pointsBalance.availablePoints >= reward.pointsCost ? 'Redeem' : 'Insufficient Points'}
                        </button>
                      </div>
                      {reward.stock !== null && (
                        <div className="reward-stock">
                          {reward.stock > 0 ? `${reward.stock} left` : 'Out of stock'}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-rewards">
                  <p>No rewards available yet. Check back soon!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-tab">
            <h2>Transaction History</h2>
            <p>View all your points earning and spending activities</p>
            
            <div className="transactions-list">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                    <div className="transaction-icon">
                      {transaction.type === 'earn' ? '💰' : '🛍️'}
                    </div>
                    <div className="transaction-details">
                      <h4>{transaction.activity}</h4>
                      <p>{transaction.description}</p>
                      <span className="transaction-date">
                        {new Date(transaction.createdAt).toLocaleDateString()} at {new Date(transaction.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className={`transaction-points ${transaction.type}`}>
                      {transaction.points > 0 ? '+' : ''}{transaction.points.toLocaleString()} pts
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-transactions">
                  <p>No transactions yet. Start earning points by engaging with the platform!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsHub;

