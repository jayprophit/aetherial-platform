/**
 * React Hooks for Accessibility
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  trapFocus,
  announceToScreenReader,
  getFocusableElements,
  prefersReducedMotion,
  prefersHighContrast,
  getColorSchemePreference
} from '../utils/accessibility';

/**
 * Hook to trap focus within a component (for modals, dialogs)
 */
export function useFocusTrap(active: boolean = true) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!active || !ref.current) return;

    const cleanup = trapFocus(ref.current);
    return cleanup;
  }, [active]);

  return ref;
}

/**
 * Hook to announce messages to screen readers
 */
export function useScreenReaderAnnouncement() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    announceToScreenReader(message, priority);
  }, []);

  return announce;
}

/**
 * Hook to manage focus on mount
 */
export function useAutoFocus(shouldFocus: boolean = true) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return ref;
}

/**
 * Hook to restore focus when component unmounts
 */
export function useFocusReturn() {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;

    return () => {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, []);
}

/**
 * Hook for keyboard navigation
 */
export function useKeyboardNavigation(
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowKeys?: (direction: 'up' | 'down' | 'left' | 'right') => void
) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        if (onEnter) {
          e.preventDefault();
          onEnter();
        }
        break;
      case 'Escape':
        if (onEscape) {
          e.preventDefault();
          onEscape();
        }
        break;
      case 'ArrowUp':
        if (onArrowKeys) {
          e.preventDefault();
          onArrowKeys('up');
        }
        break;
      case 'ArrowDown':
        if (onArrowKeys) {
          e.preventDefault();
          onArrowKeys('down');
        }
        break;
      case 'ArrowLeft':
        if (onArrowKeys) {
          e.preventDefault();
          onArrowKeys('left');
        }
        break;
      case 'ArrowRight':
        if (onArrowKeys) {
          e.preventDefault();
          onArrowKeys('right');
        }
        break;
    }
  }, [onEnter, onEscape, onArrowKeys]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Hook to detect reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      setReducedMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
}

/**
 * Hook to detect high contrast preference
 */
export function useHighContrast(): boolean {
  const [highContrast, setHighContrast] = useState(prefersHighContrast());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    const handleChange = () => {
      setHighContrast(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return highContrast;
}

/**
 * Hook to detect color scheme preference
 */
export function useColorScheme(): 'light' | 'dark' | 'no-preference' {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | 'no-preference'>(
    getColorSchemePreference()
  );

  useEffect(() => {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const lightQuery = window.matchMedia('(prefers-color-scheme: light)');
    
    const handleChange = () => {
      setColorScheme(getColorSchemePreference());
    };

    darkQuery.addEventListener('change', handleChange);
    lightQuery.addEventListener('change', handleChange);
    
    return () => {
      darkQuery.removeEventListener('change', handleChange);
      lightQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return colorScheme;
}

/**
 * Hook for roving tabindex (for toolbars, menus)
 */
export function useRovingTabIndex(itemCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);

  const getTabIndex = useCallback((index: number) => {
    return index === activeIndex ? 0 : -1;
  }, [activeIndex]);

  const handleKeyDown = useCallback((e: KeyboardEvent, index: number) => {
    let newIndex = index;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        newIndex = (index + 1) % itemCount;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        newIndex = (index - 1 + itemCount) % itemCount;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = itemCount - 1;
        break;
      default:
        return;
    }

    setActiveIndex(newIndex);
  }, [itemCount]);

  return { activeIndex, getTabIndex, handleKeyDown, setActiveIndex };
}

/**
 * Hook to manage ARIA live region
 */
export function useAriaLive(priority: 'polite' | 'assertive' = 'polite') {
  const [message, setMessage] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && message) {
      ref.current.textContent = message;
      
      // Clear message after announcement
      const timer = setTimeout(() => setMessage(''), 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const announce = useCallback((msg: string) => {
    setMessage(msg);
  }, []);

  const LiveRegion = useCallback(() => (
    <div
      ref={ref}
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    />
  ), [priority]);

  return { announce, LiveRegion };
}

/**
 * Hook to handle click outside
 */
export function useClickOutside(callback: () => void) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);

  return ref;
}

/**
 * Hook for accessible disclosure (expand/collapse)
 */
export function useDisclosure(defaultExpanded: boolean = false) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  const toggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const expand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const collapse = useCallback(() => {
    setIsExpanded(false);
  }, []);

  return {
    isExpanded,
    toggle,
    expand,
    collapse,
    buttonProps: {
      ref: buttonRef,
      'aria-expanded': isExpanded,
      'aria-controls': contentRef.current?.id,
      onClick: toggle
    },
    contentProps: {
      ref: contentRef,
      hidden: !isExpanded,
      'aria-hidden': !isExpanded
    }
  };
}

/**
 * Hook for accessible tabs
 */
export function useTabs(tabCount: number, defaultTab: number = 0) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const getTabProps = useCallback((index: number) => ({
    role: 'tab',
    'aria-selected': index === activeTab,
    tabIndex: index === activeTab ? 0 : -1,
    onClick: () => setActiveTab(index),
    onKeyDown: (e: React.KeyboardEvent) => {
      let newIndex = index;
      
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          newIndex = (index + 1) % tabCount;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newIndex = (index - 1 + tabCount) % tabCount;
          break;
        case 'Home':
          e.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          newIndex = tabCount - 1;
          break;
        default:
          return;
      }
      
      setActiveTab(newIndex);
    }
  }), [activeTab, tabCount]);

  const getTabPanelProps = useCallback((index: number) => ({
    role: 'tabpanel',
    hidden: index !== activeTab,
    'aria-hidden': index !== activeTab,
    tabIndex: 0
  }), [activeTab]);

  return {
    activeTab,
    setActiveTab,
    getTabProps,
    getTabPanelProps
  };
}

/**
 * Hook for accessible combobox/autocomplete
 */
export function useCombobox(options: string[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIsOpen(true);
        setSelectedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          setInputValue(filteredOptions[selectedIndex]);
          setIsOpen(false);
          setSelectedIndex(-1);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }, [filteredOptions, selectedIndex]);

  return {
    isOpen,
    setIsOpen,
    selectedIndex,
    inputValue,
    setInputValue,
    filteredOptions,
    handleKeyDown,
    inputProps: {
      role: 'combobox',
      'aria-expanded': isOpen,
      'aria-autocomplete': 'list' as const,
      'aria-controls': 'listbox',
      value: inputValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setIsOpen(true);
      },
      onKeyDown: handleKeyDown
    },
    listboxProps: {
      role: 'listbox',
      id: 'listbox',
      hidden: !isOpen
    }
  };
}

