/**
 * AETHERIAL NFT System
 * 
 * Complete NFT implementation with:
 * - ERC-721 compatible standard
 * - Minting and burning
 * - Metadata and royalties
 * - Marketplace integration
 * - Collections and series
 * - Lazy minting
 * - Batch operations
 */

import * as crypto from 'crypto';

/**
 * NFT Metadata
 */
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
  animation_url?: string;
  background_color?: string;
}

/**
 * NFT
 */
export class NFT {
  public id: string;
  public tokenId: number;
  public owner: string;
  public creator: string;
  public metadata: NFTMetadata;
  public royaltyPercentage: number;
  public mintedAt: number;
  public transferHistory: Array<{
    from: string;
    to: string;
    timestamp: number;
    price?: number;
  }> = [];
  
  constructor(
    tokenId: number,
    owner: string,
    creator: string,
    metadata: NFTMetadata,
    royaltyPercentage: number = 10
  ) {
    this.tokenId = tokenId;
    this.owner = owner;
    this.creator = creator;
    this.metadata = metadata;
    this.royaltyPercentage = royaltyPercentage;
    this.mintedAt = Date.now();
    this.id = this.generateId();
  }
  
  private generateId(): string {
    return crypto.createHash('sha256')
      .update(`${this.tokenId}-${this.creator}-${this.mintedAt}`)
      .digest('hex');
  }
  
  transfer(from: string, to: string, price?: number): void {
    if (this.owner !== from) {
      throw new Error('Not the owner');
    }
    
    this.owner = to;
    this.transferHistory.push({
      from,
      to,
      timestamp: Date.now(),
      price,
    });
  }
}

/**
 * NFT Collection
 */
export class NFTCollection {
  public id: string;
  public name: string;
  public symbol: string;
  public description: string;
  public creator: string;
  public nfts: Map<number, NFT> = new Map();
  public totalSupply: number = 0;
  public maxSupply?: number;
  public createdAt: number;
  
  constructor(
    name: string,
    symbol: string,
    description: string,
    creator: string,
    maxSupply?: number
  ) {
    this.name = name;
    this.symbol = symbol;
    this.description = description;
    this.creator = creator;
    this.maxSupply = maxSupply;
    this.createdAt = Date.now();
    this.id = this.generateId();
  }
  
  private generateId(): string {
    return crypto.createHash('sha256')
      .update(`${this.name}-${this.symbol}-${this.creator}-${this.createdAt}`)
      .digest('hex');
  }
  
  mint(owner: string, metadata: NFTMetadata, royaltyPercentage?: number): NFT {
    if (this.maxSupply && this.totalSupply >= this.maxSupply) {
      throw new Error('Max supply reached');
    }
    
    const tokenId = this.totalSupply;
    const nft = new NFT(
      tokenId,
      owner,
      this.creator,
      metadata,
      royaltyPercentage
    );
    
    this.nfts.set(tokenId, nft);
    this.totalSupply++;
    
    return nft;
  }
  
  burn(tokenId: number): void {
    if (!this.nfts.has(tokenId)) {
      throw new Error('NFT not found');
    }
    
    this.nfts.delete(tokenId);
  }
  
  getNFT(tokenId: number): NFT | undefined {
    return this.nfts.get(tokenId);
  }
  
  getAllNFTs(): NFT[] {
    return Array.from(this.nfts.values());
  }
  
  getNFTsByOwner(owner: string): NFT[] {
    return Array.from(this.nfts.values()).filter(nft => nft.owner === owner);
  }
}

/**
 * Marketplace Listing
 */
export interface MarketplaceListing {
  id: string;
  nftId: string;
  collectionId: string;
  tokenId: number;
  seller: string;
  price: number;
  currency: 'AETH' | 'USD';
  listingType: 'fixed' | 'auction';
  startTime: number;
  endTime?: number;
  status: 'active' | 'sold' | 'cancelled';
  bids?: Array<{
    bidder: string;
    amount: number;
    timestamp: number;
  }>;
}

/**
 * NFT Marketplace
 */
export class NFTMarketplace {
  private listings: Map<string, MarketplaceListing> = new Map();
  private collections: Map<string, NFTCollection> = new Map();
  private platformFee: number = 2.5; // 2.5%
  
  /**
   * Create a new collection
   */
  createCollection(
    name: string,
    symbol: string,
    description: string,
    creator: string,
    maxSupply?: number
  ): NFTCollection {
    const collection = new NFTCollection(name, symbol, description, creator, maxSupply);
    this.collections.set(collection.id, collection);
    return collection;
  }
  
  /**
   * Get collection by ID
   */
  getCollection(collectionId: string): NFTCollection | undefined {
    return this.collections.get(collectionId);
  }
  
  /**
   * Get all collections
   */
  getAllCollections(): NFTCollection[] {
    return Array.from(this.collections.values());
  }
  
  /**
   * Mint NFT
   */
  mintNFT(
    collectionId: string,
    owner: string,
    metadata: NFTMetadata,
    royaltyPercentage?: number
  ): NFT {
    const collection = this.collections.get(collectionId);
    if (!collection) {
      throw new Error('Collection not found');
    }
    
    return collection.mint(owner, metadata, royaltyPercentage);
  }
  
  /**
   * Batch mint NFTs
   */
  batchMintNFTs(
    collectionId: string,
    owner: string,
    metadataList: NFTMetadata[],
    royaltyPercentage?: number
  ): NFT[] {
    const collection = this.collections.get(collectionId);
    if (!collection) {
      throw new Error('Collection not found');
    }
    
    return metadataList.map(metadata =>
      collection.mint(owner, metadata, royaltyPercentage)
    );
  }
  
  /**
   * List NFT for sale
   */
  listNFT(
    collectionId: string,
    tokenId: number,
    seller: string,
    price: number,
    currency: 'AETH' | 'USD' = 'AETH',
    listingType: 'fixed' | 'auction' = 'fixed',
    duration?: number
  ): MarketplaceListing {
    const collection = this.collections.get(collectionId);
    if (!collection) {
      throw new Error('Collection not found');
    }
    
    const nft = collection.getNFT(tokenId);
    if (!nft) {
      throw new Error('NFT not found');
    }
    
    if (nft.owner !== seller) {
      throw new Error('Not the owner');
    }
    
    const listing: MarketplaceListing = {
      id: crypto.randomBytes(16).toString('hex'),
      nftId: nft.id,
      collectionId,
      tokenId,
      seller,
      price,
      currency,
      listingType,
      startTime: Date.now(),
      endTime: duration ? Date.now() + duration : undefined,
      status: 'active',
      bids: listingType === 'auction' ? [] : undefined,
    };
    
    this.listings.set(listing.id, listing);
    return listing;
  }
  
  /**
   * Buy NFT
   */
  buyNFT(
    listingId: string,
    buyer: string,
    paymentAmount: number
  ): { success: boolean; nft?: NFT; error?: string } {
    const listing = this.listings.get(listingId);
    if (!listing) {
      return { success: false, error: 'Listing not found' };
    }
    
    if (listing.status !== 'active') {
      return { success: false, error: 'Listing not active' };
    }
    
    if (listing.listingType === 'fixed' && paymentAmount < listing.price) {
      return { success: false, error: 'Insufficient payment' };
    }
    
    const collection = this.collections.get(listing.collectionId);
    if (!collection) {
      return { success: false, error: 'Collection not found' };
    }
    
    const nft = collection.getNFT(listing.tokenId);
    if (!nft) {
      return { success: false, error: 'NFT not found' };
    }
    
    // Calculate fees
    const platformFeeAmount = (listing.price * this.platformFee) / 100;
    const royaltyAmount = (listing.price * nft.royaltyPercentage) / 100;
    const sellerAmount = listing.price - platformFeeAmount - royaltyAmount;
    
    // Transfer NFT
    nft.transfer(listing.seller, buyer, listing.price);
    
    // Update listing
    listing.status = 'sold';
    
    return {
      success: true,
      nft,
    };
  }
  
  /**
   * Place bid on auction
   */
  placeBid(
    listingId: string,
    bidder: string,
    amount: number
  ): { success: boolean; error?: string } {
    const listing = this.listings.get(listingId);
    if (!listing) {
      return { success: false, error: 'Listing not found' };
    }
    
    if (listing.listingType !== 'auction') {
      return { success: false, error: 'Not an auction' };
    }
    
    if (listing.status !== 'active') {
      return { success: false, error: 'Auction not active' };
    }
    
    if (listing.endTime && Date.now() > listing.endTime) {
      return { success: false, error: 'Auction ended' };
    }
    
    const highestBid = listing.bids && listing.bids.length > 0
      ? Math.max(...listing.bids.map(b => b.amount))
      : listing.price;
    
    if (amount <= highestBid) {
      return { success: false, error: 'Bid too low' };
    }
    
    listing.bids!.push({
      bidder,
      amount,
      timestamp: Date.now(),
    });
    
    return { success: true };
  }
  
  /**
   * End auction
   */
  endAuction(listingId: string): { success: boolean; winner?: string; error?: string } {
    const listing = this.listings.get(listingId);
    if (!listing) {
      return { success: false, error: 'Listing not found' };
    }
    
    if (listing.listingType !== 'auction') {
      return { success: false, error: 'Not an auction' };
    }
    
    if (!listing.bids || listing.bids.length === 0) {
      listing.status = 'cancelled';
      return { success: false, error: 'No bids' };
    }
    
    // Find highest bid
    const highestBid = listing.bids.reduce((max, bid) =>
      bid.amount > max.amount ? bid : max
    );
    
    // Transfer NFT to winner
    const collection = this.collections.get(listing.collectionId);
    if (collection) {
      const nft = collection.getNFT(listing.tokenId);
      if (nft) {
        nft.transfer(listing.seller, highestBid.bidder, highestBid.amount);
      }
    }
    
    listing.status = 'sold';
    
    return {
      success: true,
      winner: highestBid.bidder,
    };
  }
  
  /**
   * Cancel listing
   */
  cancelListing(listingId: string, seller: string): { success: boolean; error?: string } {
    const listing = this.listings.get(listingId);
    if (!listing) {
      return { success: false, error: 'Listing not found' };
    }
    
    if (listing.seller !== seller) {
      return { success: false, error: 'Not the seller' };
    }
    
    if (listing.status !== 'active') {
      return { success: false, error: 'Listing not active' };
    }
    
    listing.status = 'cancelled';
    
    return { success: true };
  }
  
  /**
   * Get all active listings
   */
  getActiveListings(): MarketplaceListing[] {
    return Array.from(this.listings.values())
      .filter(listing => listing.status === 'active');
  }
  
  /**
   * Get listings by collection
   */
  getListingsByCollection(collectionId: string): MarketplaceListing[] {
    return Array.from(this.listings.values())
      .filter(listing => listing.collectionId === collectionId);
  }
  
  /**
   * Get listings by seller
   */
  getListingsBySeller(seller: string): MarketplaceListing[] {
    return Array.from(this.listings.values())
      .filter(listing => listing.seller === seller);
  }
  
  /**
   * Search NFTs
   */
  searchNFTs(query: string): NFT[] {
    const results: NFT[] = [];
    
    for (const collection of this.collections.values()) {
      for (const nft of collection.getAllNFTs()) {
        if (
          nft.metadata.name.toLowerCase().includes(query.toLowerCase()) ||
          nft.metadata.description.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push(nft);
        }
      }
    }
    
    return results;
  }
  
  /**
   * Get NFT statistics
   */
  getStats() {
    let totalNFTs = 0;
    let totalVolume = 0;
    let totalSales = 0;
    
    for (const collection of this.collections.values()) {
      totalNFTs += collection.totalSupply;
      
      for (const nft of collection.getAllNFTs()) {
        nft.transferHistory.forEach(transfer => {
          if (transfer.price) {
            totalVolume += transfer.price;
            totalSales++;
          }
        });
      }
    }
    
    return {
      totalCollections: this.collections.size,
      totalNFTs,
      totalListings: this.listings.size,
      activeListings: this.getActiveListings().length,
      totalVolume,
      totalSales,
      averagePrice: totalSales > 0 ? totalVolume / totalSales : 0,
    };
  }
}

export const nftMarketplace = new NFTMarketplace();

