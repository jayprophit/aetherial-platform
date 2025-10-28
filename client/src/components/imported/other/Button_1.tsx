import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import styled from 'styled-components';

// Define the props interface with the $variant prop
interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  $variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

// Create the styled button with proper typing
const StyledButton = styled.button<ButtonProps>`
  padding: ${props => 
    props.size === 'small' ? '8px 16px' : 
    props.size === 'large' ? '16px 32px' : 
    '12px 24px'
  };
  background-color: ${props => 
    props.$variant === 'primary' ? props.theme.colors.primary : 
    props.$variant === 'secondary' ? props.theme.colors.secondary :
    props.$variant === 'outline' ? 'transparent' :
    props.theme.colors.primary
  };
  color: ${props => 
    props.$variant === 'outline' ? props.theme.colors.text :
    props.$variant === 'primary' || props.$variant === 'secondary' ? 'white' : 
    'white'
  };
  border: ${props => 
    props.$variant === 'outline' ? `1px solid ${props.theme.colors.border}` : 
    'none'
  };
  border-radius: ${props => props.theme.borderRadius || '4px'};
  font-size: ${props => 
    props.size === 'small' ? '0.9rem' : 
    props.size === 'large' ? '1.1rem' : 
    '1rem'
  };
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// Export the Button component with default props
export const Button = ({ children, $variant = 'primary', size = 'medium', ...props }: ButtonProps) => {
  return (
    <StyledButton $variant={$variant} size={size} {...props}>
      {children}
    </StyledButton>
  );
};
