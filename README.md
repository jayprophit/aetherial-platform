# AETHERIAL Platform

> **Unified Social, E-Commerce, E-Learning, AI, Blockchain, and IoT Platform**

![AETHERIAL Logo](./client/public/images/logo.png)

## 🌟 Overview

AETHERIAL is a revolutionary all-in-one platform that combines social networking, e-commerce, e-learning, AI agents, blockchain technology, and IoT integration into a seamless, ethereal experience. Built from scratch with modern technologies and inspired by the best features of BuddyBoss, WordPress, Shopify, and cutting-edge AI platforms.

## ✨ Key Features

### 🤝 Social Networking
- Activity feed with posts, comments, likes, shares
- Friend system with requests and suggestions
- Groups with privacy controls
- Private messaging with real-time chat
- User profiles with customization
- Notifications system

### 🛍️ E-Commerce
- Product marketplace with advanced search
- Shopping cart and checkout
- Seller dashboards
- Order management
- Reviews and ratings
- Wishlist and favorites

### 🎓 E-Learning
- Course catalog with video content
- Progress tracking
- Certificates
- Teaching tools
- Interactive assessments

### 💼 Job Marketplace
- Job listings with filters
- Application tracking
- Employer dashboards
- Resume management

### 🤖 AI Integration
- 3D AI Avatar Assistant (AAA game-quality rendering)
- Multiple display modes (Full, Avatar Only, Text Only, Floating Energy Ball)
- Character customization (body, face, hair, outfits)
- Photo-to-avatar AI generation
- Voice interaction (TTS/STT)
- AI reasoning display
- Multiple AI models (GPT-4, Claude, Gemini, etc.)

### ⛓️ Blockchain & Web3
- Cryptocurrency wallet
- NFT marketplace
- Trading platform
- Smart contracts
- Decentralized governance

### 🌐 IoT & Robotics
- Device management
- Real-time monitoring
- Automation controls
- Robotics integration

## 🎨 Design System

### Ethereal Energy Theme
- **Light Mode:** Soft whites, warm grays, friendly cyan (#00B8D4)
- **Dark Mode:** Comfortable dark blues (#1A2332), NOT pure black
- **Accent:** Glowing ethereal cyan energy (#00D9FF → #00FFF0)
- **Effects:** Animated glows, energy ribbons, particle effects

### Responsive Design
- Desktop: Full sidebar navigation
- Tablet: Collapsible sidebars
- Mobile: Hamburger menu with bottom navigation

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Routing:** Wouter
- **Styling:** Tailwind CSS + Custom CSS Variables
- **3D Graphics:** Three.js (for AI avatar)
- **State Management:** React Context
- **UI Components:** Custom + Radix UI
- **Animations:** CSS animations + Framer Motion

### Backend
- **Runtime:** Node.js 22
- **Framework:** Express.js
- **Database:** PostgreSQL (via Drizzle ORM)
- **Authentication:** JWT + OAuth
- **Real-time:** WebSocket
- **File Storage:** S3-compatible

### DevOps
- **Package Manager:** pnpm
- **Build Tool:** Vite
- **Version Control:** Git + GitHub
- **CI/CD:** GitHub Actions
- **Hosting:** Manus Platform

## 📦 Installation

### Prerequisites
- Node.js 22+
- pnpm 10+
- PostgreSQL 14+

### Quick Start

```bash
# Clone repository
git clone https://github.com/jayprophit/aetherial-platform.git
cd aetherial-platform

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/aetherial

# Authentication
JWT_SECRET=your-secret-key
OAUTH_SERVER_URL=your-oauth-url

# S3 Storage
S3_BUCKET=your-bucket
S3_REGION=your-region
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# AI Services (Optional)
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
```

## 🚀 Development

### Project Structure

```
aetherial-platform/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── styles/        # Global styles & theme
│   │   └── App.tsx        # Main app component
│   └── public/            # Static assets
├── server/                # Backend application
│   ├── routes/           # API routes
│   ├── db/               # Database schemas
│   └── index.ts          # Server entry point
├── docs/                 # Documentation
├── CHANGELOG.md          # Version history
├── PROGRESS.md           # Feature completion tracking
├── todo.md               # Development tasks
└── README.md             # This file
```

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server (client + server)
pnpm dev:client       # Start client only
pnpm dev:server       # Start server only

# Database
pnpm db:push          # Push schema changes
pnpm db:studio        # Open database studio

# Build
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript checks
```

## 📊 Progress Tracking

See [PROGRESS.md](./PROGRESS.md) for detailed feature completion status.

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## 📄 License

This project is proprietary and confidential.

## 🔗 Links

- **GitHub:** https://github.com/jayprophit/aetherial-platform
- **Live Demo:** Coming soon
- **Documentation:** [docs/](./docs/)

## 👤 Author

**Jay Prophet**
- GitHub: [@jayprophit](https://github.com/jayprophit)

## 🙏 Acknowledgments

Inspired by:
- BuddyBoss (social features)
- WordPress (CMS architecture)
- Shopify (e-commerce)
- Claude/ChatGPT (AI interfaces)
- Manus (development platform)

---

**Built with ❤️ and ethereal energy** ✨

