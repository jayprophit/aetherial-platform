import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { 
  Search, Bell, Settings, User, Menu, X, ChevronDown, ChevronRight,
  Home, Briefcase, GraduationCap, ShoppingCart, Users, Code, Zap,
  Star, Heart, Share, MessageCircle, Play, Pause, Volume2, VolumeX,
  Download, Upload, Edit, Trash2, Copy, ExternalLink, Filter,
  Grid, List, Calendar, Clock, MapPin, Globe, Shield, Award,
  TrendingUp, BarChart3, PieChart, Activity, Layers, Database,
  Cpu, Smartphone, Monitor, Tablet, Watch, Headphones, Camera,
  Mic, Video, Image, FileText, Archive, Cloud, Server, Wifi,
  Battery, Signal, Bluetooth, Usb, HardDrive, Memory, Gpu
} from 'lucide-react';

// Advanced Theme System
interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
    hero: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

const themes: Record<string, Theme> = {
  modern: {
    name: 'Modern',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      secondary: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      accent: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      secondary: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      accent: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      hero: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)'
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    }
  },
  neon: {
    name: 'Neon',
    colors: {
      primary: '#00ff88',
      secondary: '#ff0080',
      accent: '#00d4ff',
      background: '#0a0a0a',
      surface: '#1a1a1a',
      text: '#ffffff',
      textSecondary: '#cccccc',
      border: '#333333',
      success: '#00ff88',
      warning: '#ffaa00',
      error: '#ff0040',
      info: '#00aaff'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)',
      secondary: 'linear-gradient(135deg, #ff0080 0%, #ff0040 100%)',
      accent: 'linear-gradient(135deg, #00d4ff 0%, #0080ff 100%)',
      hero: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
    },
    shadows: {
      sm: '0 0 5px rgba(0, 255, 136, 0.3)',
      md: '0 0 10px rgba(0, 255, 136, 0.3), 0 0 20px rgba(0, 255, 136, 0.1)',
      lg: '0 0 15px rgba(0, 255, 136, 0.4), 0 0 30px rgba(0, 255, 136, 0.2)',
      xl: '0 0 25px rgba(0, 255, 136, 0.5), 0 0 50px rgba(0, 255, 136, 0.3)'
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem'
    }
  }
};

// Advanced Button Component
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  theme: Theme;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  theme
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const variantClasses = {
    primary: `bg-[${theme.colors.primary}] text-white hover:opacity-90 focus:ring-[${theme.colors.primary}]`,
    secondary: `bg-[${theme.colors.secondary}] text-white hover:opacity-90 focus:ring-[${theme.colors.secondary}]`,
    outline: `border-2 border-[${theme.colors.primary}] text-[${theme.colors.primary}] hover:bg-[${theme.colors.primary}] hover:text-white`,
    ghost: `text-[${theme.colors.primary}] hover:bg-[${theme.colors.primary}]/10`,
    gradient: `bg-gradient-to-r from-[${theme.colors.primary}] to-[${theme.colors.secondary}] text-white hover:opacity-90`
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
      style={{ borderRadius: theme.borderRadius.md }}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
        />
      )}
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </motion.button>
  );
};

// Advanced Card Component
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  theme: Theme;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  theme,
  className = ''
}) => {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const variantClasses = {
    default: `bg-[${theme.colors.surface}] border border-[${theme.colors.border}]`,
    elevated: `bg-[${theme.colors.surface}] shadow-lg`,
    outlined: `bg-transparent border-2 border-[${theme.colors.border}]`,
    glass: `bg-[${theme.colors.surface}]/80 backdrop-blur-md border border-[${theme.colors.border}]/50`
  };

  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: theme.shadows.lg } : {}}
      className={`${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      style={{ borderRadius: theme.borderRadius.lg }}
    >
      {children}
    </motion.div>
  );
};

// Advanced Input Component
interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  error?: string;
  theme: Theme;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  iconPosition = 'left',
  size = 'md',
  variant = 'default',
  error,
  theme,
  disabled = false
}) => {
  const [focused, setFocused] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    default: `bg-[${theme.colors.background}] border border-[${theme.colors.border}] focus:border-[${theme.colors.primary}]`,
    filled: `bg-[${theme.colors.surface}] border-0 focus:ring-2 focus:ring-[${theme.colors.primary}]`,
    outlined: `bg-transparent border-2 border-[${theme.colors.border}] focus:border-[${theme.colors.primary}]`
  };

  return (
    <div className="relative">
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <motion.input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={`
            w-full transition-all duration-200 focus:outline-none
            ${sizeClasses[size]} ${variantClasses[variant]}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{ 
            borderRadius: theme.borderRadius.md,
            color: theme.colors.text
          }}
          animate={{
            scale: focused ? 1.01 : 1,
            boxShadow: focused ? theme.shadows.md : 'none'
          }}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

// Advanced Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  theme: Theme;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  theme
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`
              fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
              w-full ${sizeClasses[size]} z-50
            `}
          >
            <div
              className="bg-white shadow-2xl"
              style={{ 
                borderRadius: theme.borderRadius.xl,
                backgroundColor: theme.colors.surface
              }}
            >
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold" style={{ color: theme.colors.text }}>
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              <div className="p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Advanced Navigation Component
interface NavigationProps {
  theme: Theme;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ theme, currentTheme, onThemeChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Briefcase, label: 'Jobs', href: '/jobs' },
    { icon: GraduationCap, label: 'Education', href: '/education' },
    { icon: ShoppingCart, label: 'Marketplace', href: '/marketplace' },
    { icon: Users, label: 'Social', href: '/social' },
    { icon: Code, label: 'Developer', href: '/developer' },
    { icon: Zap, label: 'AI Assistant', href: '/ai' }
  ];

  return (
    <nav
      className="sticky top-0 z-30 border-b backdrop-blur-md"
      style={{ 
        backgroundColor: `${theme.colors.surface}/90`,
        borderColor: theme.colors.border
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: theme.gradients.primary }}
              >
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span 
                className="text-xl font-bold"
                style={{ color: theme.colors.text }}
              >
                Unified Platform
              </span>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ 
                    color: theme.colors.textSecondary,
                    ':hover': { backgroundColor: `${theme.colors.primary}/10` }
                  }}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Theme Selector */}
            <div className="relative">
              <select
                value={currentTheme}
                onChange={(e) => onThemeChange(e.target.value)}
                className="px-3 py-1 rounded-lg border text-sm focus:outline-none focus:ring-2"
                st
(Content truncated due to size limit. Use line ranges to read in chunks)