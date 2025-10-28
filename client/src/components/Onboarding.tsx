/**
 * AETHERIAL Onboarding Flow
 * 
 * Military-Grade User Onboarding
 * - Multi-step wizard
 * - Progress tracking
 * - Personalization
 * - Interactive tour
 * - First-time user experience
 * 
 * @module components/Onboarding
 */

import React, { useState } from 'react';
import './Onboarding.css';

/**
 * Onboarding step interface
 */
interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

/**
 * User preferences collected during onboarding
 */
export interface OnboardingPreferences {
  interests: string[];
  modules: string[];
  experience: string;
  goals: string[];
  notifications: boolean;
  newsletter: boolean;
}

/**
 * Onboarding props
 */
export interface OnboardingProps {
  /** Callback when onboarding is completed */
  onComplete: (preferences: OnboardingPreferences) => void;
  
  /** Callback when onboarding is skipped */
  onSkip?: () => void;
}

/**
 * Welcome Step Component
 */
const WelcomeStep: React.FC = () => {
  return (
    <div className="onboarding-step-content">
      <div className="onboarding-hero">
        <div className="onboarding-logo">
          <svg viewBox="0 0 100 100" className="onboarding-logo-svg">
            <circle cx="50" cy="50" r="45" fill="var(--primary-500)" />
            <path
              d="M50 20 L65 45 L50 35 L35 45 Z"
              fill="white"
            />
            <circle cx="50" cy="60" r="15" fill="white" />
          </svg>
        </div>
        <h1 className="onboarding-title">
          Welcome to AETHERIAL
        </h1>
        <p className="onboarding-subtitle">
          The world's most advanced all-in-one platform for learning, working, trading, and connecting.
        </p>
      </div>
      
      <div className="onboarding-features">
        <div className="onboarding-feature">
          <span className="onboarding-feature-icon">🎓</span>
          <h3 className="onboarding-feature-title">Learn</h3>
          <p className="onboarding-feature-text">
            Access thousands of courses and learning paths
          </p>
        </div>
        <div className="onboarding-feature">
          <span className="onboarding-feature-icon">💼</span>
          <h3 className="onboarding-feature-title">Work</h3>
          <p className="onboarding-feature-text">
            Find jobs and grow your career
          </p>
        </div>
        <div className="onboarding-feature">
          <span className="onboarding-feature-icon">💰</span>
          <h3 className="onboarding-feature-title">Trade</h3>
          <p className="onboarding-feature-text">
            Buy, sell, and trade digital assets
          </p>
        </div>
        <div className="onboarding-feature">
          <span className="onboarding-feature-icon">🤝</span>
          <h3 className="onboarding-feature-title">Connect</h3>
          <p className="onboarding-feature-text">
            Network with professionals worldwide
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Interests Selection Step
 */
const InterestsStep: React.FC<{
  selected: string[];
  onChange: (interests: string[]) => void;
}> = ({ selected, onChange }) => {
  const interests = [
    { id: 'web-dev', label: 'Web Development', icon: '💻' },
    { id: 'ai-ml', label: 'AI & Machine Learning', icon: '🤖' },
    { id: 'blockchain', label: 'Blockchain', icon: '⛓️' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'business', label: 'Business', icon: '📊' },
    { id: 'marketing', label: 'Marketing', icon: '📱' },
    { id: 'finance', label: 'Finance', icon: '💵' },
    { id: 'science', label: 'Science', icon: '🔬' },
  ];
  
  const toggleInterest = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(i => i !== id));
    } else {
      onChange([...selected, id]);
    }
  };
  
  return (
    <div className="onboarding-step-content">
      <h2 className="onboarding-step-title">What are you interested in?</h2>
      <p className="onboarding-step-description">
        Select your interests to personalize your experience
      </p>
      
      <div className="onboarding-interests-grid">
        {interests.map(interest => (
          <button
            key={interest.id}
            type="button"
            className={`onboarding-interest-card ${selected.includes(interest.id) ? 'selected' : ''}`}
            onClick={() => toggleInterest(interest.id)}
          >
            <span className="onboarding-interest-icon">{interest.icon}</span>
            <span className="onboarding-interest-label">{interest.label}</span>
            {selected.includes(interest.id) && (
              <span className="onboarding-interest-check">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Modules Selection Step
 */
const ModulesStep: React.FC<{
  selected: string[];
  onChange: (modules: string[]) => void;
}> = ({ selected, onChange }) => {
  const modules = [
    { id: 'education', label: 'Education Hub', icon: '🎓', description: 'Courses and learning' },
    { id: 'jobs', label: 'Job Marketplace', icon: '💼', description: 'Find and post jobs' },
    { id: 'marketplace', label: 'E-Commerce', icon: '🛒', description: 'Buy and sell products' },
    { id: 'social', label: 'Social Network', icon: '👥', description: 'Connect with others' },
    { id: 'trading', label: 'Trading', icon: '📈', description: 'Trade digital assets' },
    { id: 'blockchain', label: 'Blockchain', icon: '⛓️', description: 'Web3 features' },
  ];
  
  const toggleModule = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(m => m !== id));
    } else {
      onChange([...selected, id]);
    }
  };
  
  return (
    <div className="onboarding-step-content">
      <h2 className="onboarding-step-title">Which features do you want to use?</h2>
      <p className="onboarding-step-description">
        Enable the modules you're interested in
      </p>
      
      <div className="onboarding-modules-list">
        {modules.map(module => (
          <button
            key={module.id}
            type="button"
            className={`onboarding-module-card ${selected.includes(module.id) ? 'selected' : ''}`}
            onClick={() => toggleModule(module.id)}
          >
            <div className="onboarding-module-icon">{module.icon}</div>
            <div className="onboarding-module-content">
              <h3 className="onboarding-module-label">{module.label}</h3>
              <p className="onboarding-module-description">{module.description}</p>
            </div>
            <div className="onboarding-module-toggle">
              <div className={`onboarding-toggle ${selected.includes(module.id) ? 'active' : ''}`}>
                <div className="onboarding-toggle-thumb" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Experience Level Step
 */
const ExperienceStep: React.FC<{
  selected: string;
  onChange: (experience: string) => void;
}> = ({ selected, onChange }) => {
  const levels = [
    { id: 'beginner', label: 'Beginner', description: 'Just getting started', icon: '🌱' },
    { id: 'intermediate', label: 'Intermediate', description: 'Some experience', icon: '🌿' },
    { id: 'advanced', label: 'Advanced', description: 'Experienced user', icon: '🌳' },
    { id: 'expert', label: 'Expert', description: 'Professional level', icon: '🏆' },
  ];
  
  return (
    <div className="onboarding-step-content">
      <h2 className="onboarding-step-title">What's your experience level?</h2>
      <p className="onboarding-step-description">
        Help us tailor the experience to your skill level
      </p>
      
      <div className="onboarding-experience-grid">
        {levels.map(level => (
          <button
            key={level.id}
            type="button"
            className={`onboarding-experience-card ${selected === level.id ? 'selected' : ''}`}
            onClick={() => onChange(level.id)}
          >
            <span className="onboarding-experience-icon">{level.icon}</span>
            <h3 className="onboarding-experience-label">{level.label}</h3>
            <p className="onboarding-experience-description">{level.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Completion Step
 */
const CompletionStep: React.FC = () => {
  return (
    <div className="onboarding-step-content">
      <div className="onboarding-completion">
        <div className="onboarding-completion-icon">
          <svg viewBox="0 0 100 100" className="onboarding-completion-svg">
            <circle cx="50" cy="50" r="45" fill="var(--success-500)" />
            <path
              d="M30 50 L45 65 L70 35"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
        <h2 className="onboarding-completion-title">You're all set!</h2>
        <p className="onboarding-completion-description">
          Your personalized AETHERIAL experience is ready. Let's get started!
        </p>
      </div>
    </div>
  );
};

/**
 * Onboarding Component
 * 
 * Multi-step onboarding flow for new users.
 * Collects preferences and personalizes the experience.
 * 
 * @example
 * ```tsx
 * <Onboarding
 *   onComplete={(preferences) => {
 *     console.log('Onboarding completed:', preferences);
 *   }}
 *   onSkip={() => {
 *     console.log('Onboarding skipped');
 *   }}
 * />
 * ```
 */
export const Onboarding: React.FC<OnboardingProps> = ({
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<OnboardingPreferences>({
    interests: [],
    modules: ['education', 'jobs', 'marketplace', 'social'],
    experience: 'intermediate',
    goals: [],
    notifications: true,
    newsletter: false
  });
  
  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Get started with AETHERIAL',
      component: <WelcomeStep />
    },
    {
      id: 'interests',
      title: 'Interests',
      description: 'What are you interested in?',
      component: (
        <InterestsStep
          selected={preferences.interests}
          onChange={(interests) => setPreferences({ ...preferences, interests })}
        />
      )
    },
    {
      id: 'modules',
      title: 'Modules',
      description: 'Choose your features',
      component: (
        <ModulesStep
          selected={preferences.modules}
          onChange={(modules) => setPreferences({ ...preferences, modules })}
        />
      )
    },
    {
      id: 'experience',
      title: 'Experience',
      description: 'Your skill level',
      component: (
        <ExperienceStep
          selected={preferences.experience}
          onChange={(experience) => setPreferences({ ...preferences, experience })}
        />
      )
    },
    {
      id: 'completion',
      title: 'Complete',
      description: 'You're ready!',
      component: <CompletionStep />
    }
  ];
  
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;
  
  const handleNext = () => {
    if (isLastStep) {
      onComplete(preferences);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onComplete(preferences);
    }
  };
  
  return (
    <div className="onboarding-container">
      <div className="onboarding-modal">
        {/* Progress Bar */}
        <div className="onboarding-progress-bar">
          <div
            className="onboarding-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Step Indicators */}
        <div className="onboarding-steps-indicator">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`onboarding-step-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
          ))}
        </div>
        
        {/* Step Content */}
        <div className="onboarding-step">
          {steps[currentStep].component}
        </div>
        
        {/* Navigation */}
        <div className="onboarding-navigation">
          <button
            type="button"
            onClick={handleSkip}
            className="onboarding-button onboarding-button-ghost"
          >
            Skip
          </button>
          
          <div className="onboarding-navigation-main">
            {!isFirstStep && (
              <button
                type="button"
                onClick={handleBack}
                className="onboarding-button onboarding-button-outline"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="onboarding-button onboarding-button-primary"
            >
              {isLastStep ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

