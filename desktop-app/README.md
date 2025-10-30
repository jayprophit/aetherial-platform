# Aetherial Platform - Desktop

This directory contains the desktop application implementation for the Aetherial Platform. Built with Electron for cross-platform compatibility (Windows, macOS, Linux).

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
1. Install dependencies:
   ```bash
   cd desktop-app
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build the application:
   ```bash
   npm run build
   ```

## Project Structure

- `/src` - Source code
  - `/main` - Main process code (Electron)
  - `/renderer` - Renderer process (React)
    - `/components` - Reusable UI components
    - `/pages` - Application pages
    - `/store` - State management
    - `/styles` - Global styles and themes
  - `/shared` - Code shared between main and renderer processes
  - `/assets` - Static assets
  - `/build` - Build output

## Building for Production

### Windows
```bash
npm run package:win
```

### macOS
```bash
npm run package:mac
```

### Linux
```bash
npm run package:linux
```

## Development

### Running with hot-reload
```bash
npm run dev
```

### Packaging the application
```bash
npm run package
```

### Testing
```bash
npm test
```

## Configuration

Environment variables can be set in `.env` file:
```
ELECTRON_START_URL=http://localhost:3000
NODE_ENV=development
```
