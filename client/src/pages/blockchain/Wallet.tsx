/**
 * AETHERIAL Wallet
 * 
 * Manage AETH tokens, view balances, send/receive transactions
 * Multi-signature support, hardware wallet integration
 */

import React, { useState, useEffect } from 'react';
import './Wallet.css';

interface WalletData {
  address: string;
  balance: number;
  privateKey?: string;
  publicKey: string;
  transactions: WalletTransaction[];
}

interface WalletTransaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  from: string;
  to: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
}

interface Token {
  symbol: string;
  name: string;
  balance: number;
  value: number;
}

export const Wallet: React.FC = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transactionFee, setTransactionFee] = useState(0.001);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'send' | 'receive' | 'history'>('overview');

  useEffect(() => {
    loadWallet();
    loadTokens();
  }, []);

  const loadWallet = async () => {
    try {
      const response = await fetch('/api/blockchain/wallet');
      const data = await response.json();
      setWallet(data.wallet);
    } catch (error) {
      console.error('Failed to load wallet:', error);
    }
  };

  const loadTokens = async () => {
    try {
      const response = await fetch('/api/blockchain/tokens');
      const data = await response.json();
      setTokens(data.tokens);
    } catch (error) {
      console.error('Failed to load tokens:', error);
    }
  };

  const createWallet = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/blockchain/wallet/create', {
        method: 'POST',
      });
      const data = await response.json();
      setWallet(data.wallet);
      alert('Wallet created successfully! Please save your private key securely.');
    } catch (error) {
      console.error('Failed to create wallet:', error);
      alert('Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  const importWallet = async (privateKey: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/blockchain/wallet/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privateKey }),
      });
      const data = await response.json();
      setWallet(data.wallet);
      alert('Wallet imported successfully!');
    } catch (error) {
      console.error('Failed to import wallet:', error);
      alert('Failed to import wallet');
    } finally {
      setLoading(false);
    }
  };

  const sendTransaction = async () => {
    if (!wallet || !recipientAddress || !sendAmount) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/blockchain/transaction/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: wallet.address,
          to: recipientAddress,
          amount: parseFloat(sendAmount),
          fee: transactionFee,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Transaction sent successfully!');
        setSendAmount('');
        setRecipientAddress('');
        loadWallet();
        setActiveTab('history');
      } else {
        alert('Transaction failed: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to send transaction:', error);
      alert('Failed to send transaction');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 10)}...${address.substring(address.length - 8)}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!wallet) {
    return (
      <div className="wallet-setup">
        <div className="setup-card">
          <h1>💼 AETHERIAL Wallet</h1>
          <p>Create a new wallet or import an existing one</p>
          
          <div className="setup-actions">
            <button
              className="primary-button"
              onClick={createWallet}
              disabled={loading}
            >
              {loading ? 'Creating...' : '🆕 Create New Wallet'}
            </button>
            
            <button
              className="secondary-button"
              onClick={() => {
                const key = prompt('Enter your private key:');
                if (key) importWallet(key);
              }}
              disabled={loading}
            >
              📥 Import Wallet
            </button>
          </div>

          <div className="setup-info">
            <h3>⚠️ Important Security Information</h3>
            <ul>
              <li>Your private key is the only way to access your wallet</li>
              <li>Never share your private key with anyone</li>
              <li>Store your private key in a secure location</li>
              <li>AETHERIAL cannot recover lost private keys</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet">
      <header className="wallet-header">
        <h1>💼 My Wallet</h1>
        <div className="wallet-address">
          <span>{formatAddress(wallet.address)}</span>
          <button onClick={() => copyToClipboard(wallet.address)}>📋 Copy</button>
        </div>
      </header>

      <div className="wallet-balance">
        <div className="balance-main">
          <div className="balance-label">Total Balance</div>
          <div className="balance-amount">{wallet.balance.toFixed(4)} AETH</div>
          <div className="balance-usd">
            ≈ ${(wallet.balance * 2500).toFixed(2)} USD
          </div>
        </div>
      </div>

      <div className="wallet-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={activeTab === 'send' ? 'active' : ''}
          onClick={() => setActiveTab('send')}
        >
          📤 Send
        </button>
        <button
          className={activeTab === 'receive' ? 'active' : ''}
          onClick={() => setActiveTab('receive')}
        >
          📥 Receive
        </button>
        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          📜 History
        </button>
      </div>

      <div className="wallet-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="tokens-section">
              <h2>Assets</h2>
              <div className="tokens-list">
                <div className="token-item main-token">
                  <div className="token-icon">Ⓐ</div>
                  <div className="token-info">
                    <div className="token-name">AETH</div>
                    <div className="token-fullname">Aetherial Token</div>
                  </div>
                  <div className="token-balance">
                    <div className="token-amount">{wallet.balance.toFixed(4)}</div>
                    <div className="token-value">${(wallet.balance * 2500).toFixed(2)}</div>
                  </div>
                </div>

                {tokens.map(token => (
                  <div key={token.symbol} className="token-item">
                    <div className="token-icon">{token.symbol[0]}</div>
                    <div className="token-info">
                      <div className="token-name">{token.symbol}</div>
                      <div className="token-fullname">{token.name}</div>
                    </div>
                    <div className="token-balance">
                      <div className="token-amount">{token.balance.toFixed(4)}</div>
                      <div className="token-value">${token.value.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="wallet-keys">
              <h2>Wallet Keys</h2>
              <div className="key-item">
                <div className="key-label">Public Key</div>
                <div className="key-value">
                  <code>{wallet.publicKey}</code>
                  <button onClick={() => copyToClipboard(wallet.publicKey)}>📋</button>
                </div>
              </div>
              
              {wallet.privateKey && (
                <div className="key-item">
                  <div className="key-label">Private Key</div>
                  <div className="key-value">
                    <code>
                      {showPrivateKey ? wallet.privateKey : '••••••••••••••••••••••••••••••••'}
                    </code>
                    <button onClick={() => setShowPrivateKey(!showPrivateKey)}>
                      {showPrivateKey ? '🙈' : '👁️'}
                    </button>
                    {showPrivateKey && (
                      <button onClick={() => copyToClipboard(wallet.privateKey!)}>📋</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'send' && (
          <div className="send-tab">
            <h2>Send AETH</h2>
            
            <div className="send-form">
              <div className="form-group">
                <label>Recipient Address</label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Amount (AETH)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  step="0.0001"
                  min="0"
                  max={wallet.balance}
                />
                <div className="input-hint">
                  Available: {wallet.balance.toFixed(4)} AETH
                </div>
              </div>

              <div className="form-group">
                <label>Transaction Fee</label>
                <select
                  value={transactionFee}
                  onChange={(e) => setTransactionFee(parseFloat(e.target.value))}
                >
                  <option value={0.0001}>Slow (0.0001 AETH)</option>
                  <option value={0.001}>Normal (0.001 AETH)</option>
                  <option value={0.01}>Fast (0.01 AETH)</option>
                </select>
              </div>

              <div className="transaction-summary">
                <div className="summary-row">
                  <span>Amount:</span>
                  <span>{sendAmount || '0.00'} AETH</span>
                </div>
                <div className="summary-row">
                  <span>Fee:</span>
                  <span>{transactionFee} AETH</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>{(parseFloat(sendAmount || '0') + transactionFee).toFixed(4)} AETH</span>
                </div>
              </div>

              <button
                className="send-button"
                onClick={sendTransaction}
                disabled={loading || !recipientAddress || !sendAmount}
              >
                {loading ? 'Sending...' : '📤 Send Transaction'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'receive' && (
          <div className="receive-tab">
            <h2>Receive AETH</h2>
            
            <div className="receive-content">
              <div className="qr-code">
                <div className="qr-placeholder">
                  {/* QR code would be generated here */}
                  <div className="qr-box">QR Code</div>
                </div>
              </div>

              <div className="receive-address">
                <label>Your Wallet Address</label>
                <div className="address-box">
                  <code>{wallet.address}</code>
                  <button onClick={() => copyToClipboard(wallet.address)}>
                    📋 Copy Address
                  </button>
                </div>
              </div>

              <div className="receive-instructions">
                <h3>How to receive AETH:</h3>
                <ol>
                  <li>Share your wallet address with the sender</li>
                  <li>Or have them scan your QR code</li>
                  <li>Wait for the transaction to be confirmed</li>
                  <li>Funds will appear in your wallet</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-tab">
            <h2>Transaction History</h2>
            
            <div className="transactions-list">
              {wallet.transactions.length === 0 ? (
                <div className="no-transactions">
                  <p>No transactions yet</p>
                </div>
              ) : (
                wallet.transactions.map(tx => (
                  <div key={tx.id} className={`transaction-item ${tx.type}`}>
                    <div className="tx-icon">
                      {tx.type === 'send' ? '📤' : '📥'}
                    </div>
                    <div className="tx-info">
                      <div className="tx-type">
                        {tx.type === 'send' ? 'Sent' : 'Received'}
                      </div>
                      <div className="tx-address">
                        {tx.type === 'send' ? `To: ${formatAddress(tx.to)}` : `From: ${formatAddress(tx.from)}`}
                      </div>
                      <div className="tx-time">{formatTimestamp(tx.timestamp)}</div>
                    </div>
                    <div className="tx-amount">
                      <div className={`amount ${tx.type}`}>
                        {tx.type === 'send' ? '-' : '+'}{tx.amount.toFixed(4)} AETH
                      </div>
                      <div className={`status ${tx.status}`}>
                        {tx.status === 'confirmed' && `✓ ${tx.confirmations} confirmations`}
                        {tx.status === 'pending' && '⏳ Pending'}
                        {tx.status === 'failed' && '✗ Failed'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;

