import React, { useState, useEffect } from 'react';
import './StakingHub.css';

interface StakingPool {
  id: number;
  name: string;
  duration: number; // days
  apy: string; // annual percentage yield
  minStake: number;
  maxStake: number | null;
  totalStaked: number;
  participants: number;
  description: string;
}

interface UserStake {
  id: number;
  stakedPoints: number;
  stakingPeriod: number;
  apy: string;
  stakedAt: string;
  unlocksAt: string;
  estimatedReward: number;
  status: string;
}

interface PointsBalance {
  availablePoints: number;
  totalPoints: number;
}

const StakingHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stake');
  const [stakingPools, setStakingPools] = useState<StakingPool[]>([]);
  const [userStakes, setUserStakes] = useState<UserStake[]>([]);
  const [pointsBalance, setPointsBalance] = useState<PointsBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch staking pools
      const poolsRes = await fetch('/api/staking/pools');
      const poolsData = await poolsRes.json();
      setStakingPools(poolsData || []);

      // Fetch user stakes
      const stakesRes = await fetch('/api/staking/my-stakes');
      const stakesData = await stakesRes.json();
      setUserStakes(stakesData || []);

      // Fetch points balance
      const pointsRes = await fetch('/api/points');
      const pointsData = await pointsRes.json();
      setPointsBalance({
        availablePoints: pointsData.availablePoints,
        totalPoints: pointsData.totalPoints,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching staking data:', error);
      setLoading(false);
    }
  };

  const calculateReward = (amount: number, apy: string, days: number) => {
    const apyNum = parseFloat(apy);
    const yearlyReward = (amount * apyNum) / 100;
    const dailyReward = yearlyReward / 365;
    return Math.floor(dailyReward * days);
  };

  const handleStake = async (poolId: number) => {
    const amount = parseInt(stakeAmount);
    
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!pointsBalance || amount > pointsBalance.availablePoints) {
      alert('Insufficient points');
      return;
    }

    const pool = stakingPools.find(p => p.id === poolId);
    if (!pool) return;

    if (amount < pool.minStake) {
      alert(`Minimum stake is ${pool.minStake.toLocaleString()} points`);
      return;
    }

    if (pool.maxStake && amount > pool.maxStake) {
      alert(`Maximum stake is ${pool.maxStake.toLocaleString()} points`);
      return;
    }

    try {
      const res = await fetch('/api/staking/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poolId,
          amount,
        }),
      });

      if (res.ok) {
        alert('Points staked successfully!');
        setStakeAmount('');
        setSelectedPool(null);
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to stake points');
      }
    } catch (error) {
      console.error('Error staking points:', error);
      alert('Error staking points');
    }
  };

  const handleUnstake = async (stakeId: number) => {
    const stake = userStakes.find(s => s.id === stakeId);
    if (!stake) return;

    const now = new Date();
    const unlocksAt = new Date(stake.unlocksAt);

    if (now < unlocksAt) {
      const daysLeft = Math.ceil((unlocksAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (!confirm(`Early unstaking will forfeit rewards. ${daysLeft} days remaining. Continue?`)) {
        return;
      }
    }

    try {
      const res = await fetch(`/api/staking/unstake/${stakeId}`, {
        method: 'POST',
      });

      if (res.ok) {
        alert('Points unstaked successfully!');
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to unstake points');
      }
    } catch (error) {
      console.error('Error unstaking points:', error);
      alert('Error unstaking points');
    }
  };

  const getTimeRemaining = (unlocksAt: string) => {
    const now = new Date();
    const unlock = new Date(unlocksAt);
    const diff = unlock.getTime() - now.getTime();

    if (diff <= 0) return 'Unlocked';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days}d ${hours}h`;
  };

  if (loading) {
    return (
      <div className="staking-hub">
        <div className="loading">Loading staking data...</div>
      </div>
    );
  }

  return (
    <div className="staking-hub">
      <div className="staking-header">
        <h1>💎 Staking Hub</h1>
        <p>Stake your points and earn passive rewards!</p>
        
        {pointsBalance && (
          <div className="balance-card">
            <div className="balance-item">
              <span className="balance-label">Available to Stake</span>
              <span className="balance-value">{pointsBalance.availablePoints.toLocaleString()} pts</span>
            </div>
            <div className="balance-item">
              <span className="balance-label">Total Staked</span>
              <span className="balance-value">
                {userStakes
                  .filter(s => s.status === 'active')
                  .reduce((sum, s) => sum + s.stakedPoints, 0)
                  .toLocaleString()} pts
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="staking-tabs">
        <button 
          className={`tab ${activeTab === 'stake' ? 'active' : ''}`}
          onClick={() => setActiveTab('stake')}
        >
          💰 Stake Points
        </button>
        <button 
          className={`tab ${activeTab === 'my-stakes' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-stakes')}
        >
          📊 My Stakes
        </button>
        <button 
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          ℹ️ How It Works
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'stake' && (
          <div className="stake-tab">
            <h2>Staking Pools</h2>
            <p>Choose a pool and stake your points to earn rewards</p>

            <div className="pools-grid">
              {stakingPools.map((pool) => (
                <div key={pool.id} className="pool-card">
                  <div className="pool-header">
                    <h3>{pool.name}</h3>
                    <div className="pool-apy">{pool.apy}% APY</div>
                  </div>

                  <div className="pool-details">
                    <div className="pool-detail">
                      <span className="detail-label">Duration:</span>
                      <span className="detail-value">{pool.duration} days</span>
                    </div>
                    <div className="pool-detail">
                      <span className="detail-label">Min Stake:</span>
                      <span className="detail-value">{pool.minStake.toLocaleString()} pts</span>
                    </div>
                    {pool.maxStake && (
                      <div className="pool-detail">
                        <span className="detail-label">Max Stake:</span>
                        <span className="detail-value">{pool.maxStake.toLocaleString()} pts</span>
                      </div>
                    )}
                    <div className="pool-detail">
                      <span className="detail-label">Total Staked:</span>
                      <span className="detail-value">{pool.totalStaked.toLocaleString()} pts</span>
                    </div>
                    <div className="pool-detail">
                      <span className="detail-label">Participants:</span>
                      <span className="detail-value">{pool.participants}</span>
                    </div>
                  </div>

                  <p className="pool-description">{pool.description}</p>

                  {selectedPool === pool.id ? (
                    <div className="stake-form">
                      <input
                        type="number"
                        placeholder="Amount to stake"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="stake-input"
                      />
                      {stakeAmount && (
                        <div className="reward-preview">
                          Estimated reward: {calculateReward(parseInt(stakeAmount), pool.apy, pool.duration).toLocaleString()} pts
                        </div>
                      )}
                      <div className="stake-actions">
                        <button 
                          className="stake-btn"
                          onClick={() => handleStake(pool.id)}
                        >
                          Confirm Stake
                        </button>
                        <button 
                          className="cancel-btn"
                          onClick={() => {
                            setSelectedPool(null);
                            setStakeAmount('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      className="select-pool-btn"
                      onClick={() => setSelectedPool(pool.id)}
                    >
                      Select Pool
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'my-stakes' && (
          <div className="my-stakes-tab">
            <h2>My Active Stakes</h2>
            <p>Track your staked points and rewards</p>

            {userStakes.length > 0 ? (
              <div className="stakes-list">
                {userStakes.map((stake) => (
                  <div key={stake.id} className={`stake-item ${stake.status}`}>
                    <div className="stake-info">
                      <div className="stake-amount">
                        <span className="amount-label">Staked Amount</span>
                        <span className="amount-value">{stake.stakedPoints.toLocaleString()} pts</span>
                      </div>
                      <div className="stake-details-grid">
                        <div className="stake-detail">
                          <span className="detail-label">APY:</span>
                          <span className="detail-value">{stake.apy}%</span>
                        </div>
                        <div className="stake-detail">
                          <span className="detail-label">Duration:</span>
                          <span className="detail-value">{stake.stakingPeriod} days</span>
                        </div>
                        <div className="stake-detail">
                          <span className="detail-label">Staked:</span>
                          <span className="detail-value">{new Date(stake.stakedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="stake-detail">
                          <span className="detail-label">Unlocks:</span>
                          <span className="detail-value">{getTimeRemaining(stake.unlocksAt)}</span>
                        </div>
                      </div>
                      <div className="stake-reward">
                        <span className="reward-label">Estimated Reward:</span>
                        <span className="reward-value">{stake.estimatedReward.toLocaleString()} pts</span>
                      </div>
                    </div>
                    <div className="stake-actions">
                      <button 
                        className="unstake-btn"
                        onClick={() => handleUnstake(stake.id)}
                      >
                        {new Date() >= new Date(stake.unlocksAt) ? 'Claim Rewards' : 'Unstake Early'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-stakes">
                <p>You haven't staked any points yet. Start staking to earn passive rewards!</p>
                <button 
                  className="start-staking-btn"
                  onClick={() => setActiveTab('stake')}
                >
                  Start Staking
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="info-tab">
            <h2>How Staking Works</h2>
            
            <div className="info-sections">
              <div className="info-section">
                <h3>🔒 What is Staking?</h3>
                <p>Staking allows you to lock your points for a specific period and earn rewards based on the Annual Percentage Yield (APY) of the pool you choose.</p>
              </div>

              <div className="info-section">
                <h3>💰 How Do I Earn?</h3>
                <p>Your rewards are calculated based on the amount you stake, the APY of the pool, and the duration of the stake. The longer you stake, the more you earn!</p>
              </div>

              <div className="info-section">
                <h3>⏰ Lock Periods</h3>
                <p>Different pools have different lock periods (7, 30, 90, 180 days). You can unstake early, but you'll forfeit your rewards.</p>
              </div>

              <div className="info-section">
                <h3>🎯 Choosing a Pool</h3>
                <p>Higher APY pools typically have longer lock periods. Choose a pool that matches your goals and timeline.</p>
              </div>

              <div className="info-section">
                <h3>✅ Benefits</h3>
                <ul>
                  <li>Earn passive rewards on your points</li>
                  <li>Flexible pool options</li>
                  <li>Compound your earnings</li>
                  <li>No fees or hidden costs</li>
                </ul>
              </div>

              <div className="info-section">
                <h3>⚠️ Important Notes</h3>
                <ul>
                  <li>Staked points are locked until the unlock date</li>
                  <li>Early unstaking forfeits all rewards</li>
                  <li>Rewards are added when you claim after unlock</li>
                  <li>You can have multiple active stakes</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StakingHub;

