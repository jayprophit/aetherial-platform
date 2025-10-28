import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FiSearch, FiFilter, FiRefreshCw, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

// --- 1. TypeScript Interfaces and Types ---

/**
 * Represents a single transaction on the blockchain.
 */
interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: number; // In native currency (e.g., ETH, AETH)
  fee: number;
  timestamp: number; // Unix timestamp
  blockNumber: number;
  status: 'Success' | 'Pending' | 'Failed';
  type: 'Transfer' | 'Contract Call' | 'Deployment' | 'DeFi Swap';
}

/**
 * Represents a block in the blockchain.
 */
interface Block {
  number: number;
  hash: string;
  miner: string;
  timestamp: number;
  transactionCount: number;
  gasUsed: number;
  gasLimit: number;
  difficulty: string;
}

/**
 * Represents a deployed smart contract.
 */
interface SmartContract {
  address: string;
  name: string;
  creator: string;
  balance: number;
  transactionCount: number;
  verified: boolean;
}

/**
 * Defines the overall state for the Blockchain Explorer.
 */
interface ExplorerState {
  latestBlock: Block | null;
  recentBlocks: Block[];
  recentTransactions: Transaction[];
  currentView: 'blocks' | 'transactions' | 'contracts' | 'visualization';
  searchTerm: string;
  filterType: string;
  isLoading: boolean;
}

// --- 2. Sample Data (Simulating API Fetch) ---

const generateSampleTransaction = (blockNumber: number): Transaction => ({
  hash: `0x${Math.random().toString(16).substring(2, 64)}`,
  from: `0x${Math.random().toString(16).substring(2, 42)}`,
  to: `0x${Math.random().toString(16).substring(2, 42)}`,
  value: parseFloat((Math.random() * 100).toFixed(4)),
  fee: parseFloat((Math.random() * 0.01).toFixed(6)),
  timestamp: Date.now() - Math.floor(Math.random() * 3600000), // Within the last hour
  blockNumber,
  status: Math.random() > 0.1 ? 'Success' : 'Failed',
  type: ['Transfer', 'Contract Call', 'Deployment', 'DeFi Swap'][Math.floor(Math.random() * 4)] as Transaction['type'],
});

const generateSampleBlock = (number: number): Block => ({
  number,
  hash: `0x${Math.random().toString(16).substring(2, 64)}`,
  miner: `0x${Math.random().toString(16).substring(2, 42)}`,
  timestamp: Date.now() - (15 * (1000 * (1000 - number))), // Simulate block time
  transactionCount: Math.floor(Math.random() * 150) + 1,
  gasUsed: Math.floor(Math.random() * 10000000) + 100000,
  gasLimit: 30000000,
  difficulty: `${(Math.random() * 100).toFixed(2)} P`,
});

const generateSampleContract = (index: number): SmartContract => ({
  address: `0x${Math.random().toString(16).substring(2, 42)}`,
  name: `AetherialContract${index}`,
  creator: `0x${Math.random().toString(16).substring(2, 42)}`,
  balance: parseFloat((Math.random() * 5000).toFixed(2)),
  transactionCount: Math.floor(Math.random() * 50000),
  verified: Math.random() > 0.2,
});

const LATEST_BLOCK_NUMBER = 1000000;
const SAMPLE_BLOCKS: Block[] = Array.from({ length: 10 }, (_, i) => generateSampleBlock(LATEST_BLOCK_NUMBER - i));
const SAMPLE_TRANSACTIONS: Transaction[] = SAMPLE_BLOCKS.flatMap(block =>
  Array.from({ length: Math.min(block.transactionCount, 5) }, () => generateSampleTransaction(block.number))
);
const SAMPLE_CONTRACTS: SmartContract[] = Array.from({ length: 5 }, (_, i) => generateSampleContract(i));

// --- 3. AETHERIAL Unique Enhancement: 4D Visualization Placeholder ---

/**
 * Placeholder component for the advanced 4D Blockchain Visualization.
 * In a production environment, this would integrate with a WebGL/Three.js
 * library to render a complex, interactive graph representing the
 * temporal (time) and spatial (network/data) dimensions of the blockchain.
 */
const Aetherial4DVisualization: React.FC = () => {
  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg shadow-xl flex flex-col items-center justify-center p-4">
      <h3 className="text-xl font-semibold text-aetherial-blue-400 mb-2">AETHERIAL 4D Blockchain Visualization</h3>
      <p className="text-sm text-gray-400 text-center max-w-lg">
        This area would display an interactive, multi-dimensional graph of the blockchain state,
        showing block-to-block connections, transaction flow (3D), and temporal evolution (4th D).
        <br />
        <span className="text-xs text-red-400 mt-2 block">
          (Requires a dedicated WebGL/Three.js implementation and real-time data streaming)
        </span>
      </p>
      <div className="mt-4 p-2 bg-gray-800 rounded text-xs text-gray-500">
        <p>Current Focus: Network Health & Transaction Latency</p>
      </div>
    </div>
  );
};

// --- 4. Helper Components for Rendering Data ---

const TimeAgo: React.FC<{ timestamp: number }> = ({ timestamp }) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const seconds = Math.floor((Date.now() - timestamp) / 1000);
      let interval = Math.floor(seconds / 31536000);

      if (interval >= 1) return setTimeStr(`${interval} year${interval > 1 ? 's' : ''} ago`);
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) return setTimeStr(`${interval} month${interval > 1 ? 's' : ''} ago`);
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) return setTimeStr(`${interval} day${interval > 1 ? 's' : ''} ago`);
      interval = Math.floor(seconds / 3600);
      if (interval >= 1) return setTimeStr(`${interval} hour${interval > 1 ? 's' : ''} ago`);
      interval = Math.floor(seconds / 60);
      if (interval >= 1) return setTimeStr(`${interval} minute${interval > 1 ? 's' : ''} ago`);
      return setTimeStr(`${Math.floor(seconds)} second${seconds !== 1 ? 's' : ''} ago`);
    };

    updateTime();
    const timer = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(timer);
  }, [timestamp]);

  return <span className="text-xs text-gray-400">{timeStr}</span>;
};

const DataRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-700 last:border-b-0">
    <span className="text-gray-400 font-medium">{label}:</span>
    <span className="text-white font-mono text-sm break-all">{value}</span>
  </div>
);

const BlockCard: React.FC<{ block: Block }> = ({ block }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
    <h4 className="text-lg font-bold text-aetherial-blue-300 mb-2">Block #{block.number}</h4>
    <DataRow label="Hash" value={<span className="text-aetherial-green-300">{block.hash.substring(0, 10)}...</span>} />
    <DataRow label="Transactions" value={block.transactionCount} />
    <DataRow label="Mined By" value={<span className="text-aetherial-yellow-300">{block.miner.substring(0, 10)}...</span>} />
    <DataRow label="Time" value={<TimeAgo timestamp={block.timestamp} />} />
  </div>
);

const TransactionCard: React.FC<{ tx: Transaction }> = ({ tx }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
    <h4 className="text-lg font-bold text-aetherial-blue-300 mb-2">Tx Hash: {tx.hash.substring(0, 10)}...</h4>
    <DataRow label="From" value={<span className="text-aetherial-yellow-300">{tx.from.substring(0, 10)}...</span>} />
    <DataRow label="To" value={<span className="text-aetherial-yellow-300">{tx.to.substring(0, 10)}...</span>} />
    <DataRow label="Value" value={`${tx.value.toFixed(4)} AETH`} />
    <DataRow label="Type" value={<span className={`px-2 py-0.5 rounded text-xs font-semibold ${tx.type === 'DeFi Swap' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'}`}>{tx.type}</span>} />
    <DataRow label="Status" value={<span className={`font-bold ${tx.status === 'Success' ? 'text-green-500' : 'text-red-500'}`}>{tx.status}</span>} />
  </div>
);

const ContractCard: React.FC<{ contract: SmartContract }> = ({ contract }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
    <h4 className="text-lg font-bold text-aetherial-blue-300 mb-2">{contract.name}</h4>
    <DataRow label="Address" value={<span className="text-aetherial-green-300">{contract.address.substring(0, 10)}...</span>} />
    <DataRow label="Creator" value={contract.creator.substring(0, 10) + '...'} />
    <DataRow label="Balance" value={`${contract.balance.toFixed(2)} AETH`} />
    <DataRow label="Verified" value={contract.verified ? <span className="text-green-500">Yes</span> : <span className="text-red-500">No</span>} />
  </div>
);

// --- 5. Main Component Implementation ---

/**
 * The main component for the Aetherial Blockchain Explorer Page.
 * It features state management, simulated data fetching, interactive elements,
 * and a placeholder for the unique 4D visualization.
 */
const BlockchainExplorer: React.FC = () => {
  // --- State Management (useState/useEffect) ---
  const [state, setState] = useState<ExplorerState>({
    latestBlock: null,
    recentBlocks: [],
    recentTransactions: [],
    currentView: 'blocks',
    searchTerm: '',
    filterType: 'All',
    isLoading: true,
  });

  // Simulate data fetching on component mount
  useEffect(() => {
    // In a production app, this would be an API call (e.g., via Redux/Saga/Thunk or a dedicated data layer)
    const fetchData = () => {
      setState(prevState => ({
        ...prevState,
        latestBlock: SAMPLE_BLOCKS[0],
        recentBlocks: SAMPLE_BLOCKS,
        recentTransactions: SAMPLE_TRANSACTIONS,
        isLoading: false,
      }));
    };

    const timer = setTimeout(fetchData, 1000); // Simulate network delay
    return () => clearTimeout(timer);
  }, []);

  // --- Interactive Features (Handlers) ---

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prevState => ({ ...prevState, searchTerm: e.target.value }));
  }, []);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setState(prevState => ({ ...prevState, filterType: e.target.value }));
  }, []);

  const handleViewChange = useCallback((view: ExplorerState['currentView']) => {
    setState(prevState => ({ ...prevState, currentView: view }));
  }, []);

  const handleRefresh = useCallback(() => {
    setState(prevState => ({ ...prevState, isLoading: true }));
    // Simulate a new data fetch
    setTimeout(() => {
      const newBlockNumber = state.latestBlock ? state.latestBlock.number + 1 : LATEST_BLOCK_NUMBER + 1;
      const newBlock = generateSampleBlock(newBlockNumber);
      const newTxs = Array.from({ length: Math.min(newBlock.transactionCount, 5) }, () => generateSampleTransaction(newBlock.number));

      setState(prevState => ({
        ...prevState,
        latestBlock: newBlock,
        recentBlocks: [newBlock, ...prevState.recentBlocks.slice(0, 9)],
        recentTransactions: [...newTxs, ...prevState.recentTransactions].slice(0, 20),
        isLoading: false,
      }));
    }, 500);
  }, [state.latestBlock]);


  // --- Filtered and Memoized Data ---

  const filteredTransactions = useMemo(() => {
    let transactions = state.recentTransactions;

    if (state.filterType !== 'All') {
      transactions = transactions.filter(tx => tx.type === state.filterType);
    }

    if (state.searchTerm) {
      const lowerCaseSearch = state.searchTerm.toLowerCase();
      transactions = transactions.filter(tx =>
        tx.hash.toLowerCase().includes(lowerCaseSearch) ||
        tx.from.toLowerCase().includes(lowerCaseSearch) ||
        tx.to.toLowerCase().includes(lowerCaseSearch)
      );
    }

    return transactions;
  }, [state.recentTransactions, state.filterType, state.searchTerm]);

  const filteredBlocks = useMemo(() => {
    if (!state.searchTerm) return state.recentBlocks;
    const lowerCaseSearch = state.searchTerm.toLowerCase();
    return state.recentBlocks.filter(block =>
      block.hash.toLowerCase().includes(lowerCaseSearch) ||
      block.number.toString().includes(state.searchTerm) ||
      block.miner.toLowerCase().includes(lowerCaseSearch)
    );
  }, [state.recentBlocks, state.searchTerm]);

  // --- Rendering Logic for Current View ---

  const renderContent = () => {
    if (state.isLoading) {
      return (
        <div className="text-center py-10 text-aetherial-blue-300">
          <FiRefreshCw className="animate-spin inline-block w-8 h-8 mr-2" />
          <p>Loading Aetherial Blockchain Data...</p>
        </div>
      );
    }

    switch (state.currentView) {
      case 'visualization':
        return <Aetherial4DVisualization />;

      case 'blocks':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlocks.length > 0 ? (
              filteredBlocks.map(block => <BlockCard key={block.hash} block={block} />)
            ) : (
              <p className="text-gray-400 col-span-full">No blocks found matching your criteria.</p>
            )}
            <div className="col-span-full flex justify-center mt-4">
              <button className="flex items-center text-aetherial-blue-400 hover:text-aetherial-blue-300">
                <FiArrowLeft className="mr-2" /> Load Previous Blocks
              </button>
            </div>
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(tx => <TransactionCard key={tx.hash} tx={tx} />)
            ) : (
              <p className="text-gray-400">No transactions found matching your criteria.</p>
            )}
            <div className="flex justify-center mt-4">
              <button className="flex items-center text-aetherial-blue-400 hover:text-aetherial-blue-300">
                Load More Transactions <FiArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        );

      case 'contracts':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_CONTRACTS.map(contract => <ContractCard key={contract.address} contract={contract} />)}
            <p className="col-span-full text-sm text-gray-500 mt-4">
              Displaying top 5 most active Smart Contracts.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  // --- Component Structure (JSX) ---

  // Note: Tailwind CSS classes are used for responsive design and modern dark theme styling.
  // The 'aetherial-blue' and 'aetherial-green' classes are placeholders for a custom theme.

  return (
    <div className="p-4 md:p-8 bg-gray-900 min-h-screen text-white font-sans">
      {/* Header and Latest Block Summary */}
      <header className="mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-aetherial-blue-300">
          AETHERIAL Blockchain Explorer
        </h1>
        <p className="text-gray-400 mt-1">
          Real-time insight into the Aetherial Network.
        </p>
        {state.latestBlock && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-inner flex flex-wrap justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Latest Block</span>
              <span className="text-xl font-bold text-aetherial-green-300">
                #{state.latestBlock.number}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Transactions</span>
              <span className="text-xl font-bold text-white">
                {state.latestBlock.transactionCount}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Gas Used</span>
              <span className="text-xl font-bold text-white">
                {(state.latestBlock.gasUsed / 1000000).toFixed(2)}M
              </span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={state.isLoading}
              className="mt-2 md:mt-0 px-3 py-1 bg-aetherial-blue-600 hover:bg-aetherial-blue-500 rounded-lg text-white font-semibold flex items-center transition duration-200"
            >
              <FiRefreshCw className={`mr-2 ${state.isLoading ? 'animate-spin' : ''}`} />
              {state.isLoading ? 'Syncing...' : 'Refresh'}
            </button>
          </div>
        )}
      </header>

      {/* Interactive Features: Search, Filters, and View Tabs */}
      <div className="mb-8 space-y-4">
        {/* Search Form */}
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Block Hash/Number, Tx Hash, or Address..."
              value={state.searchTerm}
              onChange={handleSearchChange}
              className="w-full py-3 pl-10 pr-4 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-aetherial-blue-500 transition duration-200"
            />
          </div>

          {/* Filter Dropdown (only relevant for Transactions view) */}
          <div className="relative flex-shrink-0">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={state.filterType}
              onChange={handleFilterChange}
              disabled={state.currentView !== 'transactions'}
              className={`w-full md:w-48 py-3 pl-10 pr-4 bg-gray-800 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:border-aetherial-blue-500 transition duration-200 ${state.currentView !== 'transactions' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value="All">All Types</option>
              <option value="Transfer">Transfer</option>
              <option value="Contract Call">Contract Call</option>
              <option value="Deployment">Deployment</option>
              <option value="DeFi Swap">DeFi Swap (AI/DeFi Integration)</option>
            </select>
          </div>
        </div>

        {/* View Tabs (Responsive Design) */}
        <div className="flex flex-wrap bg-gray-800 p-1 rounded-lg shadow-inner">
          {['blocks', 'transactions', 'contracts', 'visualization'].map(view => (
            <button
              key={view}
              onClick={() => handleViewChange(view as ExplorerState['currentView'])}
              className={`flex-1 py-2 px-4 text-sm font-semibold capitalize rounded-lg transition duration-200 ${
                state.currentView === view
                  ? 'bg-aetherial-blue-500 text-white shadow-md'
                  : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              {view.replace('visualization', '4D Visualization')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="bg-gray-800 p-6 rounded-xl shadow-2xl">
        {renderContent()}
      </main>

      {/* Footer/AI Integration Note */}
      <footer className="mt-8 text-center text-xs text-gray-500">
        Powered by AETHERIAL Network. Data is processed and analyzed by the integrated AI Engine for enhanced insights.
      </footer>
    </div>
  );
};

// --- 6. Export Default ---
export default BlockchainExplorer;