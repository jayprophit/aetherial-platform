import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '../components/auth/AuthContext';
import { AIBusinessAgentProvider } from '../ai/services/AIBusinessAgent';
import { ContentModerationSystemProvider } from '../services/ContentModerationSystem';
import { DigitalAssetManagerProvider } from '../services/DigitalAssetManager';
import GlobalStyle from '../styles/GlobalStyle';
import theme from '../styles/theme';

// Create a client for React Query
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <AIBusinessAgentProvider>
            <ContentModerationSystemProvider>
              <DigitalAssetManagerProvider>
                <GlobalStyle />
                <Component {...pageProps} />
              </DigitalAssetManagerProvider>
            </ContentModerationSystemProvider>
          </AIBusinessAgentProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
