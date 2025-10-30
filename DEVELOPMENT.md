# Development Guide

This guide provides comprehensive instructions for setting up the development environment, contributing to the project, and understanding the development workflow for the Aetherial Platform.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Code Style](#code-style)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- Node.js 18+
- npm 9+ or pnpm 7+
- Git 2.25+
- Docker 20.10+
- Docker Compose 2.0+
- Python 3.9+ (for some AI/ML components)

### Recommended Tools
- Visual Studio Code (with recommended extensions)
- Docker Desktop
- Postman or Insomnia (for API testing)
- TablePlus or DBeaver (for database management)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/aetherial-platform.git
cd aetherial-platform
```

### 2. Install Dependencies
```bash
# Install root dependencies
pnpm install

# Install client dependencies
cd client
pnpm install

# Install server dependencies
cd ../server
pnpm install
```

### 3. Set Up Environment Variables
Copy the example environment files and update them with your local configuration:

```bash
# Root .env
cp .env.example .env

# Client .env
cd client
cp .env.example .env.local

# Server .env
cd ../server
cp .env.example .env
```

### 4. Start Development Servers
```bash
# From the root directory
pnpm dev
```
This will start:
- Web client on http://localhost:3000
- API server on http://localhost:4000
- Database (PostgreSQL) on localhost:5432
- Redis on localhost:6379

## Project Structure

```
aetherial-platform/
├── client/                 # Web application
│   ├── public/            # Static files
│   ├── src/               # Source code
│   └── ...
├── server/                # Backend services
│   ├── src/
│   │   ├── modules/      # Feature modules
│   │   ├── shared/       # Shared utilities
│   │   └── main.ts       # Application entry point
│   └── ...
├── mobile-app/            # Mobile application (React Native)
├── desktop-app/           # Desktop application (Electron)
├── packages/              # Shared packages
│   ├── shared-components/ # UI components
│   └── shared-types/      # TypeScript types
├── docs/                  # Documentation
└── scripts/               # Development scripts
```

## Development Workflow

### Branching Strategy
We follow the [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) branching model:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `release/*` - Release preparation

### Starting a New Feature
1. Create a new branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. Push your branch and create a pull request:
   ```bash
   git push -u origin feature/your-feature-name
   ```

## Testing

### Running Tests
```bash
# Run all tests
pnpm test

# Run client tests
cd client
pnpm test

# Run server tests
cd ../server
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate test coverage
pnpm test:coverage
```

### Writing Tests
- Unit tests should be placed in `__tests__` directories next to the code they test
- Use `*.test.ts` or `*.spec.ts` naming convention
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies

## Code Style

### TypeScript
- Use TypeScript for all new code
- Enable strict mode
- Use interfaces for public API definitions
- Use types for internal type definitions
- Prefer `type` over `interface` for simple types

### React Components
- Use functional components with hooks
- Follow the [React Hooks API](https://reactjs.org/docs/hooks-reference.html) guidelines
- Use [React.memo()](https://reactjs.org/docs/react-api.html#reactmemo) for performance optimization
- Use [useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback) for callbacks passed to child components

### Styling
- Use [styled-components](https://styled-components.com/) for component styling
- Follow the [BEM](http://getbem.com/) naming convention
- Use CSS variables for theming

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples
```
feat(auth): add Google OAuth login
fix(api): resolve user registration validation issue
docs: update API documentation
```

## Pull Request Process

1. Fork the repository and create your branch from `develop`
2. Make your changes and ensure tests pass
3. Update the documentation if needed
4. Ensure your code follows the style guidelines
5. Submit a pull request to the `develop` branch
6. Address any code review feedback
7. Once approved, your PR will be merged by a maintainer

## Deployment

### Staging
Merges to the `develop` branch are automatically deployed to the staging environment.

### Production
1. Create a release branch from `develop`
2. Update the version in `package.json` following [semantic versioning](https://semver.org/)
3. Create a pull request to `main`
4. After approval, merge the PR and create a GitHub release
5. The CI/CD pipeline will automatically deploy to production

## Troubleshooting

### Common Issues

#### Database Connection Issues
- Ensure PostgreSQL and Redis are running
- Verify your `.env` file has the correct database credentials
- Try running database migrations:
  ```bash
  cd server
  pnpm db:migrate
  ```

#### Dependency Issues
- Clear the npm cache:
  ```bash
  rm -rf node_modules
  pnpm install
  ```

#### Port Conflicts
- Check for running processes on ports 3000, 4000, 5432, 6379
- Update the ports in the relevant `.env` files if needed

## Getting Help

If you encounter any issues or have questions:
1. Check the [documentation](https://docs.aetherialplatform.com)
2. Search the [issue tracker](https://github.com/your-org/aetherial-platform/issues)
3. Open a new issue if your problem isn't addressed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
