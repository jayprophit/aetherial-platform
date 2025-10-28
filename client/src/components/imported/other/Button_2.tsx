import React from 'react';
import styled from 'styled-components';

// Define button variants and sizes as types
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'warning';
type ButtonSize = 'small' | 'medium' | 'large';

// Define the props interface with transient props for styled-components
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
  children: React.ReactNode;
}

// Create the styled button component with transient props
const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  
  /* Handle width */
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  
  /* Handle variants */
  background-color: ${props => {
    switch (props.$variant) {
      case 'primary':
        return '#4A6CF7';
      case 'secondary':
        return '#F8FAFC';
      case 'warning':
        return '#FFC107';
      case 'outline':
      case 'text':
        return 'transparent';
      default:
        return '#4A6CF7';
    }
  }};
  
  color: ${props => {
    switch (props.$variant) {
      case 'primary':
        return 'white';
      case 'secondary':
        return '#1E293B';
      case 'warning':
        return '#1E293B';
      case 'outline':
        return '#4A6CF7';
      case 'text':
        return '#4A6CF7';
      default:
        return 'white';
    }
  }};
  
  border: ${props => {
    switch (props.$variant) {
      case 'outline':
        return '1px solid #4A6CF7';
      case 'text':
        return 'none';
      default:
        return 'none';
    }
  }};
  
  /* Handle sizes */
  font-size: ${props => {
    switch (props.$size) {
      case 'small':
        return '0.875rem';
      case 'large':
        return '1.125rem';
      default:
        return '1rem';
    }
  }};
  
  padding: ${props => {
    switch (props.$size) {
      case 'small':
        return '0.375rem 0.75rem';
      case 'large':
        return '0.75rem 1.5rem';
      default:
        return '0.5rem 1rem';
    }
  }};
  
  /* Handle disabled state */
  opacity: ${props => props.disabled ? 0.6 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  /* Handle hover state */
  &:hover:not(:disabled) {
    background-color: ${props => {
      switch (props.$variant) {
        case 'primary':
          return '#3B55D9';
        case 'secondary':
          return '#E2E8F0';
        case 'warning':
          return '#E6A800';
        case 'outline':
          return 'rgba(74, 108, 247, 0.1)';
        case 'text':
          return 'rgba(74, 108, 247, 0.1)';
        default:
          return '#3B55D9';
      }
    }};
  }
  
  /* Handle focus state */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.3);
  }
`;

// Create the Button component
const Button: React.FC<ButtonProps> = ({ 
  children, 
  $variant = 'primary', 
  $size = 'medium', 
  $fullWidth = false,
  ...props 
}) => {
  return (
    <StyledButton
      $variant={$variant}
      $size={$size}
      $fullWidth={$fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
