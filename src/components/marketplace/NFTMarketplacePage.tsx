import React, { useState, useEffect, useMemo, useCallback } from 'react';

// =============================================================================
// 1. TypeScript Interfaces and Types
// =============================================================================

/**
 * Defines the structure for an NFT.
 * Includes blockchain-specific details and AETHERIAL-specific enhancements.
 */
interface NFT {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  collection: string;
  ownerAddress: string;
  currentPrice: number; // In ETH or equivalent
  currency: 'ETH' | 'AETH' | 'USD';
  lastSalePrice: number;
  isForSale: boolean;
  // Blockchain Integration
  tokenId: string;
  contractAddress: string;
  blockchain: 'Ethereum' | 'Polygon' | 'AETHERIAL_Chain';
  // AETHERIAL Unique Enhancements (AI, DeFi)
  ai_score: number; // AI-generated rarity/quality score (0-100)
  defi_stake_apy: number; // Potential APY if NFT is staked in a DeFi pool
}

/**
 * Defines the structure for an NFT Collection.
 */
interface Collection {
  id: string;
  name: string;
  description: string;
  floorPrice: number;
  totalVolume: number;
  itemCount: number;
  imageUrl: string;
}

/**
 * Defines the structure for the component's state.
 */
interface MarketplaceState {
  nfts: NFT[];
  collections: Collection[];
  loading: boolean;
  error: string | null;
}

/**
 * Defines the structure for the marketplace filters.
 */
interface Filters {
  searchQuery: string;
  collectionFilter: string;
  priceRange: [number, number];
  sortBy: 'price_asc' | 'price_desc' | 'ai_score_desc' | 'newest';
  isForSaleOnly: boolean;
}

// =============================================================================
// 2. Sample Data (Simulating API Fetch)
// =============================================================================

const SAMPLE_COLLECTIONS: Collection[] = [
  { id: 'c1', name: 'Aetherial Genesis', description: 'The first collection on AETHERIAL.', floorPrice: 1.2, totalVolume: 500, itemCount: 1000, imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=AG' },
  { id: 'c2', name: 'Cybernetic Dreams', description: 'AI-generated futuristic art.', floorPrice: 0.5, totalVolume: 200, itemCount: 500, imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=CD' },
  { id: 'c3', name: 'BuddyBoss Legacy', description: 'Social integration utility NFTs.', floorPrice: 0.1, totalVolume: 50, itemCount: 2000, imageUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=BL' },
];

const SAMPLE_NFTS: NFT[] = [
  {
    id: 'n1', name: 'Aetherial #001', description: 'Rare item with high AI score.', imageUrl: 'https://via.placeholder.com/300/0000FF/FFFFFF?text=NFT+1',
    collection: 'Aetherial Genesis', ownerAddress: '0x123...abc', currentPrice: 1.5, currency: 'ETH', lastSalePrice: 1.3, isForSale: true,
    tokenId: '1001', contractAddress: '0xNFT...AG', blockchain: 'AETHERIAL_Chain', ai_score: 95, defi_stake_apy: 12.5
  },
  {
    id: 'n2', name: 'Dream Weaver', description: 'A piece of digital consciousness.', imageUrl: 'https://via.placeholder.com/300/FF0000/FFFFFF?text=NFT+2',
    collection: 'Cybernetic Dreams', ownerAddress: '0x456...def', currentPrice: 0.45, currency: 'ETH', lastSalePrice: 0.5, isForSale: true,
    tokenId: '2002', contractAddress: '0xNFT...CD', blockchain: 'Ethereum', ai_score: 78, defi_stake_apy: 8.0
  },
  {
    id: 'n3', name: 'Socialite Badge', description: 'Grants access to VIP social features.', imageUrl: 'https://via.placeholder.com/300/00FF00/FFFFFF?text=NFT+3',
    collection: 'BuddyBoss Legacy', ownerAddress: '0x789...ghi', currentPrice: 0.15, currency: 'ETH', lastSalePrice: 0.1, isForSale: false,
    tokenId: '3003', contractAddress: '0xNFT...BL', blockchain: 'Polygon', ai_score: 55, defi_stake_apy: 5.0
  },
  {
    id: 'n4', name: 'Aetherial #002', description: 'Another item from the Genesis collection.', imageUrl: 'https://via.placeholder.com/300/0000FF/FFFFFF?text=NFT+4',
    collection: 'Aetherial Genesis', ownerAddress: '0xabc...jkl', currentPrice: 2.1, currency: 'ETH', lastSalePrice: 1.8, isForSale: true,
    tokenId: '1002', contractAddress: '0xNFT...AG', blockchain: 'AETHERIAL_Chain', ai_score: 88, defi_stake_apy: 15.0
  },
];

// =============================================================================
// 3. Helper Components
// =============================================================================

/**
 * Renders a single NFT card.
 * @param nft The NFT data.
 * @param onBuy A callback function for the buy action.
 * (Note: Tailwind CSS classes are used for styling, assuming a project setup with Tailwind)
 */
const NFTCard: React.FC<{ nft: NFT; onBuy: (nft: NFT) => void }> = ({ nft, onBuy }) => {
  return (
    <div className="nft-card p-4 border rounded-lg shadow-lg bg-white transition duration-300 hover:shadow-xl">
      <img src={nft.imageUrl} alt={nft.name} className="w-full h-48 object-cover rounded-md mb-4" />
      <h3 className="text-xl font-semibold truncate">{nft.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{nft.collection}</p>
      
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-lg font-bold text-indigo-600">
            {nft.currentPrice} {nft.currency}
          </p>
          {/* AETHERIAL Enhancement: AI Score for Rarity/Quality */}
          <p className="text-xs text-gray-400">AI Score: {nft.ai_score}/100</p>
        </div>
        <div className="text-right">
          {/* AETHERIAL Enhancement: DeFi Staking APY */}
          <p className="text-sm text-green-600 font-medium">
            Stake APY: {nft.defi_stake_apy}%
          </p>
          {/* Blockchain Integration Detail */}
          <p className="text-xs text-gray-400">Blockchain: {nft.blockchain}</p>
        </div>
      </div>
      
      {nft.isForSale ? (
        <button
          onClick={() => onBuy(nft)}
          className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition duration-150"
        >
          Buy Now
        </button>
      ) : (
        <button
          disabled
          className="w-full bg-gray-300 text-gray-600 py-2 rounded-md font-semibold cursor-not-allowed"
        >
          Not For Sale
        </button>
      )}
    </div>
  );
};

// =============================================================================
// 4. Main Component: NFTMarketplacePage
// =============================================================================

const NFTMarketplacePage: React.FC = () => {
  // State management for the marketplace data
  const [state, setState] = useState<MarketplaceState>({
    nfts: [],
    collections: [],
    loading: true,
    error: null,
  });

  // State management for filters and user interaction
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    collectionFilter: 'all',
    priceRange: [0, 10], // Default max price for sample data
    sortBy: 'ai_score_desc',
    isForSaleOnly: true,
  });

  // useEffect for simulating data fetching (replaces an actual API call)
  useEffect(() => {
    // In a production environment, this would fetch from an API (e.g., axios.get('/api/nfts'))
    const fetchData = () => {
      try {
        // Simulate network delay
        setTimeout(() => {
          setState({
            nfts: SAMPLE_NFTS,
            collections: SAMPLE_COLLECTIONS,
            loading: false,
            error: null,
          });
        }, 500);
      } catch (e) {
        // Handle API errors
        setState(s => ({ ...s, loading: false, error: 'Failed to fetch marketplace data.' }));
      }
    };
    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Handles changes to the filter state.
   * Uses useCallback for performance optimization.
   */
  const handleFilterChange = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  /**
   * Logic for filtering and sorting the NFTs.
   * Uses useMemo to cache the result and only re-calculate when state/filters change.
   */
  const filteredAndSortedNFTs = useMemo(() => {
    if (state.loading) return [];

    let result = [...state.nfts];

    // 1. Filter by For Sale status
    if (filters.isForSaleOnly) {
      result = result.filter(nft => nft.isForSale);
    }

    // 2. Filter by Search Query (Name or Description)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(nft =>
        nft.name.toLowerCase().includes(query) ||
        nft.description.toLowerCase().includes(query)
      );
    }

    // 3. Filter by Collection
    if (filters.collectionFilter !== 'all') {
      result = result.filter(nft => nft.collection === filters.collectionFilter);
    }

    // 4. Filter by Price Range
    const [minPrice, maxPrice] = filters.priceRange;
    result = result.filter(nft => nft.currentPrice >= minPrice && nft.currentPrice <= maxPrice);

    // 5. Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return a.currentPrice - b.currentPrice;
        case 'price_desc':
          return b.currentPrice - a.currentPrice;
        case 'ai_score_desc':
          return b.ai_score - a.ai_score;
        case 'newest':
          // Placeholder for 'newest' sort. In production, use a timestamp field.
          return a.id.localeCompare(b.id);
        default:
          return 0;
      }
    });

    return result;
  }, [state.nfts, filters]);

  // Handler for the "Buy Now" action (simulates blockchain interaction)
  const handleBuyNFT = useCallback((nft: NFT) => {
    // This is where the actual blockchain transaction logic would be initiated.
    console.log(`Initiating purchase for NFT: ${nft.name} (${nft.id}) on ${nft.blockchain}`);
    alert(`Simulating purchase of ${nft.name} for ${nft.currentPrice} ${nft.currency}. Blockchain transaction pending...`);
  }, []);

  // Render loading state
  if (state.loading) {
    return (
      <div className="text-center p-10 text-2xl text-indigo-600">
        Loading AETHERIAL NFT Marketplace...
      </div>
    );
  }

  // Render error state
  if (state.error) {
    return (
      <div className="text-center p-10 text-red-600">
        Error: {state.error}
      </div>
    );
  }

  // =============================================================================
  // 5. Interactive UI and Responsive Design (using Tailwind-like classes)
  // =============================================================================

  return (
    <div className="nft-marketplace-page container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 border-b pb-2">
        AETHERIAL NFT Marketplace
      </h1>
      
      {/* Marketplace Overview / Collections Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Collections</h2>
        {/* Responsive grid: 1 column on mobile, 2 on sm, 3 on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.collections.map(collection => (
            <div key={collection.id} className="collection-card p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150 cursor-pointer">
              <div className="flex items-center">
                <img src={collection.imageUrl} alt={collection.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h3 className="text-lg font-semibold">{collection.name}</h3>
                  <p className="text-sm text-gray-600">Floor: {collection.floorPrice} ETH | Items: {collection.itemCount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filters and Search Section */}
      <section className="mb-8 p-4 bg-gray-100 rounded-lg shadow-inner">
        <h2 className="text-xl font-bold mb-3">Browse & Filter</h2>
        {/* Responsive grid for filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search NFTs</label>
            <input
              id="search"
              type="text"
              placeholder="Search by name or description..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Collection Filter */}
          <div>
            <label htmlFor="collection" className="block text-sm font-medium text-gray-700">Collection</label>
            <select
              id="collection"
              value={filters.collectionFilter}
              onChange={(e) => handleFilterChange('collectionFilter', e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Collections</option>
              {state.collections.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700">Sort By</label>
            <select
              id="sort"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value as Filters['sortBy'])}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="ai_score_desc">AI Score (High to Low)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
              <option value="newest">Newest Listings</option>
            </select>
          </div>
        </div>
        
        {/* Additional Filters and BuddyBoss-style Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center mt-4 space-y-3 sm:space-y-0 sm:space-x-6">
            {/* Price Range (Simplified) */}
            <div className="flex-shrink-0">
                <label className="text-sm font-medium text-gray-700 mr-2">Max Price (ETH):</label>
                <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseFloat(e.target.value)])}
                    className="w-20 p-1 border border-gray-300 rounded-md text-sm"
                />
            </div>

            {/* Is For Sale Toggle */}
            <div className="flex items-center">
                <input
                    id="for-sale-only"
                    type="checkbox"
                    checked={filters.isForSaleOnly}
                    onChange={(e) => handleFilterChange('isForSaleOnly', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="for-sale-only" className="ml-2 block text-sm font-medium text-gray-900">
                    Show Only For Sale
                </label>
            </div>
            
            {/* BuddyBoss/Social Integration: Action to list your own NFT */}
            <button
                onClick={() => alert('Redirecting to your wallet/profile to list an NFT...')}
                className="bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-600 transition duration-150 text-sm flex-shrink-0"
            >
                List Your NFT
            </button>
        </div>
      </section>

      {/* NFT Grid Display */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
            Browse NFTs ({filteredAndSortedNFTs.length} Results)
        </h2>
        
        {filteredAndSortedNFTs.length === 0 && (
            <p className="text-center text-gray-500 p-10">No NFTs found matching your criteria.</p>
        )}

        {/* Responsive grid for NFT cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedNFTs.map(nft => (
            <NFTCard key={nft.id} nft={nft} onBuy={handleBuyNFT} />
          ))}
        </div>
      </section>

      {/* AETHERIAL Blockchain/DeFi/AI Footer (Conceptual Integration) */}
      <footer className="mt-10 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>Powered by AETHERIAL Chain and AI Rarity Engine.</p>
        <p>Explore DeFi Staking Pools for increased yield on your digital assets.</p>
        {/* BuddyBoss-style integration: Social sharing */}
        <button className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium">
            Share Marketplace on AETHERIAL Social
        </button>
      </footer>
    </div>
  );
};

export default NFTMarketplacePage;
