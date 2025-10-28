import React, { useState, useEffect, useMemo } from 'react';

// --- 1. TypeScript Interfaces and Types ---

/**
 * Defines the structure for a single blockchain network.
 */
interface Chain {
  id: string;
  name: string;
  icon: string; // URL or path to an icon
  isSupported: boolean;
}

/**
 * Defines the structure for a user's token balance.
 */
interface Token {
  id: string;
  name: string;
  symbol: string;
  chain: string;
  balance: number;
  usdValue: number;
  contractAddress: string;
}

/**
 * Defines the structure for a wallet transaction.
 */
interface Transaction {
  id: string;
  type: 'Send' | 'Receive' | 'Swap' | 'Deposit' | 'Withdraw' | 'Aetherial AI Fee';
  status: 'Pending' | 'Confirmed' | 'Failed';
  timestamp: number; // Unix timestamp
  amount: number;
  tokenSymbol: string;
  chain: string;
  from: string;
  to: string;
  hash: string;
}

/**
 * Defines the overall state for the wallet component.
 */
interface WalletState {
  currentAddress: string;
  totalBalanceUSD: number;
  selectedChainId: string;
  tokens: Token[];
  transactions: Transaction[];
  supportedChains: Chain[];
}

/**
 * Props for the WalletPage component (can be empty if state is fully internal).
 */
interface WalletPageProps {
  // Optional: A prop to pass a default wallet address or configuration
  initialAddress?: string;
}

/**
 * Defines the structure for the 'Send' transaction form.
 */
interface SendForm {
  recipientAddress: string;
  amount: string; // Use string for input field
  tokenSymbol: string;
  chain: string;
}

// --- 2. Mock Data (Simulates API Fetch) ---

const mockChains: Chain[] = [
  { id: 'eth', name: 'Ethereum', icon: 'eth-icon', isSupported: true },
  { id: 'poly', name: 'Polygon', icon: 'poly-icon', isSupported: true },
  { id: 'aether', name: 'Aetherial Chain', icon: 'aether-icon', isSupported: true },
  { id: 'sol', name: 'Solana', icon: 'sol-icon', isSupported: false },
];

const mockTokens: Token[] = [
  { id: 't1', name: 'Aetherial Token', symbol: 'AETH', chain: 'aether', balance: 1250.5, usdValue: 1250.5 * 0.5, contractAddress: '0x...AETH' },
  { id: 't2', name: 'Ethereum', symbol: 'ETH', chain: 'eth', balance: 0.85, usdValue: 0.85 * 3500, contractAddress: '0x...ETH' },
  { id: 't3', name: 'USD Coin', symbol: 'USDC', chain: 'poly', balance: 500.0, usdValue: 500.0, contractAddress: '0x...USDC' },
];

const mockTransactions: Transaction[] = [
  { id: 'tx1', type: 'Send', status: 'Confirmed', timestamp: Date.now() - 3600000, amount: 50, tokenSymbol: 'AETH', chain: 'aether', from: '0x...User', to: '0x...Recipient1', hash: '0x...hash1' },
  { id: 'tx2', type: 'Receive', status: 'Confirmed', timestamp: Date.now() - 86400000, amount: 0.1, tokenSymbol: 'ETH', chain: 'eth', from: '0x...Sender2', to: '0x...User', hash: '0x...hash2' },
  { id: 'tx3', type: 'Aetherial AI Fee', status: 'Pending', timestamp: Date.now() - 1800000, amount: 2.5, tokenSymbol: 'AETH', chain: 'aether', from: '0x...User', to: '0x...AI_Service', hash: '0x...hash3' },
  { id: 'tx4', type: 'Swap', status: 'Confirmed', timestamp: Date.now() - 259200000, amount: 500, tokenSymbol: 'USDC', chain: 'poly', from: '0x...User', to: '0x...DEX', hash: '0x...hash4' },
];

// --- 3. Utility Functions ---

const formatAddress = (address: string) => `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
const formatDate = (timestamp: number) => new Date(timestamp).toLocaleString();

// --- 4. Main Component ---

const WalletPage: React.FC<WalletPageProps> = ({ initialAddress = '0xAb5801a7d398351b8bE11C439e05C5B3259aeC9B' }) => {
  const [walletState, setWalletState] = useState<WalletState>({
    currentAddress: initialAddress,
    totalBalanceUSD: 0,
    selectedChainId: 'aether', // Default to Aetherial Chain
    tokens: [],
    transactions: [],
    supportedChains: mockChains,
  });

  const [activeTab, setActiveTab] = useState<'tokens' | 'transactions'>('tokens');
  const [showSendForm, setShowSendForm] = useState(false);
  const [sendForm, setSendForm] = useState<SendForm>({
    recipientAddress: '',
    amount: '',
    tokenSymbol: 'AETH',
    chain: 'aether',
  });
  const [filter, setFilter] = useState<{ chain: string; type: string }>({ chain: 'All', type: 'All' });

  // Simulate data fetching and total balance calculation on mount
  useEffect(() => {
    const totalBalance = mockTokens.reduce((sum, token) => sum + token.usdValue, 0);
    setWalletState(prev => ({
      ...prev,
      tokens: mockTokens.sort((a, b) => b.usdValue - a.usdValue),
      transactions: mockTransactions.sort((a, b) => b.timestamp - a.timestamp),
      totalBalanceUSD: totalBalance,
    }));
  }, []);

  // Filtered transactions based on user selection
  const filteredTransactions = useMemo(() => {
    return walletState.transactions.filter(tx => {
      const chainMatch = filter.chain === 'All' || tx.chain === filter.chain;
      const typeMatch = filter.type === 'All' || tx.type === filter.type;
      return chainMatch && typeMatch;
    });
  }, [walletState.transactions, filter]);

  // Handler for opening/closing the Send form
  const handleSendClick = () => {
    setShowSendForm(true);
  };

  // Handler for form input changes
  const handleSendFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSendForm(prev => ({ ...prev, [name]: value }));
  };

  // Handler for submitting the Send transaction
  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending transaction:', sendForm);
    // In a production app, this would call a blockchain service API
    // For now, simulate a new pending transaction
    const newToken = walletState.tokens.find(t => t.symbol === sendForm.tokenSymbol);
    if (newToken) {
      const newTx: Transaction = {
        id: `tx${Date.now()}`,
        type: 'Send',
        status: 'Pending',
        timestamp: Date.now(),
        amount: parseFloat(sendForm.amount),
        tokenSymbol: sendForm.tokenSymbol,
        chain: sendForm.chain,
        from: walletState.currentAddress,
        to: sendForm.recipientAddress,
        hash: '0x...simulated_pending_hash',
      };

      setWalletState(prev => ({
        ...prev,
        transactions: [newTx, ...prev.transactions],
      }));
    }

    // Reset form and close
    setSendForm({ recipientAddress: '', amount: '', tokenSymbol: 'AETH', chain: 'aether' });
    setShowSendForm(false);
  };

  // Handler for changing the active chain
  const handleChainChange = (chainId: string) => {
    setWalletState(prev => ({ ...prev, selectedChainId: chainId }));
    // In a production app, this would trigger a re-fetch of tokens and transactions for the new chain
    console.log(`Switched to chain: ${chainId}`);
  };

  // --- 5. Component Helper Renders (Forms, Lists, etc.) ---

  const renderChainSelector = () => (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-700 rounded-lg shadow-inner">
      {walletState.supportedChains.map(chain => (
        <button
          key={chain.id}
          onClick={() => handleChainChange(chain.id)}
          disabled={!chain.isSupported}
          className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
            walletState.selectedChainId === chain.id
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          } ${!chain.isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={!chain.isSupported ? `Support for ${chain.name} is coming soon.` : chain.name}
        >
          {chain.name}
        </button>
      ))}
    </div>
  );

  const renderSendForm = () => (
    <div className="p-6 bg-gray-800 rounded-xl shadow-2xl mt-4">
      <h3 className="text-xl font-semibold text-white mb-4">Send Funds</h3>
      <form onSubmit={handleSendSubmit} className="space-y-4">
        <div>
          <label htmlFor="recipientAddress" className="block text-sm font-medium text-gray-400">Recipient Address</label>
          <input
            id="recipientAddress"
            type="text"
            name="recipientAddress"
            value={sendForm.recipientAddress}
            onChange={handleSendFormChange}
            placeholder="0x..."
            required
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-400">Amount</label>
            <input
              id="amount"
              type="number"
              name="amount"
              value={sendForm.amount}
              onChange={handleSendFormChange}
              step="any"
              min="0.000001"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label htmlFor="tokenSymbol" className="block text-sm font-medium text-gray-400">Token</label>
            <select
              id="tokenSymbol"
              name="tokenSymbol"
              value={sendForm.tokenSymbol}
              onChange={handleSendFormChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {walletState.tokens.map(token => (
                <option key={token.symbol} value={token.symbol}>{token.symbol} ({token.chain.toUpperCase()})</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowSendForm(false)}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/50"
          >
            Confirm Send
          </button>
        </div>
      </form>
    </div>
  );

  const renderTokens = () => (
    <div className="space-y-3">
      {walletState.tokens.filter(t => t.chain === walletState.selectedChainId).map(token => (
        <div key={token.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
          <div className="flex items-center space-x-3">
            {/* Placeholder for Token Icon */}
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">{token.symbol[0]}</div>
            <div>
              <p className="text-white font-medium">{token.name} ({token.symbol})</p>
              <p className="text-xs text-gray-400">{token.chain.toUpperCase()} Chain</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold">{token.balance.toFixed(4)}</p>
            <p className="text-sm text-green-400">{formatCurrency(token.usdValue)}</p>
          </div>
        </div>
      ))}
      <div className="pt-4 border-t border-gray-700">
        <button className="w-full py-2 text-sm font-medium text-purple-400 border border-purple-400 rounded-md hover:bg-purple-900/50 transition-colors">
          + Manage Tokens
        </button>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-4">
      {/* Transaction Filter */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filter.chain}
          onChange={(e) => setFilter(prev => ({ ...prev, chain: e.target.value }))}
          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="All">All Chains</option>
          {walletState.supportedChains.map(chain => (
            <option key={chain.id} value={chain.id}>{chain.name}</option>
          ))}
        </select>
        <select
          value={filter.type}
          onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="All">All Types</option>
          <option value="Send">Send</option>
          <option value="Receive">Receive</option>
          <option value="Swap">Swap</option>
          <option value="Aetherial AI Fee">AI Fee (Aetherial)</option>
        </select>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No transactions found for the selected filters.</p>
        ) : (
          filteredTransactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <div className="flex items-start space-x-4">
                {/* Status Indicator */}
                <div className={`w-2 h-2 rounded-full mt-2 ${tx.status === 'Confirmed' ? 'bg-green-500' : tx.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="text-white font-medium">{tx.type} {tx.tokenSymbol}</p>
                  <p className="text-xs text-gray-400">
                    {formatDate(tx.timestamp)} on {tx.chain.toUpperCase()}
                  </p>
                  <p className="text-xs text-purple-400 mt-1 cursor-pointer hover:underline" title={tx.hash}>
                    Hash: {formatAddress(tx.hash)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${tx.type === 'Send' || tx.type === 'Aetherial AI Fee' ? 'text-red-400' : 'text-green-400'}`}>
                  {tx.type === 'Send' || tx.type === 'Aetherial AI Fee' ? '-' : '+'}{tx.amount.toFixed(4)} {tx.tokenSymbol}
                </p>
                <p className="text-xs text-gray-400">
                  {tx.status}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // --- 6. Main Component Structure (BuddyBoss Abstraction & Aetherial Enhancements) ---

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8 text-white font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-purple-400 mb-6 border-b border-gray-700 pb-3">
          Multi-Chain Wallet
        </h1>

        {/* Wallet Overview Card - BuddyBoss-style prominent header */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Total Portfolio Value</h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Address:</span>
              <span className="text-sm font-mono text-purple-300 cursor-pointer hover:text-purple-400 transition-colors"
                    onClick={() => navigator.clipboard.writeText(walletState.currentAddress)}
                    title="Click to copy address">
                {formatAddress(walletState.currentAddress)}
              </span>
            </div>
          </div>
          <p className="text-5xl font-extrabold text-green-400 mb-6">
            {formatCurrency(walletState.totalBalanceUSD)}
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleSendClick}
              className="flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors shadow-md shadow-purple-500/30"
            >
              Send
            </button>
            <button
              className="flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              Receive
            </button>
            {/* Aetherial DeFi Enhancement: Quick Swap */}
            <button
              className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              Swap (DeFi)
            </button>
          </div>
        </div>

        {/* Send Form Section */}
        {showSendForm && renderSendForm()}

        {/* Multi-Chain Selector - Aetherial Enhancement */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">Select Chain</h2>
          {renderChainSelector()}
        </div>

        {/* Main Content: Tokens and Transactions */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab('tokens')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'tokens' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Tokens ({walletState.tokens.filter(t => t.chain === walletState.selectedChainId).length})
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'transactions' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Transaction History ({walletState.transactions.length})
            </button>
            {/* Aetherial AI Enhancement: AI-Powered Insights Tab */}
            <button
              className="px-4 py-2 font-medium text-yellow-400 hover:text-yellow-300 transition-colors ml-auto"
              onClick={() => alert('AI Insights: Analyzing transaction patterns and suggesting gas fee optimizations...')}
            >
              AI Insights
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'tokens' && renderTokens()}
          {activeTab === 'transactions' && renderTransactions()}
        </div>

        {/* Responsive Design Note (Not visible in final component, for developer context) */}
        <div className="mt-8 text-xs text-gray-500 text-center">
          <p>
            *Component is responsive using Tailwind CSS: The layout adjusts for mobile (single column) and desktop (larger cards/sections).
          </p>
        </div>
      </div>
    </div>
  );
};

// --- 7. Export Default ---
export default WalletPage;