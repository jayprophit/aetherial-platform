import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FiSearch, FiMail, FiHelpCircle, FiBookOpen, FiExternalLink, FiLock, FiUnlock, FiCpu } from 'react-icons/fi';

// --- 1. Full TypeScript interfaces and types ---

// Represents a single FAQ item
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  tags: string[];
  // AETHERIAL Enhancement: Link to a relevant blockchain transaction or smart contract
  blockchainRef?: string; 
}

// Represents a single Tutorial or Guide
interface TutorialItem {
  id: number;
  title: string;
  description: string;
  link: string;
  category: 'Getting Started' | 'DeFi' | 'AI Integration' | 'Social Features';
  // AETHERIAL Enhancement: Estimated time to complete, potentially linked to a course
  durationMinutes: number;
  isTokenGated: boolean; // Simulation of token-gated content
}

// Represents a single Documentation link
interface DocumentationLink {
  id: number;
  title: string;
  url: string;
  icon: React.ElementType; // Using React.ElementType for icon component
}

// Represents the state of the contact form
interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  // AETHERIAL Enhancement: Option to submit the support request as a verifiable, token-gated ticket
  isTokenGated: boolean; 
}

// Component Props
interface HelpSupportPageProps {
  headerTitle?: string;
}

// --- 3. Sample data (in production would fetch from API) ---

const sampleFaqs: FAQItem[] = [
  {
    id: 1,
    question: "How do I connect my crypto wallet?",
    answer: "To connect your wallet, navigate to the 'Settings' page and look for the 'Wallet Connection' section. We support MetaMask, WalletConnect, and AETHERIAL's native wallet.",
    tags: ["wallet", "crypto", "getting started"],
    blockchainRef: "0xabc123...defi_guide",
  },
  {
    id: 2,
    question: "What are the fees for using the DeFi platform?",
    answer: "Transaction fees are dynamic and depend on network congestion (gas fees). AETHERIAL does not charge platform fees for standard swaps, but a small percentage is taken for liquidity pool staking.",
    tags: ["defi", "fees", "staking"],
    blockchainRef: "0xdef456...fee_structure",
  },
  {
    id: 3,
    question: "Can I use the AI assistant for my course assignments?",
    answer: "The AI assistant is a powerful tool for learning and research. However, please consult your course syllabus regarding the acceptable use of AI for submissions to maintain academic integrity.",
    tags: ["ai", "education", "course"],
  },
  {
    id: 4,
    question: "How do I set up a new social group (BuddyBoss-style)?",
    answer: "Go to the 'Groups' tab in the main navigation, click 'Create Group', and follow the prompts. You can set privacy, invite members, and customize the group's appearance.",
    tags: ["social", "buddyboss", "groups"],
  },
];

const sampleTutorials: TutorialItem[] = [
  {
    id: 101,
    title: "First Steps on AETHERIAL: A Quick Guide",
    description: "Learn the basics of navigating the platform, setting up your profile, and finding your first course.",
    link: "/tutorials/getting-started",
    category: 'Getting Started',
    durationMinutes: 15,
    isTokenGated: false,
  },
  {
    id: 102,
    title: "Advanced Yield Farming Strategies (Token-Gated)",
    description: "Deep dive into complex DeFi strategies, impermanent loss mitigation, and maximizing APY with AETHERIAL's integrated tools.",
    link: "/tutorials/advanced-defi",
    category: 'DeFi',
    durationMinutes: 45,
    isTokenGated: true,
  },
  {
    id: 103,
    title: "Integrating the AI Engine into Your Marketplace Listing",
    description: "Use AETHERIAL's AI to automatically optimize product descriptions, pricing, and target audience for your e-commerce listings.",
    link: "/tutorials/ai-marketplace",
    category: 'AI Integration',
    durationMinutes: 30,
    isTokenGated: false,
  },
];

const documentationLinks: DocumentationLink[] = [
  { id: 201, title: "Platform Whitepaper", url: "/docs/whitepaper", icon: FiBookOpen },
  { id: 202, title: "Smart Contract Library API", url: "/docs/smart-contracts", icon: FiExternalLink },
  { id: 203, title: "Social Features Guide", url: "/docs/social-guide", icon: FiHelpCircle },
  { id: 204, title: "AI Engine Documentation", url: "/docs/ai-engine", icon: FiCpu },
];

// --- Sub-Components for organization ---

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ElementType, label: string }> = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    // Responsive design: full width on mobile, auto width on desktop
    className={\`flex items-center justify-center sm:justify-start space-x-2 p-3 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto 
      \${active ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}\`}
  >
    <Icon className="w-5 h-5" />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const FAQAccordion: React.FC<{ faq: FAQItem }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // AETHERIAL Enhancement: AI-Powered Resolution & Blockchain Ref
  const aiResolution = faq.tags.includes('ai') ? "AI-Powered Resolution Suggested: The AI engine recommends checking the 'AI Engine Documentation' for further details." : null;

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-semibold text-gray-800 hover:text-indigo-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{faq.question}</span>
        <span className="text-xl">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="mt-2 text-gray-600">
          <p>{faq.answer}</p>
          {aiResolution && (
            <p className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-500 text-blue-700 text-sm flex items-center">
              <FiCpu className="mr-2" /> {aiResolution}
            </p>
          )}
          {faq.blockchainRef && (
            <a href={\`#\${faq.blockchainRef}\`} className="mt-2 text-indigo-600 hover:underline text-sm flex items-center">
              <FiExternalLink className="mr-1" /> View Blockchain Reference
            </a>
          )}
          <div className="mt-2 text-xs text-gray-400">Tags: {faq.tags.join(', ')}</div>
        </div>
      )}
    </div>
  );
};

const TutorialCard: React.FC<{ tutorial: TutorialItem }> = ({ tutorial }) => (
  <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col">
    <div className="flex justify-between items-start">
      <h3 className="text-lg font-semibold text-gray-900">{tutorial.title}</h3>
      {/* AETHERIAL Enhancement: Token-Gated Content */}
      {tutorial.isTokenGated ? (
        <span className="flex items-center text-red-500 bg-red-100 px-2 py-1 rounded-full text-xs font-medium">
          <FiLock className="w-3 h-3 mr-1" /> Token-Gated
        </span>
      ) : (
        <span className="flex items-center text-green-500 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
          <FiUnlock className="w-3 h-3 mr-1" /> Open Access
        </span>
      )}
    </div>
    <p className="mt-1 text-sm text-gray-600 flex-grow">{tutorial.description}</p>
    <div className="mt-3 flex justify-between items-center text-sm">
      <span className="text-indigo-600 font-medium">{tutorial.category}</span>
      <span className="text-gray-500">{tutorial.durationMinutes} min</span>
    </div>
    <a href={tutorial.link} className="mt-3 text-center block w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors">
      {tutorial.isTokenGated ? 'Check Token Access' : 'Start Tutorial'}
    </a>
  </div>
);

// --- Main Component ---

const HelpSupportPage: React.FC<HelpSupportPageProps> = ({ headerTitle = "Help & Support Center" }) => {
  // --- 2. State management with useState/useEffect ---
  const [activeTab, setActiveTab] = useState<'faq' | 'tutorials' | 'docs' | 'contact'>('faq');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [formState, setFormState] = useState<ContactFormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
    isTokenGated: false,
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const [formSubmitStatus, setFormSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Effect to filter FAQs based on search term
  useEffect(() => {
    if (activeTab === 'faq') {
      // Simple case-insensitive search across question, answer, and tags
      const results = sampleFaqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredFaqs(results);
    }
  }, [searchTerm, activeTab]);

  const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>(sampleFaqs);

  // Memoized list of all unique tags for potential filter buttons
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    sampleFaqs.forEach(faq => faq.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, []);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Handle checkbox for isTokenGated
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormState(prev => ({
      ...prev,
      [name]: newValue,
    }));
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitting(true);
    setFormSubmitStatus('idle');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // In a real application, this would be an API call
      console.log("Submitting support request:", formState);

      if (formState.isTokenGated) {
        // AETHERIAL Enhancement: Verifiable Ticket Submission
        console.log("Verifying token and submitting ticket to blockchain for transparency...");
        // Simulate blockchain transaction
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("Blockchain transaction successful. Ticket ID: 0xTKT-AETHERIAL-12345");
      }

      setFormSubmitStatus('success');
      // Reset form state after successful submission
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
        isTokenGated: false,
      });
    } catch (error) {
      setFormSubmitStatus('error');
      console.error("Submission failed:", error);
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // Render the content for the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'faq':
        return (
          <div className="space-y-6">
            {/* BuddyBoss Abstraction: Search and filtering */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search FAQs, tutorials, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            {/* Tag Filters (BuddyBoss-style filtering) */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Popular Topics:</span>
              {allTags.map(tag => (
                <button 
                  key={tag} 
                  // Simple filter logic: set search term to the tag
                  onClick={() => setSearchTerm(tag)}
                  className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-6">Frequently Asked Questions ({filteredFaqs.length})</h2>
            {filteredFaqs.length > 0 ? (
              <div className="divide-y divide-gray-200 border-t border-gray-200">
                {filteredFaqs.map(faq => (
                  <FAQAccordion key={faq.id} faq={faq} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No FAQs found matching "{searchTerm}". Try a different search term or contact support.</p>
            )}
          </div>
        );
      case 'tutorials':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Tutorials & Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleTutorials.map(tutorial => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          </div>
        );
      case 'docs':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Documentation & Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentationLinks.map(doc => (
                <a 
                  key={doc.id} 
                  href={doc.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow hover:border-indigo-500"
                >
                  <doc.icon className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{doc.title}</p>
                    <p className="text-sm text-gray-500">Click to view</p>
                  </div>
                  <FiExternalLink className="ml-auto w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Contact Support</h2>
            {formSubmitStatus === 'success' ? (
              <div className="p-6 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                <h3 className="font-bold text-lg">Thank You!</h3>
                <p>Your support request has been successfully submitted. We will get back to you within 24 hours.</p>
                {/* Display verifiable ticket ID if applicable */}
                {formState.isTokenGated && <p className="mt-2 text-sm">Your verifiable ticket ID is: <strong>0xTKT-AETHERIAL-12345</strong>. You can track its status on the blockchain.</p>}
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formState.name}
                    onChange={handleFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formState.email}
                    onChange={handleFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    value={formState.subject}
                    onChange={handleFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    required
                    value={formState.message}
                    onChange={handleFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                {/* AETHERIAL Enhancement: Verifiable Ticket Submission */}
                <div className="flex items-center">
                  <input
                    id="isTokenGated"
                    name="isTokenGated"
                    type="checkbox"
                    checked={formState.isTokenGated}
                    onChange={handleFormChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="isTokenGated" className="ml-2 block text-sm text-gray-900">
                    Submit as Verifiable Ticket (Records ticket ID on AETHERIAL Blockchain for transparency)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isFormSubmitting}
                  className={\`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    \${isFormSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}\`}
                >
                  {isFormSubmitting ? 'Submitting...' : 'Send Message'}
                </button>
                {formSubmitStatus === 'error' && (
                  <p className="text-red-500 text-sm mt-2">There was an error submitting your request. Please try again.</p>
                )}
              </form>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">{headerTitle}</h1>
        <p className="mt-2 text-lg text-gray-500">Find answers, view tutorials, and contact our dedicated support team.</p>
      </header>

      {/* Responsive Design: Tab Navigation */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 border-b border-gray-200 pb-4 mb-8">
        <TabButton active={activeTab === 'faq'} onClick={() => setActiveTab('faq')} icon={FiSearch} label="Search & FAQ" />
        <TabButton active={activeTab === 'tutorials'} onClick={() => setActiveTab('tutorials')} icon={FiHelpCircle} label="Tutorials" />
        <TabButton active={activeTab === 'docs'} onClick={() => setActiveTab('docs')} icon={FiBookOpen} label="Documentation" />
        <TabButton active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} icon={FiMail} label="Contact" />
      </div>

      <main className="min-h-[60vh]">
        {renderContent()}
      </main>
      
      {/* Footer or common links can go here */}
      <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} AETHERIAL Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HelpSupportPage;
