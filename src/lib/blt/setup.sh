#!/bin/bash

# Install dependencies
npm init -y
npm install --save-dev typescript @types/node @types/jest ts-jest jest @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint
npm install @tensorflow/tfjs @tensorflow/tfjs-node onnxruntime-node zod

# Create necessary directories
mkdir -p src/tests

# Initialize TypeScript
npx tsc --init --target ES2020 --module commonjs --esModuleInterop true --strict true --skipLibCheck true --forceConsistentCasingInFileNames true --outDir ./dist --rootDir ./

# Create .eslintrc.json
cat > .eslintrc.json << 'EOL'
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "off"
  },
  "env": {
    "node": true,
    "jest": true
  }
}
EOL

echo "Setup complete! Run 'npm run build' to compile the TypeScript code."
