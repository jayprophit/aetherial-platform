import React, { useState } from 'react';
import './BlockchainHub.css';

interface NFT {
  id: string;
  name: string;
  image: string;
  collection: string;
  price: number;
  currency: string;
  creator: string;
  owner: string;
  likes: number;
}

interface Token {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  icon: string;
}

const BlockchainHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'nft' | 'defi' | 'dao'>('wallet');
  const [walletConnected, setWalletConnected] = useState(false);

  const tokens: Token[] = [
    { symbol: 'ETH', name: 'Ethereum', balance: 2.5, value: 8642.50, change24h: 3.45, icon: '⟠' },
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.15, value: 10176.80, change24h: 2.18, icon: '₿' },
    { symbol: 'USDT', name: 'Tether', balance: 5000, value: 5000.00, change24h: 0.01, icon: '₮' },
    { symbol: 'AETH', name: 'AETHERIAL Token', balance: 10000, value: 15000.00, change24h: 12.5, icon: '🔷' }
  ];

  const nfts: NFT[] = [
    {
      id: '1',
      name: 'Cosmic Explorer #1234',
      image: '🚀',
      collection: 'Cosmic Explorers',
      price: 2.5,
      currency: 'ETH',
      creator: '0x1234...5678',
      owner: '0xabcd...efgh',
      likes: 234
    },
    {
      id: '2',
      name: 'Digital Dreamscape #567',
      image: '🎨',
      collection: 'Digital Dreamscapes',
      price: 1.8,
      currency: 'ETH',
      creator: '0x9876...5432',
      owner: '0xijkl...mnop',
      likes: 189
    },
    {
      id: '3',
      name: 'Cyber Punk Avatar #890',
      image: '🤖',
      collection: 'Cyber Punk Avatars',
      price: 3.2,
      currency: 'ETH',
      creator: '0x5555...6666',
      owner: '0xqrst...uvwx',
      likes: 456
    },
    {
      id: '4',
      name: 'Metaverse Land #123',
      image: '🏝️',
      collection: 'Metaverse Lands',
      price: 5.0,
      currency: 'ETH',
      creator: '0x7777...8888',
      owner: '0xyzab...cdef',
      likes: 678
    }
  ];

  const totalWalletValue = tokens.reduce((sum, token) => sum + token.value, 0);

  return (
    <div className="blockchain-hub">
      <div className="blockchain-container">
        {/* Header */}
        <div className="blockchain-header">
          <div>
            <h1>Blockchain Hub</h1>
            <p>Your gateway to Web3, DeFi, NFTs, and decentralized applications</p>
          </div>
          {!walletConnected ? (
            <button className="connect-wallet-btn" onClick={() => setWalletConnected(true)}>
              🔗 Connect Wallet
            </button>
          ) : (
            <div className="wallet-info">
              <span className="wallet-badge">🟢 Connected</span>
              <span className="wallet-address">0x1234...5678</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="blockchain-tabs">
          <button
            className={activeTab === 'wallet' ? 'active' : ''}
            onClick={() => setActiveTab('wallet')}
          >
            👛 Wallet
          </button>
          <button
            className={activeTab === 'nft' ? 'active' : ''}
            onClick={() => setActiveTab('nft')}
          >
            🖼️ NFT Marketplace
          </button>
          <button
            className={activeTab === 'defi' ? 'active' : ''}
            onClick={() => setActiveTab('defi')}
          >
            💎 DeFi
          </button>
          <button
            className={activeTab === 'dao' ? 'active' : ''}
            onClick={() => setActiveTab('dao')}
          >
            🏛️ DAO
          </button>
        </div>

        {/* Wallet Tab */}
        {activeTab === 'wallet' && (
          <div className="wallet-content">
            <div className="wallet-summary">
              <div className="summary-card-blockchain">
                <h3>Total Balance</h3>
                <p className="balance-value">${totalWalletValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="summary-card-blockchain">
                <h3>24h Change</h3>
                <p className="balance-value positive">+$1,234.56 (+3.2%)</p>
              </div>
              <div className="summary-card-blockchain">
                <h3>Network</h3>
                <p className="network-info">⟠ Ethereum Mainnet</p>
              </div>
            </div>

            <div className="tokens-list">
              <div className="list-header">
                <h3>Your Assets</h3>
                <button className="add-token-btn">+ Add Token</button>
              </div>
              <div className="tokens-grid">
                {tokens.map((token, idx) => (
                  <div key={idx} className="token-card">
                    <div className="token-icon">{token.icon}</div>
                    <div className="token-info">
                      <div className="token-header">
                        <strong>{token.symbol}</strong>
                        <span className="token-name">{token.name}</span>
                      </div>
                      <div className="token-balance">
                        <span className="balance-amount">{token.balance} {token.symbol}</span>
                        <span className="balance-usd">${token.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className={`token-change ${token.change24h >= 0 ? 'positive' : 'negative'}`}>
                        {token.change24h >= 0 ? '↗' : '↘'} {Math.abs(token.change24h).toFixed(2)}%
                      </div>
                    </div>
                    <div className="token-actions">
                      <button className="action-btn-blockchain">Send</button>
                      <button className="action-btn-blockchain">Receive</button>
                      <button className="action-btn-blockchain">Swap</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="wallet-actions-grid">
              <div className="action-card-blockchain">
                <div className="action-icon-blockchain">📤</div>
                <h4>Send</h4>
                <p>Transfer tokens to any address</p>
              </div>
              <div className="action-card-blockchain">
                <div className="action-icon-blockchain">📥</div>
                <h4>Receive</h4>
                <p>Get your wallet address & QR code</p>
              </div>
              <div className="action-card-blockchain">
                <div className="action-icon-blockchain">🔄</div>
                <h4>Swap</h4>
                <p>Exchange tokens instantly</p>
              </div>
              <div className="action-card-blockchain">
                <div className="action-icon-blockchain">🌉</div>
                <h4>Bridge</h4>
                <p>Transfer assets across chains</p>
              </div>
            </div>
          </div>
        )}

        {/* NFT Marketplace Tab */}
        {activeTab === 'nft' && (
          <div className="nft-content">
            <div className="nft-filters">
              <button className="filter-btn-blockchain active">All</button>
              <button className="filter-btn-blockchain">Art</button>
              <button className="filter-btn-blockchain">Collectibles</button>
              <button className="filter-btn-blockchain">Gaming</button>
              <button className="filter-btn-blockchain">Metaverse</button>
              <button className="filter-btn-blockchain">Music</button>
            </div>

            <div className="nft-grid">
              {nfts.map(nft => (
                <div key={nft.id} className="nft-card">
                  <div className="nft-image">
                    <div className="nft-image-placeholder">{nft.image}</div>
                    <button className="nft-like-btn">❤️ {nft.likes}</button>
                  </div>
                  <div className="nft-details">
                    <span className="nft-collection">{nft.collection}</span>
                    <h4>{nft.name}</h4>
                    <div className="nft-meta">
                      <div className="nft-creator">
                        <span className="meta-label">Creator</span>
                        <span className="meta-value">{nft.creator}</span>
                      </div>
                      <div className="nft-owner">
                        <span className="meta-label">Owner</span>
                        <span className="meta-value">{nft.owner}</span>
                      </div>
                    </div>
                    <div className="nft-footer">
                      <div className="nft-price">
                        <span className="price-label">Price</span>
                        <span className="price-amount">⟠ {nft.price} {nft.currency}</span>
                      </div>
                      <button className="buy-nft-btn">Buy Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="nft-actions">
              <button className="create-nft-btn">🎨 Create NFT</button>
              <button className="my-nfts-btn">🖼️ My NFTs</button>
            </div>
          </div>
        )}

        {/* DeFi Tab */}
        {activeTab === 'defi' && (
          <div className="defi-content">
            <div className="defi-features-grid">
              <div className="defi-feature-card">
                <div className="defi-icon">💰</div>
                <h3>Staking</h3>
                <p>Earn rewards by staking your tokens</p>
                <div className="defi-stats">
                  <span>APY: 12.5%</span>
                  <span>TVL: $2.5M</span>
                </div>
                <button className="defi-btn">Stake Now</button>
              </div>

              <div className="defi-feature-card">
                <div className="defi-icon">🌊</div>
                <h3>Liquidity Pools</h3>
                <p>Provide liquidity and earn trading fees</p>
                <div className="defi-stats">
                  <span>APR: 18.3%</span>
                  <span>TVL: $5.8M</span>
                </div>
                <button className="defi-btn">Add Liquidity</button>
              </div>

              <div className="defi-feature-card">
                <div className="defi-icon">🌾</div>
                <h3>Yield Farming</h3>
                <p>Maximize returns with yield farming strategies</p>
                <div className="defi-stats">
                  <span>APY: 45.7%</span>
                  <span>TVL: $3.2M</span>
                </div>
                <button className="defi-btn">Start Farming</button>
              </div>

              <div className="defi-feature-card">
                <div className="defi-icon">💳</div>
                <h3>Lending & Borrowing</h3>
                <p>Lend assets to earn interest or borrow with collateral</p>
                <div className="defi-stats">
                  <span>Supply APY: 8.2%</span>
                  <span>Borrow APY: 5.5%</span>
                </div>
                <button className="defi-btn">Lend/Borrow</button>
              </div>

              <div className="defi-feature-card">
                <div className="defi-icon">⚡</div>
                <h3>Flash Loans</h3>
                <p>Borrow large amounts without collateral</p>
                <div className="defi-stats">
                  <span>Fee: 0.09%</span>
                  <span>Max: $10M</span>
                </div>
                <button className="defi-btn">Execute</button>
              </div>

              <div className="defi-feature-card">
                <div className="defi-icon">🎲</div>
                <h3>Arbitrage</h3>
                <p>Profit from price differences across DEXs</p>
                <div className="defi-stats">
                  <span>Opportunities: 23</span>
                  <span>Avg Profit: 2.3%</span>
                </div>
                <button className="defi-btn">View Opportunities</button>
              </div>
            </div>

            <div className="defi-protocols">
              <h3>Supported Protocols</h3>
              <div className="protocols-list">
                <div className="protocol-item">Uniswap</div>
                <div className="protocol-item">Aave</div>
                <div className="protocol-item">Compound</div>
                <div className="protocol-item">Curve</div>
                <div className="protocol-item">SushiSwap</div>
                <div className="protocol-item">PancakeSwap</div>
              </div>
            </div>
          </div>
        )}

        {/* DAO Tab */}
        {activeTab === 'dao' && (
          <div className="dao-content">
            <div className="dao-header-section">
              <h2>AETHERIAL DAO</h2>
              <p>Decentralized governance for the AETHERIAL ecosystem</p>
            </div>

            <div className="dao-stats-grid">
              <div className="dao-stat-card">
                <h4>Total Members</h4>
                <p className="dao-stat-value">12,456</p>
              </div>
              <div className="dao-stat-card">
                <h4>Active Proposals</h4>
                <p className="dao-stat-value">8</p>
              </div>
              <div className="dao-stat-card">
                <h4>Treasury Value</h4>
                <p className="dao-stat-value">$5.2M</p>
              </div>
              <div className="dao-stat-card">
                <h4>Your Voting Power</h4>
                <p className="dao-stat-value">10,000 AETH</p>
              </div>
            </div>

            <div className="proposals-section">
              <div className="section-header-dao">
                <h3>Active Proposals</h3>
                <button className="create-proposal-btn">+ Create Proposal</button>
              </div>

              <div className="proposals-list">
                <div className="proposal-card">
                  <div className="proposal-header">
                    <h4>Proposal #12: Increase Staking Rewards</h4>
                    <span className="proposal-status active">Active</span>
                  </div>
                  <p className="proposal-description">
                    Increase staking rewards from 12.5% to 15% APY to attract more liquidity
                  </p>
                  <div className="proposal-votes">
                    <div className="vote-bar">
                      <div className="vote-for" style={{ width: '68%' }}></div>
                    </div>
                    <div className="vote-stats">
                      <span className="vote-for-text">For: 68% (8,500 votes)</span>
                      <span className="vote-against-text">Against: 32% (4,000 votes)</span>
                    </div>
                  </div>
                  <div className="proposal-footer">
                    <span className="proposal-time">Ends in 3 days</span>
                    <div className="proposal-actions">
                      <button className="vote-btn for">Vote For</button>
                      <button className="vote-btn against">Vote Against</button>
                    </div>
                  </div>
                </div>

                <div className="proposal-card">
                  <div className="proposal-header">
                    <h4>Proposal #11: Add New Trading Pair</h4>
                    <span className="proposal-status active">Active</span>
                  </div>
                  <p className="proposal-description">
                    Add AETH/USDC trading pair to increase trading volume and liquidity
                  </p>
                  <div className="proposal-votes">
                    <div className="vote-bar">
                      <div className="vote-for" style={{ width: '82%' }}></div>
                    </div>
                    <div className="vote-stats">
                      <span className="vote-for-text">For: 82% (10,250 votes)</span>
                      <span className="vote-against-text">Against: 18% (2,250 votes)</span>
                    </div>
                  </div>
                  <div className="proposal-footer">
                    <span className="proposal-time">Ends in 5 days</span>
                    <div className="proposal-actions">
                      <button className="vote-btn for">Vote For</button>
                      <button className="vote-btn against">Vote Against</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainHub;

