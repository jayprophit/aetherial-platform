/**
 * Accessibility Utilities
 * 
 * Provides utilities for implementing WCAG 2.1 Level AA compliance
 */

/**
 * Generate unique ID for ARIA attributes
 */
export function generateAriaId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Check if element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  if (element.tabIndex < 0) return false;
  if (element.hasAttribute('disabled')) return false;
  if (element.getAttribute('aria-hidden') === 'true') return false;
  
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  
  return true;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(',');
  
  const elements = Array.from(container.querySelectorAll(selector)) as HTMLElement[];
  return elements.filter(isFocusable);
}

/**
 * Trap focus within a container (for modals, dialogs)
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = getFocusableElements(container);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };
  
  container.addEventListener('keydown', handleTabKey);
  
  // Focus first element
  firstFocusable?.focus();
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Calculate color contrast ratio
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    // Calculate relative luminance
    const [rs, gs, bs] = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color contrast meets WCAG AA standards
 */
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }
  
  // AA level
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Skip to main content link handler
 */
export function setupSkipToMain() {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-to-main';
  skipLink.textContent = 'Skip to main content';
  
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const main = document.getElementById('main-content');
    if (main) {
      main.tabIndex = -1;
      main.focus();
      main.removeAttribute('tabindex');
    }
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Manage focus on route change
 */
export function manageFocusOnRouteChange(pageTitle: string) {
  // Announce page change to screen readers
  announceToScreenReader(`Navigated to ${pageTitle}`);
  
  // Focus main content or heading
  const main = document.getElementById('main-content');
  const h1 = document.querySelector('h1');
  
  if (main) {
    main.tabIndex = -1;
    main.focus();
    main.removeAttribute('tabindex');
  } else if (h1) {
    (h1 as HTMLElement).tabIndex = -1;
    (h1 as HTMLElement).focus();
    (h1 as HTMLElement).removeAttribute('tabindex');
  }
}

/**
 * Create accessible button
 */
export function createAccessibleButton(
  text: string,
  onClick: () => void,
  options: {
    ariaLabel?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  } = {}
): HTMLButtonElement {
  const button = document.createElement('button');
  button.textContent = text;
  button.type = options.type || 'button';
  button.onclick = onClick;
  
  if (options.ariaLabel) {
    button.setAttribute('aria-label', options.ariaLabel);
  }
  
  if (options.disabled) {
    button.disabled = true;
    button.setAttribute('aria-disabled', 'true');
  }
  
  return button;
}

/**
 * Create accessible form field
 */
export function createAccessibleFormField(
  label: string,
  type: string = 'text',
  options: {
    required?: boolean;
    placeholder?: string;
    ariaDescribedBy?: string;
    ariaInvalid?: boolean;
    errorMessage?: string;
  } = {}
): { container: HTMLDivElement; input: HTMLInputElement; label: HTMLLabelElement } {
  const container = document.createElement('div');
  container.className = 'form-field';
  
  const id = generateAriaId('field');
  
  const labelElement = document.createElement('label');
  labelElement.htmlFor = id;
  labelElement.textContent = label;
  if (options.required) {
    labelElement.innerHTML += ' <span aria-label="required">*</span>';
  }
  
  const input = document.createElement('input');
  input.type = type;
  input.id = id;
  
  if (options.placeholder) {
    input.placeholder = options.placeholder;
  }
  
  if (options.required) {
    input.required = true;
    input.setAttribute('aria-required', 'true');
  }
  
  if (options.ariaDescribedBy) {
    input.setAttribute('aria-describedby', options.ariaDescribedBy);
  }
  
  if (options.ariaInvalid) {
    input.setAttribute('aria-invalid', 'true');
  }
  
  if (options.errorMessage) {
    const errorId = `${id}-error`;
    const errorElement = document.createElement('div');
    errorElement.id = errorId;
    errorElement.className = 'error-message';
    errorElement.setAttribute('role', 'alert');
    errorElement.textContent = options.errorMessage;
    
    input.setAttribute('aria-describedby', errorId);
    container.appendChild(errorElement);
  }
  
  container.appendChild(labelElement);
  container.appendChild(input);
  
  return { container, input, label: labelElement };
}

/**
 * Keyboard navigation helper
 */
export class KeyboardNavigationHelper {
  private elements: HTMLElement[] = [];
  private currentIndex: number = 0;
  
  constructor(elements: HTMLElement[]) {
    this.elements = elements;
  }
  
  handleKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        this.next();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        this.previous();
        break;
      case 'Home':
        e.preventDefault();
        this.first();
        break;
      case 'End':
        e.preventDefault();
        this.last();
        break;
    }
  }
  
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.elements.length;
    this.focus();
  }
  
  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.elements.length) % this.elements.length;
    this.focus();
  }
  
  first() {
    this.currentIndex = 0;
    this.focus();
  }
  
  last() {
    this.currentIndex = this.elements.length - 1;
    this.focus();
  }
  
  focus() {
    this.elements[this.currentIndex]?.focus();
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Get accessible color scheme preference
 */
export function getColorSchemePreference(): 'light' | 'dark' | 'no-preference' {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'no-preference';
}

/**
 * Create accessible modal
 */
export function createAccessibleModal(
  title: string,
  content: HTMLElement,
  onClose: () => void
): { modal: HTMLElement; cleanup: () => void } {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  
  const titleId = generateAriaId('modal-title');
  modal.setAttribute('aria-labelledby', titleId);
  
  const titleElement = document.createElement('h2');
  titleElement.id = titleId;
  titleElement.textContent = title;
  
  const closeButton = createAccessibleButton('Close', onClose, {
    ariaLabel: 'Close dialog'
  });
  closeButton.className = 'modal-close';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.appendChild(titleElement);
  modalContent.appendChild(closeButton);
  modalContent.appendChild(content);
  
  modal.appendChild(modalContent);
  
  // Trap focus
  const cleanup = trapFocus(modal);
  
  // Close on Escape
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  modal.addEventListener('keydown', handleEscape);
  
  // Announce modal opening
  announceToScreenReader(`${title} dialog opened`, 'assertive');
  
  return {
    modal,
    cleanup: () => {
      cleanup();
      modal.removeEventListener('keydown', handleEscape);
    }
  };
}

/**
 * Format number for screen readers
 */
export function formatNumberForScreenReader(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format date for screen readers
 */
export function formatDateForScreenReader(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
}

