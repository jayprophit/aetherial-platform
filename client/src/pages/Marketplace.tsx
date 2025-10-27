import { useState } from 'react';
import { ShoppingCart, Search, Filter, Star, Heart, TrendingUp } from 'lucide-react';

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Books'];
  
  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: (Math.random() * 100 + 10).toFixed(2),
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 500),
    image: `https://api.dicebear.com/7.x/shapes/svg?seed=product${i}`,
    seller: `Seller ${i + 1}`,
    badge: i < 3 ? 'Trending' : null,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-green-600" />
              Marketplace
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Discover amazing products</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg">
            Sell Product
          </button>
        </div>

        <div className="flex gap-4 mt-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700 flex overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat.toLowerCase())}
              className={`px-6 py-4 font-medium border-b-2 whitespace-nowrap ${
                activeCategory === cat.toLowerCase() ? 'border-green-600 text-green-600' : 'border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition relative">
              {product.badge && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {product.badge}
                </div>
              )}
              <button className="absolute top-2 left-2 p-2 bg-white rounded-full hover:bg-gray-100">
                <Heart className="w-4 h-4" />
              </button>
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{product.seller}</p>
              <div className="flex items-center gap-1 mt-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-gray-500">({product.reviews})</span>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xl font-bold text-green-600">${product.price}</span>
                <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
