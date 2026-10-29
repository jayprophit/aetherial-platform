import React, { useState, useEffect } from 'react';
import './App.css';

// Icons (using Unicode symbols for simplicity)
const Icons = {
  Menu: '☰',
  Close: '✕',
  Star: '★',
  Arrow: '→',
  Check: '✓',
  Play: '▶',
  Pause: '⏸',
  User: '👤',
  Shield: '🛡',
  Globe: '🌍',
  Rocket: '🚀',
  Brain: '🧠',
  Chart: '📊',
  Lock: '🔒',
  Mobile: '📱',
  Desktop: '💻',
  Tablet: '📱',
  Bank: '🏦',
  Coin: '🪙',
  Trading: '📈',
  AI: '🤖',
  Blockchain: '⛓',
  Cloud: '☁',
  Security: '🔐',
  Analytics: '📈',
  Communication: '💬',
  Education: '🎓',
  Shopping: '🛒',
  Social: '👥',
  Medical: '⚕',
  Engineering: '⚙',
  Legal: '⚖',
  Finance: '💰',
  Manufacturing: '🏭',
  Enterprise: '🏢'
};

// 3D Avatar Component
const Avatar3D: React.FC<{ isListening: boolean; isSpeaking: boolean }> = ({ isListening, isSpeaking }) => {
  const [emotion, setEmotion] = useState('neutral');
  
  useEffect(() => {
    if (isListening) setEmotion('listening');
    else if (isSpeaking) setEmotion('speaking');
    else setEmotion('neutral');
  }, [isListening, isSpeaking]);

  return (
    <div className="avatar-container">
      <div className={`avatar-3d ${emotion}`}>
        <div className="avatar-head">
          <div className="avatar-eyes">
            <div className={`eye left ${isListening ? 'listening' : ''}`}></div>
            <div className={`eye right ${isListening ? 'listening' : ''}`}></div>
          </div>
          <div className={`avatar-mouth ${isSpeaking ? 'speaking' : ''}`}></div>
        </div>
        <div className="avatar-body"></div>
        {isListening && <div className="listening-indicator">🎤</div>}
        {isSpeaking && <div className="speaking-indicator">🔊</div>}
      </div>
    </div>
  );
};

// Voice Assistant Component
const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        processVoiceCommand(speechResult);
      };
      
      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  const processVoiceCommand = async (command: string) => {
    // Simulate AI processing
    setIsSpeaking(true);
    
    let aiResponse = '';
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('hello') || lowerCommand.includes('hi')) {
      aiResponse = 'Hello! Welcome to the Unified Platform. How can I assist you today?';
    } else if (lowerCommand.includes('banking')) {
      aiResponse = 'I can help you with banking services including account management, transfers, loans, and credit cards.';
    } else if (lowerCommand.includes('trading')) {
      aiResponse = 'Our trading platform offers stocks, crypto, forex, and social trading features with AI-powered insights.';
    } else if (lowerCommand.includes('blockchain')) {
      aiResponse = 'Our unified blockchain supports multiple consensus mechanisms and offers UBC coins and Q-tokens.';
    } else {
      aiResponse = 'I understand you said: ' + command + '. The Unified Platform offers comprehensive solutions for all your needs.';
    }
    
    setResponse(aiResponse);
    
    // Text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(aiResponse);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  return (
    <div className="voice-assistant">
      <Avatar3D isListening={isListening} isSpeaking={isSpeaking} />
      
      <div className="voice-controls">
        <button 
          className={`voice-button ${isListening ? 'listening' : ''}`}
          onClick={startListening}
          disabled={isListening || isSpeaking}
        >
          {isListening ? 'Listening...' : 'Speak to Assistant'}
        </button>
        
        {transcript && (
          <div className="transcript">
            <strong>You said:</strong> {transcript}
          </div>
        )}
        
        {response && (
          <div className="response">
            <strong>Assistant:</strong> {response}
          </div>
        )}
      </div>
    </div>
  );
};

// Multimedia Player Component
const MultimediaPlayer: React.FC = () => {
  const [currentMedia, setCurrentMedia] = useState<'audio' | 'video' | 'image' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="multimedia-player">
      <h3>Multimedia Center</h3>
      
      <div className="media-controls">
        <button onClick={() => setCurrentMedia('audio')}>Audio Player</button>
        <button onClick={() => setCurrentMedia('video')}>Video Player</button>
        <button onClick={() => setCurrentMedia('image')}>Image Viewer</button>
      </div>
      
      {currentMedia === 'audio' && (
        <div className="audio-player">
          <div className="audio-visualizer">
            <div className="wave-bars">
              {[...Array(20)].map((_, i) => (
                <div key={i} className={`bar ${isPlaying ? 'playing' : ''}`}></div>
              ))}
            </div>
          </div>
          <div className="audio-controls">
            <button onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? Icons.Pause : Icons.Play}
            </button>
            <span>Sample Audio Track</span>
          </div>
        </div>
      )}
      
      {currentMedia === 'video' && (
        <div className="video-player">
          <div className="video-placeholder">
            <div className="video-icon">📹</div>
            <p>Video Player Ready</p>
          </div>
          <div className="video-controls">
            <button onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? Icons.Pause : Icons.Play}
            </button>
            <span>Sample Video Content</span>
          </div>
        </div>
      )}
      
      {currentMedia === 'image' && (
        <div className="image-viewer">
          <div className="image-placeholder">
            <div className="image-icon">🖼️</div>
            <p>Image Viewer Ready</p>
          </div>
          <div className="image-controls">
            <button>Zoom In</button>
            <button>Zoom Out</button>
            <button>Rotate</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [userStats, setUserStats] = useState({
    totalUsers: 2500000,
    dataProcessed: 50,
    apiCalls: 100000000,
    uptime: 99.99,
    countries: 195,
    industries: 50
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate real-time metrics updates
      setUserStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 10),
        dataProcessed: prev.dataProcessed + Math.random() * 0.1,
        apiCalls: prev.apiCalls + Math.floor(Math.random() * 1000)
      }));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const features = [
    {
      icon: Icons.Bank,
      title: 'Comprehensive Banking',
      description: 'Full-service banking with checking, savings, loans, credit cards, and investment services.',
      stats: '12+ Account Types'
    },
    {
      icon: Icons.Trading,
      title: 'Social Trading Platform',
      description: 'eToro-style social trading with copy trading, multi-asset support, and AI insights.',
      stats: '50+ Assets'
    },
    {
      icon: Icons.Blockchain,
      title: 'Unified Blockchain',
      description: '3D blockchain with multiple consensus mechanisms, UBC coins, and Q-tokens.',
      stats: '1M+ TPS'
    },
    {
      icon: Icons.AI,
      title: 'Advanced AI Engine',
      description: 'Seven-node AI system with quantum computing and advanced reasoning capabilities.',
      stats: '10+ AI Models'
    },
    {
      icon: Icons.Shopping,
      title: 'E-commerce Platform',
      description: 'Complete online marketplace with inventory management and payment processing.',
      stats: 'Unlimited Products'
    },
    {
      icon: Icons.Education,
      title: 'E-learning System',
      description: 'Comprehensive educational platform with courses, assessments, and certifications.',
      stats: '1000+ Courses'
    },
    {
      icon: Icons.Communication,
      title: 'Global Communication',
      description: 'VoIP, messaging, video calls, and collaboration tools for worldwide connectivity.',
      stats: '195+ Countries'
    },
    {
      icon: Icons.Analytics,
      title: 'Business Intelligence',
      description: 'Advanced analytics, reporting, and insights for data-driven decision making.',
      stats: 'Real-time Analytics'
    }
  ];

  const industries = [
    { icon: Icons.Medical, name: 'Healthcare', description: 'Medical AI, patient management, research systems' },
    { icon: Icons.Engineering, name: 'Engineering', description: 'CAD files, materials, tools, simulations' },
    { icon: Icons.Legal, name: 'Legal', description: 'Case law, statutes, research tools, templates' },
    { icon: Icons.Finance, name: 'Financial', description: 'Market data, trading algorithms, portfolio management' },
    { icon: Icons.Manufacturing, name: 'Manufacturing', description: 'IoT integration, 3D printing, CNC, laser engraving' },
    { icon: Icons.Enterprise, name: 'Enterprise', description: 'ERP systems, workflow automation, compliance' }
  ];

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">{Icons.Rocket}</span>
            <span className="logo-text">Unified Platform</span>
          </div>
          
          <div className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
            <a href="#home" onClick={() => scrollToSection('home')} className={activeSection === 'home' ? 'active' : ''}>Home</a>
            <a href="#features" onClick={() => scrollToSection('features')} className={activeSection === 'features' ? 'active' : ''}>Features</a>
            <a href="#industries" onClick={() => scrollToSection('industries')} className={activeSection === 'industries' ? 'active' : ''}>Industries</a>
            <a href="#dashboard" onClick={() => scrollToSection('dashboard')} className={activeSection === 'dashboard' ? 'active' : ''}>Dashboard</a>
            <a href="#platform" onClick={() => scrollToSection('platform')} className={activeSection === 'platform' ? 'active' : ''}>Platform</a>
            <a href="#about" onClick={() => scrollToSection('about')} className={activeSection === 'about' ? 'active' : ''}>About</a>
          </div>
          
          <div className="nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? Icons.Close : Icons.Menu}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-background">
          <div className="floating-particles">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${20 + Math.random() * 20}s`
              }}></div>
            ))}
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              The Ultimate
              <span className="gradient-text"> Unified Platform</span>
            </h1>
            <p className="hero-subtitle">
              Revolutionary all-in-one platform combining banking, trading, blockchain, AI, e-commerce, 
              education, and communication in a single, powerful ecosystem.
            </p>
            
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">{userStats.totalUsers.toLocaleString()}+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{userStats.dataProcessed.toFixed(1)}TB</div>
                <div className="stat-label">Data Processed Daily</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{(userStats.apiCalls / 1000000).toFixed(0)}M+</div>
                <div className="stat-label">API Calls per Day</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{userStats.uptime}%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
            
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => scrollToSection('features')}>
                Explore Features {Icons.Arrow}
              </button>
              <button className="btn-secondary" onClick={() => scrollToSection('dashboard')}>
                View Dashboard
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <VoiceAssistant />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2>Comprehensive Features</h2>
            <p>Everything you need in one powerful platform</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-stat">{feature.stats}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section id="industries" className="industries">
        <div className="container">
          <div className="section-header">
            <h2>Industry Solutions</h2>
            <p>Specialized solutions for every industry</p>
          </div>
          
          <div className="industries-grid">
            {industries.map((industry, index) => (
              <div key={index} className="industry-card">
                <div className="industry-icon">{industry.icon}</div>
                <h3>{industry.name}</h3>
                <p>{industry.description}</p>
   
(Content truncated due to size limit. Use line ranges to read in chunks)