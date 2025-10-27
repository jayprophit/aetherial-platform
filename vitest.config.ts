import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(import.meta.dirname),
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./client/src/test/setup.ts'],
    include: [
      'server/**/*.test.ts',
      'server/**/*.spec.ts',
      'client/src/**/*.test.ts',
      'client/src/**/*.test.tsx',
      'client/src/**/*.spec.ts',
      'client/src/**/*.spec.tsx',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'client/src/test/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './client/src'),
      '@server': path.resolve(import.meta.dirname, './server'),
    },
  },
});
