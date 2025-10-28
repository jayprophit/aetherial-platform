import React from 'react';
import styled from 'styled-components';

// Define card props with transient props for styled-components
interface CardProps {
  $elevated?: boolean;
  $rounded?: boolean;
  $padding?: 'none' | 'small' | 'medium' | 'large';
  $fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

// Create the styled card component
const StyledCard = styled.div<CardProps>`
  background-color: white;
  border-radius: ${props => props.$rounded ? '0.5rem' : '0'};
  box-shadow: ${props => props.$elevated 
    ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
    : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'};
  overflow: hidden;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  
  padding: ${props => {
    switch (props.$padding) {
      case 'none':
        return '0';
      case 'small':
        return '0.75rem';
      case 'large':
        return '1.5rem';
      default:
        return '1rem';
    }
  }};
`;

// Create the Card component
const Card: React.FC<CardProps> = ({ 
  children, 
  $elevated = false, 
  $rounded = true, 
  $padding = 'medium',
  $fullWidth = false,
  className,
  ...props 
}) => {
  return (
    <StyledCard
      $elevated={$elevated}
      $rounded={$rounded}
      $padding={$padding}
      $fullWidth={$fullWidth}
      className={className}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

// Card Header component
const CardHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #E5E7EB;
  font-weight: 600;
  font-size: 1.125rem;
`;

// Card Body component
const CardBody = styled.div`
  padding: 1rem;
`;

// Card Footer component
const CardFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid #E5E7EB;
  background-color: #F8FAFC;
`;

export { Card, CardHeader, CardBody, CardFooter };
export default Card;
