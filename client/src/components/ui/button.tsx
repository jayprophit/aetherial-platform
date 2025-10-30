/**
 * AETHERIAL Button Component
 * 
 * Military-Grade UI Component
 * - Zero compromises on quality
 * - Fully accessible (WCAG 2.1 AA)
 * - Type-safe with comprehensive props
 * - Performance optimized
 * - Battle-tested variants
 * 
 * @module components/ui/Button
 */

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import './Button.css';

/**
 * Button size variants
 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Button visual variants
 */
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info'
  | 'outline'
  | 'ghost'
  | 'link';

/**
 * Button props interface
 * Extends native button attributes for full HTML compatibility
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  
  /** Size of the button */
  size?: ButtonSize;
  
  /** Whether the button is in loading state */
  loading?: boolean;
  
  /** Whether the button is disabled */
  disabled?: boolean;
  
  /** Whether the button should take full width of container */
  fullWidth?: boolean;
  
  /** Icon to display before the button text */
  leftIcon?: React.ReactNode;
  
  /** Icon to display after the button text */
  rightIcon?: React.ReactNode;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Children elements (button content) */
  children?: React.ReactNode;
  
  /** ARIA label for accessibility (required if no children) */
  'aria-label'?: string;
}

/**
 * Button Component
 * 
 * A highly flexible, accessible button component that supports multiple
 * variants, sizes, loading states, and icons. Built to military-grade
 * standards with zero compromises on quality or accessibility.
 * 
 * @example
 * ```tsx
 * // Primary button
 * <Button variant="primary" size="md">
 *   Click Me
 * </Button>
 * 
 * // Button with loading state
 * <Button variant="secondary" loading>
 *   Processing...
 * </Button>
 * 
 * // Button with icons
 * <Button 
 *   variant="success" 
 *   leftIcon={<CheckIcon />}
 *   rightIcon={<ArrowIcon />}
 * >
 *   Submit
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      children,
      type = 'button',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    // Validate accessibility requirements
    if (!children && !ariaLabel) {
      console.warn(
        'Button: Either children or aria-label must be provided for accessibility'
      );
    }

    // Compute CSS classes
    const classes = [
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      fullWidth && 'btn-full-width',
      loading && 'btn-loading',
      disabled && 'btn-disabled',
      className
    ]
      .filter(Boolean)
      .join(' ');

    // Determine if button should be disabled
    const isDisabled = disabled || loading;

    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className="btn-spinner"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="btn-spinner-track"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="btn-spinner-path"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-busy={loading}
        aria-disabled={isDisabled}
        {...props}
      >
        {/* Loading spinner (shown when loading) */}
        {loading && <LoadingSpinner />}
        
        {/* Left icon */}
        {!loading && leftIcon && (
          <span className="btn-icon btn-icon-left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        
        {/* Button content */}
        {children && (
          <span className="btn-content">
            {children}
          </span>
        )}
        
        {/* Right icon */}
        {!loading && rightIcon && (
          <span className="btn-icon btn-icon-right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * Button Group Component
 * Groups multiple buttons together with proper spacing and alignment
 */
export interface ButtonGroupProps {
  /** Buttons to group */
  children: React.ReactNode;
  
  /** Orientation of the button group */
  orientation?: 'horizontal' | 'vertical';
  
  /** Whether buttons should be attached (no gap) */
  attached?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  attached = false,
  className = ''
}) => {
  const classes = [
    'btn-group',
    `btn-group-${orientation}`,
    attached && 'btn-group-attached',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="group">
      {children}
    </div>
  );
};

ButtonGroup.displayName = 'ButtonGroup';

/**
 * Icon Button Component
 * Button that contains only an icon (no text)
 */
export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  /** Icon to display */
  icon: React.ReactNode;
  
  /** ARIA label (required for accessibility) */
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        className="btn-icon-only"
        aria-label={ariaLabel}
        {...props}
      >
        <span aria-hidden="true">{icon}</span>
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default Button;

