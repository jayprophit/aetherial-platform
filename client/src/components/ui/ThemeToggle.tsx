/**
 * AETHERIAL Theme Toggle Component
 * 
 * Military-Grade Dark Mode Toggle
 * - Smooth animations
 * - Accessible
 * - Beautiful design
 * - Multiple variants
 * 
 * @module components/ui/ThemeToggle
 */

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

/**
 * Theme toggle variant types
 */
export type ThemeToggleVariant = 'icon' | 'switch' | 'button' | 'dropdown';

/**
 * Theme toggle size types
 */
export type ThemeToggleSize = 'sm' | 'md' | 'lg';

/**
 * Theme toggle props
 */
export interface ThemeToggleProps {
  /** Visual variant */
  variant?: ThemeToggleVariant;
  
  /** Size */
  size?: ThemeToggleSize;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Show label */
  showLabel?: boolean;
  
  /** Custom labels */
  labels?: {
    light?: string;
    dark?: string;
  };
}

/**
 * Icon Toggle Variant
 * Simple icon button that toggles between sun and moon
 */
const IconToggle: React.FC<Omit<ThemeToggleProps, 'variant'>> = ({
  size = 'md',
  className = ''
}) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-icon theme-toggle-${size} ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <svg
          className="theme-toggle-icon-svg"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="theme-toggle-icon-svg"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
};

/**
 * Switch Toggle Variant
 * iOS-style toggle switch
 */
const SwitchToggle: React.FC<Omit<ThemeToggleProps, 'variant'>> = ({
  size = 'md',
  className = '',
  showLabel = false,
  labels = { light: 'Light', dark: 'Dark' }
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <label className={`theme-toggle-switch theme-toggle-${size} ${className}`}>
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        className="theme-toggle-switch-input"
        aria-label="Toggle dark mode"
      />
      <span className="theme-toggle-switch-slider">
        <span className="theme-toggle-switch-icon">
          {isDark ? '🌙' : '☀️'}
        </span>
      </span>
      {showLabel && (
        <span className="theme-toggle-switch-label">
          {isDark ? labels.dark : labels.light}
        </span>
      )}
    </label>
  );
};

/**
 * Button Toggle Variant
 * Button with text and icon
 */
const ButtonToggle: React.FC<Omit<ThemeToggleProps, 'variant'>> = ({
  size = 'md',
  className = '',
  labels = { light: 'Light Mode', dark: 'Dark Mode' }
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-button theme-toggle-${size} ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className="theme-toggle-button-icon">
        {isDark ? '☀️' : '🌙'}
      </span>
      <span className="theme-toggle-button-text">
        {isDark ? labels.light : labels.dark}
      </span>
    </button>
  );
};

/**
 * Dropdown Toggle Variant
 * Dropdown menu with light/dark/system options
 */
const DropdownToggle: React.FC<Omit<ThemeToggleProps, 'variant'>> = ({
  size = 'md',
  className = ''
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleSelect = (newTheme: 'light' | 'dark') => {
    if (theme !== newTheme) {
      toggleTheme?.();
    }
    setIsOpen(false);
  };
  
  return (
    <div className={`theme-toggle-dropdown theme-toggle-${size} ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="theme-toggle-dropdown-trigger"
        aria-label="Theme options"
        aria-expanded={isOpen}
      >
        <span className="theme-toggle-dropdown-icon">
          {theme === 'dark' ? '🌙' : '☀️'}
        </span>
        <svg
          className="theme-toggle-dropdown-arrow"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div
            className="theme-toggle-dropdown-backdrop"
            onClick={() => setIsOpen(false)}
          />
          <div className="theme-toggle-dropdown-menu">
            <button
              type="button"
              onClick={() => handleSelect('light')}
              className={`theme-toggle-dropdown-item ${theme === 'light' ? 'active' : ''}`}
            >
              <span className="theme-toggle-dropdown-item-icon">☀️</span>
              <span className="theme-toggle-dropdown-item-text">Light</span>
              {theme === 'light' && (
                <span className="theme-toggle-dropdown-item-check">✓</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleSelect('dark')}
              className={`theme-toggle-dropdown-item ${theme === 'dark' ? 'active' : ''}`}
            >
              <span className="theme-toggle-dropdown-item-icon">🌙</span>
              <span className="theme-toggle-dropdown-item-text">Dark</span>
              {theme === 'dark' && (
                <span className="theme-toggle-dropdown-item-check">✓</span>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Theme Toggle Component
 * 
 * Flexible theme toggle component with multiple variants.
 * Automatically detects and uses the theme context.
 * 
 * @example
 * ```tsx
 * // Simple icon toggle
 * <ThemeToggle variant="icon" />
 * 
 * // Switch with label
 * <ThemeToggle variant="switch" showLabel />
 * 
 * // Button toggle
 * <ThemeToggle variant="button" size="lg" />
 * 
 * // Dropdown with options
 * <ThemeToggle variant="dropdown" />
 * ```
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'icon',
  ...props
}) => {
  const { switchable } = useTheme();
  
  // Don't render if theme switching is disabled
  if (!switchable) {
    return null;
  }
  
  switch (variant) {
    case 'switch':
      return <SwitchToggle {...props} />;
    case 'button':
      return <ButtonToggle {...props} />;
    case 'dropdown':
      return <DropdownToggle {...props} />;
    case 'icon':
    default:
      return <IconToggle {...props} />;
  }
};

export default ThemeToggle;

