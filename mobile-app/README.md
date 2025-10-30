# Aetherial Platform - Mobile

This directory contains the mobile application implementation for the Aetherial Platform. Built with React Native for cross-platform compatibility (iOS and Android).

## Getting Started

### Prerequisites
- Node.js 16+
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation
1. Install dependencies:
   ```bash
   cd mobile-app
   npm install
   ```

2. Start the development server:
   ```bash
   npx react-native start
   ```

3. Run on iOS:
   ```bash
   npx react-native run-ios
   ```

4. Run on Android:
   ```bash
   npx react-native run-android
   ```

## Project Structure

- `/src` - Source code
  - `/components` - Reusable UI components
  - `/screens` - App screens
  - `/navigation` - Navigation configuration
  - `/services` - API and service integrations
  - `/utils` - Utility functions
  - `/assets` - Images, fonts, and other static assets
  - `/hooks` - Custom React hooks
  - `/context` - React context providers
  - `/config` - App configuration
  - `/types` - TypeScript type definitions

## Building for Production

### iOS
```bash
cd ios
pod install
cd ..
npx react-native run-ios --configuration Release
```

### Android
```bash
cd android
./gradlew assembleRelease
```
