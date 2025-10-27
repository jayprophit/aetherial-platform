// AETHERIAL Ethereal Energy Design System
// Friendly & Welcoming Light/Dark Modes

export const theme = {
  // Light Mode (Day) - Friendly & Welcoming
  light: {
    background: {
      primary: '#FFFFFF',
      secondary: '#F8FAFC',
      tertiary: '#F1F5F9',
      card: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#475569',
      tertiary: '#64748B',
      muted: '#94A3B8',
    },
    border: {
      light: '#E2E8F0',
      default: '#CBD5E1',
      strong: '#94A3B8',
    },
    ethereal: {
      primary: '#00B8D4', // Softer cyan for light mode
      secondary: '#0097A7',
      glow: 'rgba(0, 184, 212, 0.15)',
    },
  },
  
  // Dark Mode (Night) - Soft & Comfortable
  dark: {
    background: {
      primary: '#1A2332', // Soft dark blue, NOT pure black
      secondary: '#0F1824',
      tertiary: '#232D3F',
      card: '#1E2836',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#CBD5E1',
      tertiary: '#94A3B8',
      muted: '#64748B',
    },
    border: {
      light: '#2D3748',
      default: '#3F4E5F',
      strong: '#4A5568',
    },
    ethereal: {
      primary: '#00D9FF', // Brighter cyan for dark mode
      secondary: '#00FFF0',
      glow: 'rgba(0, 217, 255, 0.2)',
    },
  },
  
  // Shared Colors (Same in both modes)
  colors: {
    // Ethereal Energy Brand
    primary: {
      50: '#E0F7FF',
      100: '#B3EDFF',
      200: '#80E3FF',
      300: '#4DD9FF',
      400: '#26D1FF',
      500: '#00D9FF',
      600: '#00C2E6',
      700: '#00A8CC',
      800: '#008FB3',
      900: '#006B8A',
    },
    
    // Status Colors (Friendly versions)
    success: {
      light: '#10B981',
      dark: '#34D399',
    },
    error: {
      light: '#EF4444',
      dark: '#F87171',
    },
    warning: {
      light: '#F59E0B',
      dark: '#FBBF24',
    },
    info: {
      light: '#3B82F6',
      dark: '#60A5FA',
    },
  },
  
  gradients: {
    light: {
      ethereal: 'linear-gradient(135deg, #00B8D4 0%, #0097A7 100%)',
      hero: 'linear-gradient(135deg, #F8FAFC 0%, #E0F2FE 100%)',
      card: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
    },
    dark: {
      ethereal: 'linear-gradient(135deg, #00D9FF 0%, #00FFF0 100%)',
      hero: 'linear-gradient(135deg, #1A2332 0%, #0F1824 100%)',
      card: 'linear-gradient(180deg, #1E2836 0%, #1A2332 100%)',
    },
  },
  
  shadows: {
    light: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      glow: '0 0 20px rgba(0, 184, 212, 0.3)',
      card: '0 2px 8px rgba(0, 0, 0, 0.08)',
    },
    dark: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
      glow: '0 0 20px rgba(0, 217, 255, 0.4)',
      card: '0 2px 8px rgba(0, 0, 0, 0.6)',
    },
  },
  
  animations: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    glow: 'glow 3s ease-in-out infinite',
    float: 'float 3s ease-in-out infinite',
    energyFlow: 'energyFlow 4s linear infinite',
  },
  
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      display: 'Poppins, sans-serif', // Friendly, modern
      mono: 'Fira Code, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
};

// CSS Custom Properties for both modes
export const cssVariables = `
  :root {
    --transition: ${theme.animations.transition};
  }
  
  /* Light Mode */
  [data-theme="light"] {
    --bg-primary: ${theme.light.background.primary};
    --bg-secondary: ${theme.light.background.secondary};
    --bg-tertiary: ${theme.light.background.tertiary};
    --bg-card: ${theme.light.background.card};
    
    --text-primary: ${theme.light.text.primary};
    --text-secondary: ${theme.light.text.secondary};
    --text-tertiary: ${theme.light.text.tertiary};
    --text-muted: ${theme.light.text.muted};
    
    --border-light: ${theme.light.border.light};
    --border-default: ${theme.light.border.default};
    --border-strong: ${theme.light.border.strong};
    
    --ethereal-primary: ${theme.light.ethereal.primary};
    --ethereal-secondary: ${theme.light.ethereal.secondary};
    --ethereal-glow: ${theme.light.ethereal.glow};
    
    --gradient-ethereal: ${theme.gradients.light.ethereal};
    --gradient-hero: ${theme.gradients.light.hero};
    
    --shadow-sm: ${theme.shadows.light.sm};
    --shadow-md: ${theme.shadows.light.md};
    --shadow-lg: ${theme.shadows.light.lg};
    --shadow-glow: ${theme.shadows.light.glow};
    --shadow-card: ${theme.shadows.light.card};
  }
  
  /* Dark Mode */
  [data-theme="dark"] {
    --bg-primary: ${theme.dark.background.primary};
    --bg-secondary: ${theme.dark.background.secondary};
    --bg-tertiary: ${theme.dark.background.tertiary};
    --bg-card: ${theme.dark.background.card};
    
    --text-primary: ${theme.dark.text.primary};
    --text-secondary: ${theme.dark.text.secondary};
    --text-tertiary: ${theme.dark.text.tertiary};
    --text-muted: ${theme.dark.text.muted};
    
    --border-light: ${theme.dark.border.light};
    --border-default: ${theme.dark.border.default};
    --border-strong: ${theme.dark.border.strong};
    
    --ethereal-primary: ${theme.dark.ethereal.primary};
    --ethereal-secondary: ${theme.dark.ethereal.secondary};
    --ethereal-glow: ${theme.dark.ethereal.glow};
    
    --gradient-ethereal: ${theme.gradients.dark.ethereal};
    --gradient-hero: ${theme.gradients.dark.hero};
    
    --shadow-sm: ${theme.shadows.dark.sm};
    --shadow-md: ${theme.shadows.dark.md};
    --shadow-lg: ${theme.shadows.dark.lg};
    --shadow-glow: ${theme.shadows.dark.glow};
    --shadow-card: ${theme.shadows.dark.card};
  }
  
  /* Smooth transitions for theme switching */
  * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  }
  
  /* Animations */
  @keyframes glow {
    0%, 100% { filter: drop-shadow(0 0 10px var(--ethereal-glow)); }
    50% { filter: drop-shadow(0 0 20px var(--ethereal-glow)); }
  }
  
  @keyframes energyFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

export default theme;

