import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Filter, Grid, List, Zap, DollarSign, Lock, Star, ChevronDown, ChevronUp } from 'lucide-react';

// --- 1. Full TypeScript interfaces and types ---

/**
 * Defines the structure for an individual AI Tool.
 * Includes AETHERIAL-specific enhancements like blockchain and DeFi integration status.
 */
interface IAITool {
  id: string;
  name: string;
  description: string;
  category: 'Content Creation' | 'Coding' | 'Design' | 'Data Analysis' | 'Marketing' | 'Finance/DeFi' | 'Security/Blockchain' | 'Utility';
  tags: string[];
  isFeatured: boolean;
  accessLink: string;
  // AETHERIAL Unique Enhancements
  blockchainIntegrated: boolean; // Tool leverages a smart contract or decentralized storage
  defiReady: boolean; // Tool is directly applicable to decentralized finance use cases
  aiModel: string; // The underlying AI model used (e.g., GPT-4, Llama 3, Custom Aetherial AI)
}

/**
 * Defines the props for the AIToolsHubPage component.
 */
interface AIToolsHubPageProps {
  initialTools?: IAITool[];
}

// --- 3. Sample data (in production would fetch from API) ---

const ALL_CATEGORIES = [
  'Content Creation',
  'Coding',
  'Design',
  'Data Analysis',
  'Marketing',
  'Finance/DeFi',
  'Security/Blockchain',
  'Utility',
] as const;

const SAMPLE_TOOLS: IAITool[] = [
  // Featured Tools (AETHERIAL Enhanced)
  { id: 't01', name: 'Aetherial Smart-Contract Auditor', description: 'AI-powered security analysis for Solidity and Vyper smart contracts. Blockchain-native.', category: 'Security/Blockchain', tags: ['Audit', 'Solidity', 'Security', 'DeFi'], isFeatured: true, accessLink: '/tools/auditor', blockchainIntegrated: true, defiReady: true, aiModel: 'Aetherial-Secure-v2' },
  { id: 't02', name: 'DeFi Portfolio Optimizer AI', description: 'Uses predictive AI to rebalance and optimize DeFi LP and staking positions.', category: 'Finance/DeFi', tags: ['Yield', 'LP', 'Strategy', 'Prediction'], isFeatured: true, accessLink: '/tools/defi-opt', blockchainIntegrated: true, defiReady: true, aiModel: 'Aetherial-Finance-v1' },
  { id: 't03', name: 'Quantum Code Assistant', description: 'Generates secure, optimized code snippets in multiple languages, with a focus on web3.', category: 'Coding', tags: ['Web3', 'Code Gen', 'TypeScript', 'Rust'], isFeatured: true, accessLink: '/tools/code-ai', blockchainIntegrated: false, defiReady: false, aiModel: 'Aetherial-Code-v3' },
  { id: 't04', name: 'BuddyBoss Content Generator', description: 'Creates engaging social media posts, articles, and course content tailored for the BuddyBoss-style community.', category: 'Content Creation', tags: ['Social', 'Community', 'Article', 'Course'], isFeatured: true, accessLink: '/tools/content-gen', blockchainIntegrated: false, defiReady: false, aiModel: 'GPT-4o' },
  // 50+ Tools (mix of categories)
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `t${i + 5}`,
    name: `AI Tool ${i + 5} - ${['Pro', 'Lite', 'Beta'][i % 3]}`,
    description: `A versatile AI tool for ${['automating tasks', 'generating visuals', 'analyzing data', 'writing reports', 'managing finances'][i % 5]}.`,
    category: ALL_CATEGORIES[i % ALL_CATEGORIES.length],
    tags: [`tag${i % 4}`, `core-ai`, ALL_CATEGORIES[i % ALL_CATEGORIES.length].toLowerCase().replace(/ /g, '-')],
    isFeatured: i % 10 === 0,
    accessLink: `/tools/tool-${i + 5}`,
    blockchainIntegrated: i % 7 === 0,
    defiReady: i % 11 === 0,
    aiModel: ['GPT-3.5', 'Llama 3', 'Mistral', 'Aetherial-Lite'][i % 4],
  })),
];

// --- Sub-Components for UI structure ---

/**
 * Tool Card Component (BuddyBoss-style look and feel)
 */
const AIToolCard: React.FC<{ tool: IAITool }> = ({ tool }) => {
  // Determine color based on category for a BuddyBoss-style visual cue
  const categoryColor = {
    'Content Creation': 'bg-blue-100 text-blue-800',
    'Coding': 'bg-green-100 text-green-800',
    'Design': 'bg-purple-100 text-purple-800',
    'Data Analysis': 'bg-yellow-100 text-yellow-800',
    'Marketing': 'bg-pink-100 text-pink-800',
    'Finance/DeFi': 'bg-indigo-100 text-indigo-800',
    'Security/Blockchain': 'bg-red-100 text-red-800',
    'Utility': 'bg-gray-100 text-gray-800',
  }[tool.category];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900">{tool.name}</h3>
        {tool.isFeatured && (
          <span className="flex items-center text-sm font-semibold text-yellow-600 bg-yellow-50 rounded-full px-3 py-1">
            <Star className="w-4 h-4 mr-1 fill-yellow-400" /> Featured
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-4 flex-grow">{tool.description}</p>
      
      {/* Category and Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${categoryColor}`}>
          {tool.category}
        </span>
        {tool.tags.slice(0, 2).map(tag => (
          <span key={tag} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {tag}
          </span>
        ))}
      </div>

      {/* AETHERIAL Enhancements */}
      <div className="flex space-x-4 border-t border-gray-100 pt-3 mt-auto">
        <div className="flex items-center text-xs font-medium" title="Blockchain Integration Status">
          <Lock className={`w-4 h-4 mr-1 ${tool.blockchainIntegrated ? 'text-green-500' : 'text-gray-400'}`} />
          <span className={tool.blockchainIntegrated ? 'text-green-600' : 'text-gray-500'}>
            {tool.blockchainIntegrated ? 'Blockchain' : 'Centralized'}
          </span>
        </div>
        <div className="flex items-center text-xs font-medium" title="DeFi Ready Status">
          <DollarSign className={`w-4 h-4 mr-1 ${tool.defiReady ? 'text-indigo-500' : 'text-gray-400'}`} />
          <span className={tool.defiReady ? 'text-indigo-600' : 'text-gray-500'}>
            {tool.defiReady ? 'DeFi Ready' : 'Standard'}
          </span>
        </div>
      </div>

      {/* Quick Access Button */}
      <a
        href={tool.accessLink}
        className="mt-4 w-full text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-semibold"
      >
        Quick Access <Zap className="w-4 h-4 inline-block ml-1" />
      </a>
    </div>
  );
};

// --- 4 & 5. Core Component and Interactive Features ---

/**
 * The main AI Tools Hub Page component.
 * Features: Search, Category Filter, Featured Toggle, Responsive Grid/List View.
 */
const AIToolsHubPage: React.FC<AIToolsHubPageProps> = ({ initialTools = SAMPLE_TOOLS }) => {
  // --- State Management ---
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Responsive design consideration
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // For mobile responsiveness

  // --- Filtering Logic (useMemo for performance) ---
  const filteredTools = useMemo(() => {
    let tools = initialTools;

    // 1. Filter by Featured status
    if (showFeaturedOnly) {
      tools = tools.filter(tool => tool.isFeatured);
    }

    // 2. Filter by Category
    if (selectedCategory !== 'All') {
      tools = tools.filter(tool => tool.category === selectedCategory);
    }

    // 3. Filter by Search Term
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      tools = tools.filter(tool =>
        tool.name.toLowerCase().includes(lowerCaseSearch) ||
        tool.description.toLowerCase().includes(lowerCaseSearch) ||
        tool.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearch))
      );
    }

    return tools;
  }, [initialTools, searchTerm, selectedCategory, showFeaturedOnly]);

  // --- Event Handlers ---
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  }, []);

  const toggleFeatured = useCallback(() => {
    setShowFeaturedOnly(prev => !prev);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // --- UI Structure ---

  // Sidebar/Filter Panel
  const FilterSidebar = (
    <div className={`w-full md:w-64 p-4 bg-white md:bg-transparent border-r md:border-r-0 fixed md:static inset-y-0 left-0 z-20 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto`}>
      <h4 className="text-lg font-semibold mb-4 text-gray-800">Filter Tools</h4>
      
      {/* Close button for mobile */}
      <button
        className="absolute top-4 right-4 md:hidden text-gray-500 hover:text-gray-700"
        onClick={toggleSidebar}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      {/* Featured Toggle Button */}
      <button
        onClick={toggleFeatured}
        className={`w-full flex items-center justify-center px-4 py-2 mb-4 rounded-lg transition-colors duration-200 ${
          showFeaturedOnly ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } font-medium`}
      >
        <Star className="w-5 h-5 mr-2" fill={showFeaturedOnly ? 'white' : 'currentColor'} />
        {showFeaturedOnly ? 'Showing Featured' : 'Show Featured Only'}
      </button>

      {/* Category Filter */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-600 uppercase mb-2">Categories</h5>
        {['All', ...ALL_CATEGORIES].map(category => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-150 ${
              selectedCategory === category ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {category}
            {category === selectedCategory && <span className="float-right text-xs">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );

  // Tools List/Grid View
  const ToolsContent = (
    <div className="flex-grow p-4 md:p-8 bg-gray-50">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 md:mb-0">
          AI Tools Hub <span className="text-indigo-600 text-2xl">({filteredTools.length})</span>
        </h1>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tools, tags, or features..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            />
          </div>
          
          {/* View Mode Toggle */}
          <div className="hidden sm:flex space-x-1 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:bg-gray-200'}`}
              title="Grid View"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:bg-gray-200'}`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Filter Button */}
          <button
            className="md:hidden p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={toggleSidebar}
            title="Open Filters"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tools Display */}
      {filteredTools.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {filteredTools.map(tool => (
            <AIToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl shadow-lg">
          <Zap className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">No AI Tools Found</h3>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your filters or search term.
          </p>
        </div>
      )}
    </div>
  );

  return (
    // Main Hub Container - BuddyBoss-style full-width layout
    <div className="min-h-screen flex">
      {/* Sidebar (Desktop) */}
      <div className="hidden md:block">
        {FilterSidebar}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      <div className="md:hidden">
        {FilterSidebar}
      </div>

      {/* Main Content Area */}
      {ToolsContent}
    </div>
  );
};

// --- 7. Export default at the end ---
export default AIToolsHubPage;