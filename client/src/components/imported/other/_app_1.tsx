import React from 'react';
import type { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components';
import { AuthProvider } from '../components/auth/AuthContext';
import MainLayout from '../components/layout/MainLayout';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f9fafb;
    color: #111827;
    line-height: 1.5;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <GlobalStyle />
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </AuthProvider>
  );
}

export default MyApp;
