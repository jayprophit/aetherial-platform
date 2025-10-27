import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, Star, Heart, TrendingUp, Loader2, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

interface Product {
  id: number;
  sellerId: number;
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  stock: number;
  images: string[];
  rating: string;
  reviewCount: number;
  createdAt: string;
}

export default function Marketplace() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [error, setError] = useState('');

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Other'];

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchCartCount();
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 20 };
      if (activeCategory !== 'all') {
        params.category = activeCategory;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      const data = await api.products.getAll(params);
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const cart = await api.cart.get();
      setCartCount(cart.items?.length || 0);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (!user) {
      setError('Please login to add items to cart');
      return;
    }

    try {
      await api.cart.addItem({ productId, quantity: 1 });
      setCartCount(cartCount + 1);
      setError('');
    } catch (err) {
      setError('Failed to add to cart');
      console.error('Error adding to cart:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800">
              <ShoppingCart className="w-8 h-8 text-green-600" />
              Marketplace
            </h1>
            <p className="text-slate-600 mt-1">Discover amazing products from our community</p>
          </div>
          <div className="flex gap-3">
            {user && (
              <button className="relative px-6 py-3 bg-white border-2 border-slate-200 rounded-lg hover:border-slate-300 transition-colors flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Sell Product
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-4 mt-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            className="px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm mt-3">{error}</p>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200 flex overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat.toLowerCase())}
              className={`px-6 py-4 font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeCategory === cat.toLowerCase()
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No products found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all relative group"
              >
                {/* Trending Badge */}
                {product.rating && parseFloat(product.rating) >= 4.5 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </div>
                )}

                {/* Wishlist Button */}
                <button className="absolute top-2 left-2 p-2 bg-white rounded-full hover:bg-red-50 transition-colors z-10 group-hover:scale-110">
                  <Heart className="w-4 h-4 text-slate-600 hover:text-red-500" />
                </button>

                {/* Product Image */}
                <div className="w-full h-48 bg-slate-100 rounded-lg mb-3 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ShoppingCart className="w-12 h-12" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <h3 className="font-semibold text-slate-800 mb-1 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-slate-700">
                    {product.rating || '0.0'}
                  </span>
                  <span className="text-sm text-slate-500">
                    ({product.reviewCount || 0})
                  </span>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      ${parseFloat(product.price).toFixed(2)}
                    </p>
                    {product.stock > 0 ? (
                      <p className="text-xs text-slate-500">{product.stock} in stock</p>
                    ) : (
                      <p className="text-xs text-red-500">Out of stock</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.stock === 0 || !user}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add
                  </button>
                </div>

                {/* Condition Badge */}
                {product.condition && (
                  <div className="mt-2">
                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                      {product.condition}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

