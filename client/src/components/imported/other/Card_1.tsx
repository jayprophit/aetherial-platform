import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

// Define types for card props
interface CardStyleProps {
  $variant?: 'default' | 'outlined' | 'elevated';
  $padding?: 'small' | 'medium' | 'large';
  $fullWidth?: boolean;
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, CardStyleProps {
  children: React.ReactNode;
}

// Use transient props with $ prefix to avoid DOM warnings
const getCardStyles = ($variant = 'default', $padding = 'medium', $fullWidth = false) => {
  let styles = '';
  
  // Variant styles
  switch ($variant) {
    case 'default':
      styles += `
        background-color: ${theme.colors.white};
        border: none;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      `;
      break;
    case 'outlined':
      styles += `
        background-color: ${theme.colors.white};
        border: 1px solid ${theme.colors.lightGray};
        box-shadow: none;
      `;
      break;
    case 'elevated':
      styles += `
        background-color: ${theme.colors.white};
        border: none;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
      `;
      break;
    default:
      styles += `
        background-color: ${theme.colors.white};
        border: none;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      `;
  }
  
  // Padding styles
  switch ($padding) {
    case 'small':
      styles += `
        padding: 0.75rem;
      `;
      break;
    case 'medium':
      styles += `
        padding: 1.5rem;
      `;
      break;
    case 'large':
      styles += `
        padding: 2.5rem;
      `;
      break;
    default:
      styles += `
        padding: 1.5rem;
      `;
  }
  
  // Full width style
  if ($fullWidth) {
    styles += `
      width: 100%;
    `;
  }
  
  // Common styles
  styles += `
    border-radius: ${theme.borderRadius};
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  `;
  
  return styles;
};

// Use transient props with $ prefix to avoid passing them to DOM
const StyledCard = styled.div<CardStyleProps>`
  ${props => getCardStyles(props.$variant, props.$padding, props.$fullWidth)}
`;

// Card component with proper TypeScript typing
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, $variant, $padding, $fullWidth, ...props }, ref) => {
    return (
      <StyledCard
        ref={ref}
        $variant={$variant}
        $padding={$padding}
        $fullWidth={$fullWidth}
        {...props}
      >
        {children}
      </StyledCard>
    );
  }
);

Card.displayName = 'Card';

export default Card;
