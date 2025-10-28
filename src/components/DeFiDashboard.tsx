import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FiFilter, FiRefreshCw, FiArrowUpRight, FiArrowDownLeft, FiZap, FiTarget, FiDollarSign, FiBarChart2 } from 'react-icons/fi';

// =================================================================
// 1. TYPE DEFINITIONS & INTERFACES
// =================================================================

/**
 * @interface Token
 * @description Defines the structure for a cryptocurrency token.
 */
interface Token {
  symbol: string;
  name: string;
  priceUsd: number;
  logoUrl: string;
}

/**
 * @interface StakingPosition
 * @description Represents a user's current staking position.
 */
interface StakingPosition {
  id: string;
  token: Token;
  stakedAmount: number;
  rewardRate: number; // Annual Percentage Yield (APY)
  earnedRewards: number;
  lockUntil?: number; // Unix timestamp
}

/**
 * @interface LiquidityPool
 * @description Represents a user's liquidity pool position (LP).
 */
interface LiquidityPool {
  id: string;
  tokenA: Token;
  tokenB: Token;
  userLpTokens: number;
  totalLpTokens: number;
  apr: number; // Annual Percentage Rate
  userShare: number; // Percentage
  feesEarned: number;
}

/**
 * @interface YieldFarm
 * @description Represents a user's position in a yield farming contract.
 */
interface YieldFarm {
  id: string;
  lpToken: string; // The LP token being farmed
  farmName: string;
  stakedLpAmount: number;
  apy: number;
  rewardToken: Token;
  pendingRewards: number;
}

/**
 * @interface PortfolioSummary
 * @description Summary statistics for the entire DeFi portfolio.
 */
interface PortfolioSummary {
  totalValueUsd: number;
  dailyChangeUsd: number;
  dailyChangePercent: number;
  totalRewardsClaimable: number;
}

/**
 * @interface FilterOptions
 * @description State for filtering and sorting the dashboard data.
 */
interface FilterOptions {
  sortBy: 'value' | 'apy' | 'name';
  direction: 'asc' | 'desc';
  activeSection: 'all' | 'staking' | 'liquidity' | 'farming';
}

// =================================================================
// 2. SAMPLE DATA (Simulating API Fetch)
// =================================================================

const SAMPLE_TOKENS: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', priceUsd: 3500.00, logoUrl: 'eth.svg' },
  { symbol: 'USDC', name: 'USD Coin', priceUsd: 1.00, logoUrl: 'usdc.svg' },
  { symbol: 'AETH', name: 'Aetherial Token', priceUsd: 12.50, logoUrl: 'aeth.svg' }, // AETHERIAL Token
  { symbol: 'DAI', name: 'Dai Stablecoin', priceUsd: 1.00, logoUrl: 'dai.svg' },
];

const SAMPLE_STAKING: StakingPosition[] = [
  {
    id: 's-1',
    token: SAMPLE_TOKENS[0],
    stakedAmount: 5.2,
    rewardRate: 0.045, // 4.5% APY
    earnedRewards: 0.15,
    lockUntil: Date.now() / 1000 + 86400 * 30, // Locked for 30 days
  },
  {
    id: 's-2',
    token: SAMPLE_TOKENS[2],
    stakedAmount: 1500,
    rewardRate: 0.08, // 8.0% APY - AETHERIAL unique enhancement
    earnedRewards: 55.2,
  },
];

const SAMPLE_LIQUIDITY: LiquidityPool[] = [
  {
    id: 'lp-1',
    tokenA: SAMPLE_TOKENS[1],
    tokenB: SAMPLE_TOKENS[3],
    userLpTokens: 1000,
    totalLpTokens: 50000,
    apr: 0.012, // 1.2% APR
    userShare: 2.0,
    feesEarned: 15.75,
  },
];

const SAMPLE_FARMING: YieldFarm[] = [
  {
    id: 'f-1',
    lpToken: 'ETH-USDC LP',
    farmName: 'Aetherial High-Yield Farm', // AETHERIAL unique enhancement
    stakedLpAmount: 50,
    apy: 0.25, // 25% APY
    rewardToken: SAMPLE_TOKENS[2],
    pendingRewards: 12.5,
  },
];

const calculatePortfolioSummary = (staking: StakingPosition[], liquidity: LiquidityPool[], farming: YieldFarm[]): PortfolioSummary => {
  let totalValue = 0;
  let totalRewards = 0;

  // Staking value
  staking.forEach(s => {
    totalValue += s.stakedAmount * s.token.priceUsd;
    totalRewards += s.earnedRewards * s.token.priceUsd;
  });

  // Liquidity value (simplified: assume 50/50 split and only account for user's share of LP tokens)
  liquidity.forEach(lp => {
    const tokenAValue = lp.tokenA.priceUsd * 1000; // Placeholder for token value in pool
    const tokenBValue = lp.tokenB.priceUsd * 1000; // Placeholder for token value in pool
    const poolValue = (tokenAValue + tokenBValue) * (lp.userLpTokens / lp.totalLpTokens);
    totalValue += poolValue;
    totalRewards += lp.feesEarned;
  });

  // Farming value (simplified: value of staked LP tokens)
  farming.forEach(f => {
    // In a real app, we'd calculate the underlying value of the LP token
    // For sample data, we'll use a placeholder value
    totalValue += f.stakedLpAmount * 200; // Assume LP token value is $200
    totalRewards += f.pendingRewards * f.rewardToken.priceUsd;
  });

  return {
    totalValueUsd: parseFloat(totalValue.toFixed(2)),
    dailyChangeUsd: 152.34, // Sample change
    dailyChangePercent: 2.15, // Sample percentage
    totalRewardsClaimable: parseFloat(totalRewards.toFixed(2)),
  };
};

// =================================================================
// 3. HELPER COMPONENTS (Styling Abstraction - BuddyBoss/AETHERIAL Style)
// =================================================================

/**
 * @component Card
 * @description Abstracted component for a dashboard card, similar to BuddyBoss group/activity cards.
 * Implements responsive design with a shadow and padding.
 */
const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 transition-all duration-300 hover:shadow-2xl">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
      {title}
    </h3>
    {children}
  </div>
);

/**
 * @component StatBox
 * @description Abstracted component for displaying a key statistic.
 */
const StatBox: React.FC<{ label: string; value: string; icon: React.ReactNode; isPositive?: boolean }> = ({ label, value, icon, isPositive }) => (
  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <div className={`p-3 rounded-full ${isPositive === true ? 'bg-green-100 text-green-600' : isPositive === false ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'} dark:bg-opacity-20`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

// =================================================================
// 4. MAIN COMPONENT
// =================================================================

/**
 * @component DeFiDashboard
 * @description The main component for the DeFi Dashboard Page, displaying staking,
 * liquidity pools, yield farming, and portfolio summary.
 */
const DeFiDashboard: React.FC = () => {
  // 2. State management with useState/useEffect
  const [stakingData, setStakingData] = useState<StakingPosition[]>([]);
  const [liquidityData, setLiquidityData] = useState<LiquidityPool[]>([]);
  const [farmingData, setFarmingData] = useState<YieldFarm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sortBy: 'value',
    direction: 'desc',
    activeSection: 'all',
  });

  /**
   * @function fetchData
   * @description Simulates fetching data from a DeFi API endpoint.
   */
  const fetchData = useCallback(() => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setStakingData(SAMPLE_STAKING);
      setLiquidityData(SAMPLE_LIQUIDITY);
      setFarmingData(SAMPLE_FARMING);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derived state for portfolio summary
  const portfolioSummary = useMemo(() => {
    return calculatePortfolioSummary(stakingData, liquidityData, farmingData);
  }, [stakingData, liquidityData, farmingData]);

  /**
   * @function handleFilterChange
   * @description Handles changes to the filter and sort options.
   */
  const handleFilterChange = (key: keyof FilterOptions, value: FilterOptions[keyof FilterOptions]) => {
    setFilterOptions(prev => ({ ...prev, [key]: value }));
  };

  /**
   * @function sortAndFilterData
   * @description Applies sorting and filtering to the combined data.
   */
  const sortAndFilterData = (data: (StakingPosition | LiquidityPool | YieldFarm)[]) => {
    // 4. Interactive features: Filtering by section
    const filtered = data.filter(item => {
      if (filterOptions.activeSection === 'all') return true;
      if (filterOptions.activeSection === 'staking' && 'stakedAmount' in item) return true;
      if (filterOptions.activeSection === 'liquidity' && 'userLpTokens' in item) return true;
      if (filterOptions.activeSection === 'farming' && 'stakedLpAmount' in item) return true;
      return false;
    });

    // 4. Interactive features: Sorting
    return filtered.sort((a, b) => {
      let aValue: number = 0;
      let bValue: number = 0;

      // Simplified value calculation for sorting
      if ('stakedAmount' in a) aValue = a.stakedAmount * a.token.priceUsd;
      if ('userLpTokens' in a) aValue = a.userLpTokens * 2; // Placeholder LP value
      if ('stakedLpAmount' in a) aValue = a.stakedLpAmount * 200; // Placeholder Farm value

      if ('stakedAmount' in b) bValue = b.stakedAmount * b.token.priceUsd;
      if ('userLpTokens' in b) bValue = b.userLpTokens * 2;
      if ('stakedLpAmount' in b) bValue = b.stakedLpAmount * 200;

      if (filterOptions.sortBy === 'value') {
        return filterOptions.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Add APY/APR sorting logic here for 'apy'
      if (filterOptions.sortBy === 'apy') {
        let aRate = 'rewardRate' in a ? a.rewardRate : 'apr' in a ? a.apr : 'apy' in a ? a.apy : 0;
        let bRate = 'rewardRate' in b ? b.rewardRate : 'apr' in b ? b.apr : 'apy' in b ? b.apy : 0;
        return filterOptions.direction === 'asc' ? aRate - bRate : bRate - aRate;
      }

      // 'name' sorting is left as an exercise, as types are mixed
      return 0;
    });
  };

  const combinedData = [...stakingData, ...liquidityData, ...farmingData];
  const sortedAndFilteredData = sortAndFilterData(combinedData);

  const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatPercent = (rate: number) => `${(rate * 100).toFixed(2)}%`;

  // 5. Responsive design considerations: using flex and grid for different screen sizes
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
        AETHERIAL DeFi Dashboard
      </h1>

      {/* Portfolio Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatBox
          label="Total Portfolio Value"
          value={formatCurrency(portfolioSummary.totalValueUsd)}
          icon={<FiDollarSign className="w-6 h-6" />}
        />
        <StatBox
          label="24h Change"
          value={`${formatCurrency(portfolioSummary.dailyChangeUsd)} (${portfolioSummary.dailyChangePercent.toFixed(2)}%)`}
          icon={portfolioSummary.dailyChangePercent >= 0 ? <FiArrowUpRight className="w-6 h-6" /> : <FiArrowDownLeft className="w-6 h-6" />}
          isPositive={portfolioSummary.dailyChangePercent >= 0}
        />
        <StatBox
          label="Claimable Rewards"
          value={formatCurrency(portfolioSummary.totalRewardsClaimable)}
          icon={<FiZap className="w-6 h-6" />}
        />
        <StatBox
          label="AI-Optimized APY" // AETHERIAL unique enhancement: AI-driven optimization
          value={formatPercent(0.18)}
          icon={<FiTarget className="w-6 h-6" />}
        />
      </div>

      {/* Controls and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6">
        {/* Section Filter Buttons */}
        <div className="flex space-x-2 mb-4 sm:mb-0">
          {(['all', 'staking', 'liquidity', 'farming'] as FilterOptions['activeSection'][]).map(section => (
            <button
              key={section}
              onClick={() => handleFilterChange('activeSection', section)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                filterOptions.activeSection === section
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Sort and Refresh */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterOptions.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterOptions['sortBy'])}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="value">Sort by Value</option>
              <option value="apy">Sort by APY/APR</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>

          <button
            onClick={() => handleFilterChange('direction', filterOptions.direction === 'asc' ? 'desc' : 'asc')}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            title={`Sort ${filterOptions.direction === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <FiBarChart2 className={`w-5 h-5 transform ${filterOptions.direction === 'asc' ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
            title="Refresh Data"
          >
            <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Data Table/Grid */}
      {loading ? (
        <div className="text-center p-10 text-gray-500 dark:text-gray-400">
          <FiRefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" />
          <p>Loading DeFi positions...</p>
        </div>
      ) : sortedAndFilteredData.length === 0 ? (
        <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-gray-500 dark:text-gray-400">
          <p>No active positions found in this section.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedAndFilteredData.map((item, index) => {
            // Determine the type of the item for specific rendering
            const isStaking = 'stakedAmount' in item && 'token' in item;
            const isLiquidity = 'userLpTokens' in item;
            const isFarming = 'stakedLpAmount' in item;

            return (
              <Card
                key={item.id}
                title={isStaking ? `Staking: ${item.token.symbol}` : isLiquidity ? `LP: ${item.tokenA.symbol}/${item.tokenB.symbol}` : item.farmName}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {isStaking && (
                    <>
                      <div><p className="text-gray-500 dark:text-gray-400">Staked Amount</p><p className="font-bold">{item.stakedAmount.toFixed(4)} {item.token.symbol}</p></div>
                      <div><p className="text-gray-500 dark:text-gray-400">APY</p><p className="font-bold text-green-500">{formatPercent(item.rewardRate)}</p></div>
                      <div><p className="text-gray-500 dark:text-gray-400">Earned Rewards</p><p className="font-bold">{item.earnedRewards.toFixed(4)} {item.token.symbol}</p></div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Value (USD)</p>
                        <p className="font-bold">{formatCurrency(item.stakedAmount * item.token.priceUsd)}</p>
                      </div>
                    </>
                  )}
                  {isLiquidity && (
                    <>
                      <div><p className="text-gray-500 dark:text-gray-400">LP Tokens</p><p className="font-bold">{item.userLpTokens.toFixed(2)}</p></div>
                      <div><p className="text-gray-500 dark:text-gray-400">APR</p><p className="font-bold text-green-500">{formatPercent(item.apr)}</p></div>
                      <div><p className="text-gray-500 dark:text-gray-400">Fees Earned</p><p className="font-bold">{formatCurrency(item.feesEarned)}</p></div>
                      <div><p className="text-gray-500 dark:text-gray-400">Pool Share</p><p className="font-bold">{item.userShare.toFixed(2)}%</p></div>
                    </>
                  )}
                  {isFarming && (
                    <>
                      <div><p className="text-gray-500 dark:text-gray-400">Staked LP</p><p className="font-bold">{item.stakedLpAmount.toFixed(2)} {item.lpToken}</p></div>
                      <div><p className="text-gray-500 dark:text-gray-400">APY</p><p className="font-bold text-green-500">{formatPercent(item.apy)}</p></div>
                      <div><p className="text-gray-500 dark:text-gray-400">Pending Rewards</p><p className="font-bold">{item.pendingRewards.toFixed(4)} {item.rewardToken.symbol}</p></div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Farm Value (USD)</p>
                        <p className="font-bold">{formatCurrency(item.stakedLpAmount * 200)}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Interactive Action Buttons (BuddyBoss-style actions) */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                    {isStaking ? 'Claim Rewards' : isLiquidity ? 'Remove Liquidity' : 'Harvest Rewards'}
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                    {isStaking ? 'Unstake' : isLiquidity ? 'Add Liquidity' : 'Stake More'}
                  </button>
                  {/* AETHERIAL unique enhancement: AI Optimization Button */}
                  <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200">
                    AI Optimize
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Footer/Disclaimer - BuddyBoss abstraction for community/disclaimer area */}
      <div className="mt-10 pt-6 border-t border-gray-300 dark:border-gray-700 text-center text-xs text-gray-500 dark:text-gray-400">
        <p>
          DeFi is volatile and carries risk. The AETHERIAL Dashboard provides data for informational purposes only.
          AI Optimization is an experimental feature and does not guarantee returns.
        </p>
      </div>
    </div>
  );
};

// 7. Export default at the end
export default DeFiDashboard;