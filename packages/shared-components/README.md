# Shared UI Components

A collection of reusable UI components designed to work across all Aetherial Platform applications (web, mobile, and desktop).

## Getting Started

### Installation
```bash
# From the root directory
cd packages/shared-components
npm install
```

### Development
```bash
# Start storybook for component development
npm run storybook

# Build the library
npm run build

# Run tests
npm test

# Run tests in watch mode
npm test:watch
```

## Project Structure

- `/src` - Source code
  - `/components` - Reusable UI components
    - `/atoms` - Basic building blocks (Button, Input, etc.)
    - `/molecules` - Simple component compositions
    - `/organisms` - Complex UI components
    - `/templates` - Page layouts
  - `/themes` - Design tokens and theming
  - `/utils` - Utility functions
  - `/hooks` - Custom React hooks
  - `/types` - TypeScript type definitions
  - `/styles` - Global styles and CSS-in-JS utilities

## Usage

### In Web Application
```tsx
import { Button } from '@aetherial-platform/shared-components';

function MyComponent() {
  return <Button>Click me</Button>;
}
```

### In Mobile Application
```tsx
import { Button } from '@aetherial-platform/shared-components/native';

function MyComponent() {
  return <Button>Click me</Button>;
}
```

## Theming

All components are themable. To customize the theme:

```tsx
import { ThemeProvider } from '@aetherial-platform/shared-components';

export default function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

## Contributing

1. Create a new branch for your feature
2. Add your component in the appropriate directory
3. Write tests for your component
4. Update the documentation in the component's `.mdx` file
5. Submit a pull request

## Testing

We use Jest and React Testing Library for testing. Each component should have corresponding test files.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Generate test coverage
npm run test:coverage
```

## Storybook

We use Storybook for component development and documentation. To start the Storybook server:

```bash
npm run storybook
```

## Building

To build the library for production:

```bash
npm run build
```

This will generate:
- `dist/` - ES modules (for bundlers)
- `cjs/` - CommonJS modules
- `types/` - TypeScript type definitions
