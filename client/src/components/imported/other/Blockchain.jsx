import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, TrendingDown, BarChart3, PieChart, LineChart, 
  Wallet, CreditCard, Send, Receive, Swap, Plus, Minus,
  Star, StarOff, Eye, EyeOff, Copy, ExternalLink, Settings,
  Zap, Shield, Lock, Unlock, Clock, Activity, Award,
  Bitcoin, Ethereum, DollarSign, Euro, Yen, PoundSterling
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const Blockchain = ({ user }) => {
  const [activeTab, setActiveTab] = useState('portfolio')
  const [selectedCrypto, setSelectedCrypto] = useState('BTC')
  const [chartPeriod, setChartPeriod] = useState('24h')
  const [portfolioValue, setPortfolioValue] = useState(12450.67)
  const [showBalance, setShowBalance] = useState(true)

  const tabs = [
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'trading', label: 'Trading', icon: TrendingUp },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'staking', label: 'Staking', icon: Award },
    { id: 'defi', label: 'DeFi', icon: Zap },
    { id: 'nft', label: 'NFTs', icon: Star },
  ]

  const cryptoData = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 43250.67,
      change: 2.45,
      volume: '28.5B',
      marketCap: '847B',
      holdings: 0.2847,
      value: 12304.23,
      icon: Bitcoin
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2650.34,
      change: -1.23,
      volume: '15.2B',
      marketCap: '318B',
      holdings: 5.4821,
      value: 14532.87,
      icon: Ethereum
    },
    {
      symbol: 'UBC',
      name: 'Unified Blockchain Coin',
      price: 125.89,
      change: 15.67,
      volume: '2.1B',
      marketCap: '45B',
      holdings: 1250.0,
      value: 157362.50,
      icon: Shield
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      price: 0.4567,
      change: 3.21,
      volume: '890M',
      marketCap: '16B',
      holdings: 2500.0,
      value: 1141.75,
      icon: Star
    }
  ]

  const stakingPools = [
    {
      name: 'UBC Staking Pool',
      apy: 8.5,
      staked: 1000,
      rewards: 85.67,
      lockPeriod: '30 days',
      status: 'active'
    },
    {
      name: 'Ethereum 2.0',
      apy: 5.2,
      staked: 32,
      rewards: 1.664,
      lockPeriod: 'Flexible',
      status: 'active'
    },
    {
      name: 'Cardano Pool',
      apy: 4.8,
      staked: 2500,
      rewards: 120.0,
      lockPeriod: 'No lock',
      status: 'active'
    }
  ]

  const defiProtocols = [
    {
      name: 'Unified Swap',
      tvl: '2.5B',
      apy: 12.4,
      type: 'DEX',
      liquidity: 125000,
      status: 'active'
    },
    {
      name: 'Quantum Lending',
      tvl: '1.8B',
      apy: 8.9,
      type: 'Lending',
      liquidity: 89000,
      status: 'active'
    },
    {
      name: 'Flash Loan Protocol',
      tvl: '950M',
      apy: 15.2,
      type: 'Flash Loans',
      liquidity: 45000,
      status: 'beta'
    }
  ]

  const nftCollections = [
    {
      name: 'Quantum Runestones',
      floor: 2.5,
      volume: '1.2K ETH',
      owned: 3,
      value: 7.5
    },
    {
      name: 'AI Art Genesis',
      floor: 0.8,
      volume: '890 ETH',
      owned: 12,
      value: 9.6
    },
    {
      name: 'Unified Avatars',
      floor: 1.2,
      volume: '2.1K ETH',
      owned: 5,
      value: 6.0
    }
  ]

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioValue(prev => prev + (Math.random() - 0.5) * 100)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercent = (percent) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Blockchain Hub</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Trade, stake, and manage your crypto portfolio
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Portfolio Value</div>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold">
                    {showBalance ? formatCurrency(portfolioValue) : '••••••'}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="text-sm text-green-600">+2.45% (24h)</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {tabs.map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center space-x-2"
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Total Balance</div>
                <div className="text-2xl font-bold">{formatCurrency(portfolioValue)}</div>
                <div className="text-sm text-green-600">+2.45%</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">24h P&L</div>
                <div className="text-2xl font-bold text-green-600">+$304.23</div>
                <div className="text-sm text-green-600">+2.45%</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Total Assets</div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-gray-500">Cryptocurrencies</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Staking Rewards</div>
                <div className="text-2xl font-bold text-blue-600">$207.31</div>
                <div className="text-sm text-blue-600">This month</div>
              </div>
            </div>

            {/* Holdings Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold">Your Holdings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">24h Change</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Holdings</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cryptoData.map((crypto, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
                              <crypto.icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">{crypto.name}</div>
                              <div className="text-sm text-gray-500">{crypto.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{formatCurrency(crypto.price)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center ${crypto.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {crypto.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                            {formatPercent(crypto.change)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{crypto.holdings.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{crypto.symbol}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{formatCurrency(crypto.value)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Send className="w-3 h-3 mr-1" />
                              Send
                            </Button>
                            <Button size="sm" variant="outline">
                              <Swap className="w-3 h-3 mr-1" />
                              Trade
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Trading Tab */}
        {activeTab === 'trading' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trading Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedCrypto}
                    onChange={(e) => setSelectedCrypto(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2"
                  >
                    {cryptoData.map(crypto => (
                      <option key={crypto.symbol} value={crypto.symbol}>
                        {crypto.symbol} - {crypto.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex space-x-2">
                    {['1h', '24h', '7d', '30d', '1y'].map(period => (
                      <Button
                        key={period}
                        variant={chartPeriod === period ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setChartPeriod(period)}
                      >
                        {period}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Chart Placeholder */}
              <div className="h-96 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <LineChart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <div className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                    {selectedCrypto} Price Chart
                  </div>
                  <div className="text-sm text-gray-500">
                    Real-time trading chart for {chartPeriod}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Book & Trading Panel */}
            <div className="space-y-6">
              {/* Quick Trade */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Trade</h3>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Button className="flex-1">Buy</Button>
                    <Button variant="outline" className="flex-1">Sell</Button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                      type="number"
                      placeholder="Market Price"
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    />
                  </div>
                  <Button className="w-full">
                    Place Order
                  </Button>
                </div>
              </div>

              {/* Order Book */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Order Book</h3>
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 grid grid-cols-3 gap-2">
                    <span>Price</span>
                    <span>Size</span>
                    <span>Total</span>
                  </div>
                  {/* Sell Orders */}
                  <div className="space-y-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="text-xs grid grid-cols-3 gap-2 text-red-600">
                        <span>{(43250 + i * 10).toLocaleString()}</span>
                        <span>{(Math.random() * 10).toFixed(4)}</span>
                        <span>{(Math.random() * 100000).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                    <div className="text-center font-semibold">
                      {formatCurrency(43250.67)}
                    </div>
                  </div>
                  {/* Buy Orders */}
                  <div className="space-y-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="text-xs grid grid-cols-3 gap-2 text-green-600">
                        <span>{(43240 - i * 10).toLocaleString()}</span>
                        <span>{(Math.random() * 10).toFixed(4)}</span>
                        <span>{(Math.random() * 100000).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Staking Tab */}
        {activeTab === 'staking' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Staking Pools</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stakingPools.map((pool, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">{pool.name}</h4>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        pool.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {pool.status}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">APY</span>
                        <span className="font-semibold text-green-600">{pool.apy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Staked</span>
                        <span className="font-semibold">{pool.staked.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Rewards</span>
                        <span className="font-semibold text-blue-600">{pool.rewards}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Lock Period</span>
                        <span className="font-semibold">{pool.lockPeriod}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" className="flex-1">Stake More</Button>
                      <Button size="sm" variant="outline" className="flex-1">Claim</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DeFi Tab */}
        {activeTab === 'defi' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">DeFi Protocols</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {defiProtocols.map((protocol, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">{protocol.name}</h4>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        protocol.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {protocol.status}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500">TVL</span>
                        <span className="font-semibold">${protocol.tvl}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">APY</span>
                        <span className="font-semibold text-green-600">{protocol.apy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type</span>
                        <span className="font-semibold">{protocol.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Your Liquidity</span>
                        <span className="font-semibold">${protocol.liquidity.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4">
                      Interact
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blockchain

