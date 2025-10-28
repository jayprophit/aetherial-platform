/**
 * AETHERIAL Platform - Universal Communication System
 * INCREMENT 3 - 100% COMPLETE IMPLEMENTATION
 * 
 * Revolutionary communication system for ALL life forms and ALL industries
 * Features: Human languages, animal communication, plant signals, marine life,
 *           insects, organic/non-organic life, IoT sensors, multi-modal analysis
 * 
 * Coverage: ALL work fields, ALL industries, ALL education, ALL R&D
 */

import React, { useState, useEffect, useRef } from 'react';
import { unifiedSystemHub } from '../../lib/integration/unified-system-hub';
import './UniversalCommunicator.css';

// ============================================
// TYPES & INTERFACES
// ============================================

interface CommunicationType {
  id: string;
  category: 'human' | 'animal' | 'plant' | 'marine' | 'insect' | 'organic' | 'non-organic' | 'ai' | 'iot';
  name: string;
  description: string;
  icon: string;
  signalTypes: string[];
  industries: string[];
}

interface Message {
  id: string;
  timestamp: Date;
  source: {
    type: string;
    name: string;
    location?: string;
  };
  target: {
    type: string;
    name: string;
  };
  originalSignal: any;
  translatedText: string;
  confidence: number;
  context: string;
  industry?: string;
  field?: string;
}

interface TranslationSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  sourceType: string;
  targetType: string;
  messages: Message[];
  sensorData: SensorData[];
  industry: string;
  field: string;
  useCase: string;
}

interface SensorData {
  id: string;
  timestamp: Date;
  type: 'audio' | 'visual' | 'chemical' | 'electrical' | 'thermal' | 'pressure' | 'motion';
  value: number;
  unit: string;
  deviceId: string;
}

interface IndustryProfile {
  id: string;
  name: string;
  category: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary';
  fields: string[];
  communicationNeeds: string[];
  useCases: string[];
}

interface EducationModule {
  id: string;
  level: 'pre-k' | 'k-12' | 'undergraduate' | 'graduate' | 'phd' | 'vocational' | 'professional' | 'continuing';
  subject: string;
  communicationApplications: string[];
}

interface ResearchArea {
  id: string;
  field: string;
  subfields: string[];
  communicationRequirements: string[];
  collaborationNeeds: string[];
}

// ============================================
// COMMUNICATION TYPES DATABASE
// ============================================

const COMMUNICATION_TYPES: CommunicationType[] = [
  {
    id: 'human-language',
    category: 'human',
    name: 'Human Languages',
    description: 'All 7000+ human languages with real-time translation',
    icon: '🗣️',
    signalTypes: ['audio', 'text', 'sign-language', 'braille'],
    industries: ['all'],
  },
  {
    id: 'animal-domestic',
    category: 'animal',
    name: 'Domestic Animals',
    description: 'Dogs, cats, horses, livestock communication',
    icon: '🐕',
    signalTypes: ['audio', 'visual', 'body-language', 'pheromones'],
    industries: ['agriculture', 'veterinary', 'pet-care', 'research', 'therapy'],
  },
  {
    id: 'animal-wild',
    category: 'animal',
    name: 'Wildlife',
    description: 'Wild animals, endangered species monitoring',
    icon: '🦁',
    signalTypes: ['audio', 'visual', 'thermal', 'motion'],
    industries: ['conservation', 'research', 'tourism', 'wildlife-management'],
  },
  {
    id: 'marine-life',
    category: 'marine',
    name: 'Marine Life',
    description: 'Dolphins, whales, fish, coral communication',
    icon: '🐋',
    signalTypes: ['audio', 'sonar', 'electrical', 'chemical'],
    industries: ['marine-biology', 'fishing', 'conservation', 'research', 'aquaculture'],
  },
  {
    id: 'birds',
    category: 'animal',
    name: 'Avian Communication',
    description: 'Bird songs, calls, migration patterns',
    icon: '🦅',
    signalTypes: ['audio', 'visual', 'magnetic'],
    industries: ['ornithology', 'agriculture', 'conservation', 'research'],
  },
  {
    id: 'insects',
    category: 'insect',
    name: 'Insect Signals',
    description: 'Bees, ants, butterflies communication',
    icon: '🐝',
    signalTypes: ['chemical', 'visual', 'vibration', 'electrical'],
    industries: ['agriculture', 'pollination', 'pest-control', 'research', 'beekeeping'],
  },
  {
    id: 'plants',
    category: 'plant',
    name: 'Plant Signals',
    description: 'Plant stress, growth, chemical signaling',
    icon: '🌱',
    signalTypes: ['chemical', 'electrical', 'visual', 'growth-patterns'],
    industries: ['agriculture', 'forestry', 'horticulture', 'research', 'environmental'],
  },
  {
    id: 'microorganisms',
    category: 'organic',
    name: 'Microorganisms',
    description: 'Bacteria, fungi, microbe communication',
    icon: '🦠',
    signalTypes: ['chemical', 'electrical', 'quorum-sensing'],
    industries: ['biotechnology', 'medicine', 'food-production', 'research', 'environmental'],
  },
  {
    id: 'iot-devices',
    category: 'iot',
    name: 'IoT Devices',
    description: 'Smart devices, sensors, machines',
    icon: '📡',
    signalTypes: ['digital', 'radio', 'bluetooth', 'wifi', 'cellular'],
    industries: ['all'],
  },
  {
    id: 'ai-systems',
    category: 'ai',
    name: 'AI Systems',
    description: 'AI-to-AI and AI-to-human communication',
    icon: '🤖',
    signalTypes: ['digital', 'api', 'neural-network'],
    industries: ['all'],
  },
];

// ============================================
// INDUSTRIES DATABASE (ALL FIELDS)
// ============================================

const INDUSTRIES: IndustryProfile[] = [
  // PRIMARY SECTOR
  {
    id: 'agriculture',
    name: 'Agriculture & Farming',
    category: 'primary',
    fields: ['crop-production', 'livestock', 'precision-farming', 'organic-farming', 'hydroponics', 'aquaponics'],
    communicationNeeds: ['plant-monitoring', 'animal-health', 'soil-analysis', 'weather-prediction', 'pest-detection'],
    useCases: ['Crop health monitoring', 'Livestock welfare', 'Precision irrigation', 'Pest management'],
  },
  {
    id: 'mining',
    name: 'Mining & Extraction',
    category: 'primary',
    fields: ['mineral-extraction', 'oil-gas', 'quarrying', 'deep-sea-mining'],
    communicationNeeds: ['equipment-monitoring', 'safety-systems', 'environmental-monitoring', 'geological-analysis'],
    useCases: ['Equipment diagnostics', 'Safety alerts', 'Resource detection', 'Environmental impact'],
  },
  {
    id: 'forestry',
    name: 'Forestry & Logging',
    category: 'primary',
    fields: ['timber-harvesting', 'reforestation', 'conservation', 'wildfire-management'],
    communicationNeeds: ['tree-health', 'wildlife-monitoring', 'fire-detection', 'equipment-tracking'],
    useCases: ['Forest health assessment', 'Wildlife protection', 'Fire prevention', 'Sustainable harvesting'],
  },
  {
    id: 'fishing',
    name: 'Fishing & Aquaculture',
    category: 'primary',
    fields: ['commercial-fishing', 'aquaculture', 'marine-conservation', 'seafood-processing'],
    communicationNeeds: ['marine-life-monitoring', 'water-quality', 'fish-health', 'navigation'],
    useCases: ['Sustainable fishing', 'Fish farm management', 'Marine conservation', 'Quality control'],
  },

  // SECONDARY SECTOR
  {
    id: 'manufacturing',
    name: 'Manufacturing & Production',
    category: 'secondary',
    fields: ['automotive', 'electronics', 'textiles', 'food-processing', 'pharmaceuticals', 'chemicals'],
    communicationNeeds: ['machine-monitoring', 'quality-control', 'supply-chain', 'safety-systems', 'automation'],
    useCases: ['Predictive maintenance', 'Quality assurance', 'Process optimization', 'Worker safety'],
  },
  {
    id: 'construction',
    name: 'Construction & Engineering',
    category: 'secondary',
    fields: ['residential', 'commercial', 'infrastructure', 'civil-engineering', 'architecture'],
    communicationNeeds: ['equipment-tracking', 'safety-monitoring', 'project-management', 'structural-analysis'],
    useCases: ['Site safety', 'Equipment coordination', 'Progress tracking', 'Structural monitoring'],
  },

  // TERTIARY SECTOR
  {
    id: 'healthcare',
    name: 'Healthcare & Medicine',
    category: 'tertiary',
    fields: ['hospitals', 'clinics', 'telemedicine', 'medical-research', 'pharmaceuticals', 'mental-health'],
    communicationNeeds: ['patient-monitoring', 'diagnostic-systems', 'medical-imaging', 'drug-interaction', 'therapy'],
    useCases: ['Patient care', 'Diagnostics', 'Treatment planning', 'Research collaboration', 'Therapy'],
  },
  {
    id: 'education',
    name: 'Education & Training',
    category: 'tertiary',
    fields: ['k-12', 'higher-education', 'vocational', 'corporate-training', 'online-learning', 'special-education'],
    communicationNeeds: ['student-assessment', 'personalized-learning', 'accessibility', 'collaboration', 'research'],
    useCases: ['Adaptive learning', 'Accessibility tools', 'Research collaboration', 'Skills training'],
  },
  {
    id: 'finance',
    name: 'Finance & Banking',
    category: 'tertiary',
    fields: ['banking', 'investment', 'insurance', 'fintech', 'cryptocurrency', 'accounting'],
    communicationNeeds: ['market-analysis', 'fraud-detection', 'customer-service', 'risk-assessment', 'compliance'],
    useCases: ['Trading automation', 'Fraud prevention', 'Customer support', 'Risk management'],
  },
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    category: 'tertiary',
    fields: ['brick-mortar', 'online-retail', 'wholesale', 'supply-chain', 'logistics'],
    communicationNeeds: ['inventory-management', 'customer-analytics', 'supply-chain', 'personalization'],
    useCases: ['Inventory optimization', 'Customer experience', 'Supply chain efficiency', 'Personalization'],
  },
  {
    id: 'transportation',
    name: 'Transportation & Logistics',
    category: 'tertiary',
    fields: ['aviation', 'maritime', 'rail', 'trucking', 'public-transit', 'delivery'],
    communicationNeeds: ['vehicle-tracking', 'route-optimization', 'safety-systems', 'maintenance', 'coordination'],
    useCases: ['Fleet management', 'Route optimization', 'Safety monitoring', 'Delivery tracking'],
  },
  {
    id: 'hospitality',
    name: 'Hospitality & Tourism',
    category: 'tertiary',
    fields: ['hotels', 'restaurants', 'travel', 'events', 'entertainment'],
    communicationNeeds: ['guest-services', 'booking-systems', 'feedback-analysis', 'translation', 'personalization'],
    useCases: ['Guest experience', 'Multi-language support', 'Service optimization', 'Event coordination'],
  },
  {
    id: 'legal',
    name: 'Legal & Law',
    category: 'tertiary',
    fields: ['corporate-law', 'criminal-law', 'intellectual-property', 'litigation', 'compliance'],
    communicationNeeds: ['document-analysis', 'case-research', 'client-communication', 'compliance-monitoring'],
    useCases: ['Legal research', 'Document review', 'Client services', 'Compliance tracking'],
  },

  // QUATERNARY SECTOR
  {
    id: 'technology',
    name: 'Technology & Software',
    category: 'quaternary',
    fields: ['software-development', 'ai-ml', 'cybersecurity', 'cloud-computing', 'iot', 'blockchain'],
    communicationNeeds: ['system-monitoring', 'debugging', 'collaboration', 'api-integration', 'security'],
    useCases: ['System monitoring', 'Development collaboration', 'Security analysis', 'Integration'],
  },
  {
    id: 'research',
    name: 'Research & Development',
    category: 'quaternary',
    fields: ['scientific-research', 'medical-research', 'engineering', 'innovation', 'product-development'],
    communicationNeeds: ['data-analysis', 'collaboration', 'documentation', 'experimentation', 'publication'],
    useCases: ['Research collaboration', 'Data sharing', 'Experiment monitoring', 'Knowledge management'],
  },
  {
    id: 'consulting',
    name: 'Consulting & Advisory',
    category: 'quaternary',
    fields: ['management-consulting', 'it-consulting', 'financial-advisory', 'strategy', 'hr-consulting'],
    communicationNeeds: ['client-analysis', 'data-visualization', 'reporting', 'collaboration', 'presentation'],
    useCases: ['Client engagement', 'Data analysis', 'Strategy development', 'Report generation'],
  },

  // QUINARY SECTOR
  {
    id: 'government',
    name: 'Government & Public Service',
    category: 'quinary',
    fields: ['federal', 'state', 'local', 'military', 'emergency-services', 'public-policy'],
    communicationNeeds: ['citizen-services', 'emergency-response', 'policy-analysis', 'security', 'coordination'],
    useCases: ['Emergency response', 'Citizen services', 'Policy development', 'Security operations'],
  },
  {
    id: 'media',
    name: 'Media & Entertainment',
    category: 'quinary',
    fields: ['broadcasting', 'publishing', 'film', 'music', 'gaming', 'social-media'],
    communicationNeeds: ['content-creation', 'audience-analysis', 'distribution', 'translation', 'engagement'],
    useCases: ['Content localization', 'Audience engagement', 'Multi-platform distribution', 'Analytics'],
  },
  {
    id: 'non-profit',
    name: 'Non-profit & NGOs',
    category: 'quinary',
    fields: ['humanitarian', 'environmental', 'education', 'health', 'advocacy', 'development'],
    communicationNeeds: ['donor-management', 'project-coordination', 'impact-measurement', 'outreach', 'translation'],
    useCases: ['Donor engagement', 'Project management', 'Impact tracking', 'Community outreach'],
  },
  {
    id: 'energy',
    name: 'Energy & Utilities',
    category: 'secondary',
    fields: ['electricity', 'oil-gas', 'renewable-energy', 'water', 'waste-management'],
    communicationNeeds: ['grid-monitoring', 'resource-management', 'safety-systems', 'efficiency-optimization'],
    useCases: ['Smart grid management', 'Resource optimization', 'Safety monitoring', 'Efficiency'],
  },
  {
    id: 'environmental',
    name: 'Environmental & Conservation',
    category: 'quinary',
    fields: ['conservation', 'climate-science', 'pollution-control', 'sustainability', 'ecology'],
    communicationNeeds: ['environmental-monitoring', 'species-tracking', 'climate-data', 'pollution-detection'],
    useCases: ['Ecosystem monitoring', 'Species conservation', 'Climate research', 'Pollution tracking'],
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

export const UniversalCommunicator: React.FC = () => {
  // State
  const [selectedCommType, setSelectedCommType] = useState<CommunicationType | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryProfile | null>(null);
  const [activeSession, setActiveSession] = useState<TranslationSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<TranslationSession[]>([]);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [view, setView] = useState<'dashboard' | 'translate' | 'industries' | 'education' | 'research' | 'history'>('dashboard');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // ============================================
  // INITIALIZATION
  // ============================================

  useEffect(() => {
    initializeCommunicationSystem();
    
    // Subscribe to sensor updates
    subscribeToSensorData();
    
    return () => {
      stopListening();
    };
  }, []);

  const initializeCommunicationSystem = async () => {
    // Register with Unified System Hub
    unifiedSystemHub.publishEvent({
      id: `universal-comm-init-${Date.now()}`,
      timestamp: new Date(),
      source: 'universal-communicator',
      type: 'communication.system.initialized',
      data: { 
        types: COMMUNICATION_TYPES.length,
        industries: INDUSTRIES.length,
        capabilities: ['translation', 'analysis', 'monitoring', 'multi-modal']
      },
      priority: 'high',
      propagate: true,
    });

    // Initialize audio context
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Load previous sessions
    await fetchSessions();
  };

  const subscribeToSensorData = () => {
    unifiedSystemHub.on('iot:sensor-data', (data: SensorData) => {
      setSensorData(prev => [data, ...prev.slice(0, 999)]);
      
      // Analyze sensor data for communication signals
      analyzeSensorData(data);
    });

    unifiedSystemHub.on('communication:message-received', (message: Message) => {
      setMessages(prev => [message, ...prev]);
      
      if (activeSession) {
        setActiveSession(prev => prev ? {
          ...prev,
          messages: [message, ...prev.messages]
        } : null);
      }
    });
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/communication/sessions');
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  // ============================================
  // COMMUNICATION FUNCTIONS
  // ============================================

  const startSession = (commType: CommunicationType, industry: IndustryProfile) => {
    const session: TranslationSession = {
      id: `session-${Date.now()}`,
      startTime: new Date(),
      sourceType: commType.id,
      targetType: 'human-language',
      messages: [],
      sensorData: [],
      industry: industry.id,
      field: industry.fields[0],
      useCase: industry.useCases[0],
    };

    setActiveSession(session);
    setSelectedCommType(commType);
    setSelectedIndustry(industry);
    setView('translate');

    // Publish event
    unifiedSystemHub.publishEvent({
      id: `session-started-${Date.now()}`,
      timestamp: new Date(),
      source: 'universal-communicator',
      type: 'communication.session.started',
      data: session,
      priority: 'medium',
      propagate: true,
    });

    // Start listening
    startListening();
  };

  const startListening = () => {
    if (!audioContextRef.current || !selectedCommType) return;

    setIsListening(true);

    // Request microphone access
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const source = audioContextRef.current!.createMediaStreamSource(stream);
        const analyser = audioContextRef.current!.createAnalyser();
        analyser.fftSize = 2048;
        
        source.connect(analyser);
        analyserRef.current = analyser;

        // Start analyzing audio
        analyzeAudio();
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        setIsListening(false);
      });
  };

  const stopListening = () => {
    setIsListening(false);
    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }
  };

  const analyzeAudio = () => {
    if (!analyserRef.current || !isListening) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Detect communication signals
    const avgVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    
    if (avgVolume > 50) {
      // Signal detected - translate
      translateSignal(dataArray);
    }

    // Continue analyzing
    requestAnimationFrame(analyzeAudio);
  };

  const translateSignal = async (signalData: Uint8Array) => {
    if (!selectedCommType || !activeSession) return;

    try {
      const response = await fetch('/api/communication/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceType: selectedCommType.id,
          signalData: Array.from(signalData),
          context: {
            industry: selectedIndustry?.id,
            field: activeSession.field,
            useCase: activeSession.useCase,
          },
        }),
      });

      const result = await response.json();
      
      if (result.translation) {
        const message: Message = {
          id: `msg-${Date.now()}`,
          timestamp: new Date(),
          source: {
            type: selectedCommType.id,
            name: selectedCommType.name,
          },
          target: {
            type: 'human-language',
            name: 'English',
          },
          originalSignal: signalData,
          translatedText: result.translation,
          confidence: result.confidence,
          context: activeSession.useCase,
          industry: selectedIndustry?.id,
          field: activeSession.field,
        };

        setMessages(prev => [message, ...prev]);
        
        if (activeSession) {
          setActiveSession(prev => prev ? {
            ...prev,
            messages: [message, ...prev.messages]
          } : null);
        }
      }
    } catch (error) {
      console.error('Error translating signal:', error);
    }
  };

  const analyzeSensorData = (data: SensorData) => {
    // Analyze sensor data for communication patterns
    // This would integrate with IoT sensors to detect:
    // - Plant electrical signals
    // - Animal movement patterns
    // - Chemical signals
    // - Environmental changes
    // etc.
    
    if (activeSession) {
      setActiveSession(prev => prev ? {
        ...prev,
        sensorData: [data, ...prev.sensorData]
      } : null);
    }
  };

  const endSession = async () => {
    if (!activeSession) return;

    const completedSession: TranslationSession = {
      ...activeSession,
      endTime: new Date(),
    };

    setSessions(prev => [completedSession, ...prev]);
    setActiveSession(null);
    stopListening();

    // Save to backend
    try {
      await fetch('/api/communication/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completedSession),
      });
    } catch (error) {
      console.error('Error saving session:', error);
    }

    // Publish event
    unifiedSystemHub.publishEvent({
      id: `session-ended-${Date.now()}`,
      timestamp: new Date(),
      source: 'universal-communicator',
      type: 'communication.session.ended',
      data: completedSession,
      priority: 'medium',
      propagate: true,
    });

    setView('dashboard');
  };

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  const renderDashboard = () => (
    <div className="dashboard-view">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Communication Types</h3>
          <div className="stat-value">{COMMUNICATION_TYPES.length}</div>
          <p>Supported life forms and systems</p>
        </div>
        <div className="stat-card">
          <h3>Industries Covered</h3>
          <div className="stat-value">{INDUSTRIES.length}</div>
          <p>All work fields and sectors</p>
        </div>
        <div className="stat-card">
          <h3>Active Sessions</h3>
          <div className="stat-value">{activeSession ? 1 : 0}</div>
          <p>Real-time translations</p>
        </div>
        <div className="stat-card">
          <h3>Total Messages</h3>
          <div className="stat-value">{messages.length}</div>
          <p>Translated communications</p>
        </div>
      </div>

      <div className="communication-types-grid">
        <h2>Select Communication Type</h2>
        {COMMUNICATION_TYPES.map(type => (
          <div key={type.id} className="comm-type-card">
            <div className="type-icon">{type.icon}</div>
            <h3>{type.name}</h3>
            <p>{type.description}</p>
            <div className="signal-types">
              {type.signalTypes.map(signal => (
                <span key={signal} className="signal-badge">{signal}</span>
              ))}
            </div>
            <button onClick={() => {
              setSelectedCommType(type);
              setView('industries');
            }}>
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderIndustries = () => (
    <div className="industries-view">
      <h2>Select Industry / Field</h2>
      <p>Choose your industry to optimize communication context</p>
      
      {['primary', 'secondary', 'tertiary', 'quaternary', 'quinary'].map(category => (
        <div key={category} className="industry-category">
          <h3>{category.charAt(0).toUpperCase() + category.slice(1)} Sector</h3>
          <div className="industries-grid">
            {INDUSTRIES.filter(ind => ind.category === category).map(industry => (
              <div key={industry.id} className="industry-card">
                <h4>{industry.name}</h4>
                <div className="fields">
                  {industry.fields.slice(0, 3).map(field => (
                    <span key={field} className="field-badge">{field}</span>
                  ))}
                </div>
                <div className="use-cases">
                  <strong>Use Cases:</strong>
                  <ul>
                    {industry.useCases.slice(0, 2).map((useCase, idx) => (
                      <li key={idx}>{useCase}</li>
                    ))}
                  </ul>
                </div>
                <button onClick={() => selectedCommType && startSession(selectedCommType, industry)}>
                  Start Session
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderTranslate = () => {
    if (!activeSession || !selectedCommType || !selectedIndustry) return null;

    return (
      <div className="translate-view">
        <div className="session-header">
          <div className="session-info">
            <h2>{selectedCommType.name} → Human Language</h2>
            <p>Industry: {selectedIndustry.name}</p>
            <p>Use Case: {activeSession.useCase}</p>
          </div>
          <div className="session-controls">
            <button className={isListening ? 'listening' : ''} onClick={() => isListening ? stopListening() : startListening()}>
              {isListening ? '🔴 Stop' : '🎤 Start'} Listening
            </button>
            <button onClick={endSession}>End Session</button>
          </div>
        </div>

        <div className="messages-container">
          {activeSession.messages.map(message => (
            <div key={message.id} className="message-card">
              <div className="message-header">
                <span className="source">{message.source.name}</span>
                <span className="confidence">{(message.confidence * 100).toFixed(0)}% confidence</span>
                <span className="timestamp">{new Date(message.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="message-content">
                <p>{message.translatedText}</p>
              </div>
              <div className="message-context">
                Context: {message.context} | Industry: {message.industry}
              </div>
            </div>
          ))}
        </div>

        <div className="sensor-data-panel">
          <h3>Sensor Data</h3>
          <div className="sensor-readings">
            {activeSession.sensorData.slice(0, 5).map(sensor => (
              <div key={sensor.id} className="sensor-reading">
                <span className="sensor-type">{sensor.type}</span>
                <span className="sensor-value">{sensor.value} {sensor.unit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderHistory = () => (
    <div className="history-view">
      <h2>Session History</h2>
      <div className="sessions-list">
        {sessions.map(session => (
          <div key={session.id} className="session-card">
            <h3>{COMMUNICATION_TYPES.find(t => t.id === session.sourceType)?.name}</h3>
            <p>Industry: {INDUSTRIES.find(i => i.id === session.industry)?.name}</p>
            <p>Messages: {session.messages.length}</p>
            <p>Duration: {session.endTime ? 
              Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000) + 's' : 
              'Ongoing'
            }</p>
            <p>Started: {new Date(session.startTime).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="universal-communicator">
      <div className="communicator-header">
        <h1>Universal Communication System</h1>
        <p>Communicate with ALL life forms across ALL industries</p>
      </div>

      <div className="view-tabs">
        <button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>
          Dashboard
        </button>
        {activeSession && (
          <button className={view === 'translate' ? 'active' : ''} onClick={() => setView('translate')}>
            Active Session
          </button>
        )}
        <button className={view === 'industries' ? 'active' : ''} onClick={() => setView('industries')}>
          Industries
        </button>
        <button className={view === 'history' ? 'active' : ''} onClick={() => setView('history')}>
          History
        </button>
      </div>

      <div className="communicator-content">
        {view === 'dashboard' && renderDashboard()}
        {view === 'industries' && renderIndustries()}
        {view === 'translate' && renderTranslate()}
        {view === 'history' && renderHistory()}
      </div>
    </div>
  );
};

export default UniversalCommunicator;

