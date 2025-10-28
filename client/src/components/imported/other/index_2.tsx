import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

// Define types for UI components
export interface ButtonStyleProps {
  $variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  $size?: 'small' | 'medium' | 'large';
  $fullWidth?: boolean;
}

export interface CardStyleProps {
  $variant?: 'default' | 'outlined' | 'elevated';
  $padding?: 'small' | 'medium' | 'large';
  $fullWidth?: boolean;
}

// Helper functions for styled components
export const getButtonStyles = ($variant = 'primary', $size = 'medium', $fullWidth = false) => {
  let styles = '';
  
  // Variant styles
  switch ($variant) {
    case 'primary':
      styles += `
        background-color: ${theme.colors.primary};
        color: ${theme.colors.white};
        border: none;
        &:hover {
          background-color: ${theme.colors.primaryDark};
        }
      `;
      break;
    case 'secondary':
      styles += `
        background-color: ${theme.colors.secondary};
        color: ${theme.colors.white};
        border: none;
        &:hover {
          background-color: ${theme.colors.secondaryDark};
        }
      `;
      break;
    case 'tertiary':
      styles += `
        background-color: transparent;
        color: ${theme.colors.primary};
        border: 1px solid ${theme.colors.primary};
        &:hover {
          background-color: ${theme.colors.lightGray};
        }
      `;
      break;
    case 'danger':
      styles += `
        background-color: ${theme.colors.danger};
        color: ${theme.colors.white};
        border: none;
        &:hover {
          background-color: ${theme.colors.dangerDark};
        }
      `;
      break;
    default:
      styles += `
        background-color: ${theme.colors.primary};
        color: ${theme.colors.white};
        border: none;
        &:hover {
          background-color: ${theme.colors.primaryDark};
        }
      `;
  }
  
  // Size styles
  switch ($size) {
    case 'small':
      styles += `
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      `;
      break;
    case 'medium':
      styles += `
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      `;
      break;
    case 'large':
      styles += `
        padding: 1rem 2rem;
        font-size: 1.125rem;
      `;
      break;
    default:
      styles += `
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      `;
  }
  
  // Full width style
  if ($fullWidth) {
    styles += `
      width: 100%;
      display: block;
    `;
  }
  
  // Common styles
  styles += `
    border-radius: ${theme.borderRadius};
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
    }
  `;
  
  return styles;
};

export const getCardStyles = ($variant = 'default', $padding = 'medium', $fullWidth = false) => {
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

// Styled components with proper TypeScript typing
export const StyledButton = styled.button<ButtonStyleProps>`
  ${props => getButtonStyles(props.$variant, props.$size, props.$fullWidth)}
`;

export const StyledCard = styled.div<CardStyleProps>`
  ${props => getCardStyles(props.$variant, props.$padding, props.$fullWidth)}
`;

// Export other common UI components
export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

export const Flex = styled.div<{
  $direction?: 'row' | 'column';
  $justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  $align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  $wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  $gap?: string;
}>`
  display: flex;
  flex-direction: ${props => props.$direction || 'row'};
  justify-content: ${props => props.$justify || 'flex-start'};
  align-items: ${props => props.$align || 'stretch'};
  flex-wrap: ${props => props.$wrap || 'nowrap'};
  gap: ${props => props.$gap || '0'};
`;

export const Grid = styled.div<{
  $columns?: string;
  $gap?: string;
}>`
  display: grid;
  grid-template-columns: ${props => props.$columns || 'repeat(12, 1fr)'};
  gap: ${props => props.$gap || '1rem'};
`;

export const Text = styled.p<{
  $size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  $weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  $color?: string;
  $align?: 'left' | 'center' | 'right';
}>`
  font-size: ${props => props.$size ? theme.fontSizes[props.$size] : theme.fontSizes.md};
  font-weight: ${props => props.$weight ? theme.fontWeights[props.$weight] : theme.fontWeights.normal};
  color: ${props => props.$color ? theme.colors[props.$color] || props.$color : theme.colors.text};
  text-align: ${props => props.$align || 'left'};
`;

export const Heading = styled.h2<{
  $size?: '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  $weight?: 'medium' | 'semibold' | 'bold' | 'extrabold';
  $color?: string;
  $align?: 'left' | 'center' | 'right';
}>`
  font-size: ${props => props.$size ? theme.fontSizes[props.$size] : theme.fontSizes['3xl']};
  font-weight: ${props => props.$weight ? theme.fontWeights[props.$weight] : theme.fontWeights.bold};
  color: ${props => props.$color ? theme.colors[props.$color] || props.$color : theme.colors.text};
  text-align: ${props => props.$align || 'left'};
  margin-bottom: ${theme.space[4]};
`;

export const Input = styled.input<{
  $fullWidth?: boolean;
  $error?: boolean;
}>`
  padding: 0.75rem 1rem;
  font-size: ${theme.fontSizes.md};
  border: 1px solid ${props => props.$error ? theme.colors.danger : theme.colors.border};
  border-radius: ${theme.borderRadius};
  background-color: ${theme.colors.white};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  transition: all 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$error ? theme.colors.danger : theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.$error ? 'rgba(231, 76, 60, 0.2)' : 'rgba(52, 152, 219, 0.2)'};
  }
  
  &::placeholder {
    color: ${theme.colors.gray};
  }
  
  &:disabled {
    background-color: ${theme.colors.lightGray};
    cursor: not-allowed;
  }
`;

export const Select = styled.select<{
  $fullWidth?: boolean;
  $error?: boolean;
}>`
  padding: 0.75rem 1rem;
  font-size: ${theme.fontSizes.md};
  border: 1px solid ${props => props.$error ? theme.colors.danger : theme.colors.border};
  border-radius: ${theme.borderRadius};
  background-color: ${theme.colors.white};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  transition: all 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$error ? theme.colors.danger : theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.$error ? 'rgba(231, 76, 60, 0.2)' : 'rgba(52, 152, 219, 0.2)'};
  }
  
  &:disabled {
    background-color: ${theme.colors.lightGray};
    cursor: not-allowed;
  }
`;

export const Textarea = styled.textarea<{
  $fullWidth?: boolean;
  $error?: boolean;
}>`
  padding: 0.75rem 1rem;
  font-size: ${theme.fontSizes.md};
  border: 1px solid ${props => props.$error ? theme.colors.danger : theme.colors.border};
  border-radius: ${theme.borderRadius};
  background-color: ${theme.colors.white};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$error ? theme.colors.danger : theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.$error ? 'rgba(231, 76, 60, 0.2)' : 'rgba(52, 152, 219, 0.2)'};
  }
  
  &::placeholder {
    color: ${theme.colors.gray};
  }
  
  &:disabled {
    background-color: ${theme.colors.lightGray};
    cursor: not-allowed;
  }
`;

export const Badge = styled.span<{
  $variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  $size?: 'small' | 'medium' | 'large';
}>`
  display: inline-block;
  padding: ${props => props.$size === 'small' ? '0.25rem 0.5rem' : props.$size === 'large' ? '0.5rem 1rem' : '0.35rem 0.75rem'};
  font-size: ${props => props.$size === 'small' ? theme.fontSizes.xs : props.$size === 'large' ? theme.fontSizes.md : theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: ${theme.radii.full};
  background-color: ${props => {
    switch (props.$variant) {
      case 'primary': return theme.colors.primary;
      case 'secondary': return theme.colors.secondary;
      case 'success': return theme.colors.success;
      case 'danger': return theme.colors.danger;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.primary;
    }
  }};
  color: ${theme.colors.white};
`;

export const Avatar = styled.div<{
  $size?: 'small' | 'medium' | 'large';
  $src?: string;
}>`
  width: ${props => props.$size === 'small' ? '32px' : props.$size === 'large' ? '64px' : '48px'};
  height: ${props => props.$size === 'small' ? '32px' : props.$size === 'large' ? '64px' : '48px'};
  border-radius: ${theme.radii.full};
  background-color: ${theme.colors.lightGray};
  background-image: ${props => props.$src ? `url(${props.$src})` : 'none'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.gray};
  font-weight: ${theme.fontWeights.bold};
  font-size: ${props => props.$size === 'small' ? theme.fontSizes.xs : props.$size === 'large' ? theme.fontSizes.lg : theme.fontSizes.md};
`;

export const Divider = styled.hr<{
  $margin?: string;
  $color?: string;
}>`
  border: none;
  border-top: 1px solid ${props => props.$color ? theme.colors[props.$color] || props.$color : theme.colors.border};
  margin: ${props => props.$margin || `${theme.space[4]} 0`};
  width: 100%;
`;

export const Spinner = styled.div<{
  $size?: 'small' | 'medium' | 'large';
  $color?: string;
}>`
  width: ${props => props.$size === 'small' ? '16px' : props.$size === 'large' ? '48px' : '32px'};
  height: ${props => props.$size === 'small' ? '16px' : props.$size === 'large' ? '48px' : '32px'};
  border: 2px solid ${theme.colors.lightGray};
  border-top: 2px solid ${props => props.$color ? theme.colors[props.$color] || props.$color : theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
