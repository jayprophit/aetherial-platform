import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AETHERIAL AI
            </span>
          </div>
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-6 py-2 text-gray-700 hover:text-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            The Future of AI-Powered Platforms
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Unite social networking, e-commerce, e-learning, and quantum AI in one revolutionary platform.
            Built with Sanskrit wisdom and cutting-edge technology.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-lg font-semibold hover:shadow-xl transition transform hover:scale-105"
            >
              Start Free Trial
            </Link>
            <a
              href="#features"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-8 max-w-4xl mx-auto mb-20">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">850+</div>
            <div className="text-gray-600">Features</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
            <div className="text-gray-600">Offline Capable</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-600 mb-2">42</div>
            <div className="text-gray-600">Blockchain Types</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">∞</div>
            <div className="text-gray-600">Context Window</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Everything You Need in One Platform
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Social Networking */}
            <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold mb-4">Social Networking</h3>
              <p className="text-gray-600 mb-4">
                BuddyBoss-style features with activity feeds, groups, events, forums, and live streaming.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Activity Feed & Posts</li>
                <li>✓ Events & Calendar</li>
                <li>✓ Forums & Discussions</li>
                <li>✓ Media Gallery</li>
              </ul>
            </div>

            {/* E-Commerce */}
            <div className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-2xl font-bold mb-4">E-Commerce</h3>
              <p className="text-gray-600 mb-4">
                Amazon-style marketplace with advanced product features, reviews, and vendor dashboards.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Product Marketplace</li>
                <li>✓ Shopping Cart & Wishlist</li>
                <li>✓ Reviews & Ratings</li>
                <li>✓ Order Tracking</li>
              </ul>
            </div>

            {/* E-Learning */}
            <div className="p-8 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold mb-4">E-Learning</h3>
              <p className="text-gray-600 mb-4">
                Udemy-style courses with certificates, live classes, and progress tracking.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Online Courses</li>
                <li>✓ Live Classes</li>
                <li>✓ Certificates</li>
                <li>✓ Progress Tracking</li>
              </ul>
            </div>

            {/* AI Assistant */}
            <div className="p-8 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-4">AI Assistant</h3>
              <p className="text-gray-600 mb-4">
                Self-learning AI with GPT-4o, Claude, and custom models. Quantum-enhanced processing.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Multi-Model AI</li>
                <li>✓ Self-Learning</li>
                <li>✓ Quantum Computing</li>
                <li>✓ Offline Capable</li>
              </ul>
            </div>

            {/* Blog Platform */}
            <div className="p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">✍️</div>
              <h3 className="text-2xl font-bold mb-4">Blog Platform</h3>
              <p className="text-gray-600 mb-4">
                Medium-style blogging with rich editor, claps, and author profiles.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Rich Text Editor</li>
                <li>✓ Claps & Reactions</li>
                <li>✓ Follow Authors</li>
                <li>✓ Reading Lists</li>
              </ul>
            </div>

            {/* Gamification */}
            <div className="p-8 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-4">Gamification</h3>
              <p className="text-gray-600 mb-4">
                GamiPress-style points, badges, achievements, and leaderboards.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Points & Rewards</li>
                <li>✓ Achievements</li>
                <li>✓ Leaderboards</li>
                <li>✓ Challenges</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Unique Features */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            What Makes Us Unique
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🕉️</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Sanskrit-English Interface</h3>
                <p className="text-gray-600">Ancient wisdom meets modern technology with dual-language support.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-3xl">⚛️</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Virtual Quantum Computing</h3>
                <p className="text-gray-600">Simulate Willow, Condor, Majorana, and other quantum chips virtually.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🔒</div>
              <div>
                <h3 className="text-xl font-bold mb-2">100% Self-Sufficient</h3>
                <p className="text-gray-600">Works completely offline with no mandatory external dependencies.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-3xl">🧠</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Self-Learning AI</h3>
                <p className="text-gray-600">Learns from every interaction and improves continuously.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users already building on AETHERIAL AI
          </p>
          <Link
            to="/register"
            className="inline-block px-12 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:shadow-2xl transition transform hover:scale-105"
          >
            Get Started Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#docs" className="hover:text-white transition">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white transition">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><a href="#careers" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
                <li><a href="#blog" className="hover:text-white transition">Blog</a></li>
                <li><a href="#support" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/terms" className="hover:text-white transition">Terms</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link to="/cookies" className="hover:text-white transition">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>&copy; 2025 AETHERIAL AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

