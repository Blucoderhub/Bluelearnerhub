# Frontend Configuration

BluelearnerHub Frontend is a Next.js 14 application built with TypeScript, Tailwind CSS, and modern React patterns.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (Recommended: 20 LTS)
- npm 9+ or yarn 3+

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Visit http://localhost:3000 to see your app running.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js 14 App Router
│   ├── components/       # Reusable React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── store/           # Zustand state management
│   ├── types/           # TypeScript types
│   ├── styles/          # Global styles
│   └── config/          # Configuration files
├── public/              # Static assets
└── [config files]       # Next.js, Tailwind, TypeScript configs
```

## 🛠️ Tech Stack

### Core Framework

- **Next.js 14.2.0** - React framework with App Router
- **React 18.3.0** - UI library
- **TypeScript 5.4.3** - Type safety

### Styling & UI

- **Tailwind CSS 3.4.3** - Utility-first CSS
- **shadcn/ui** - High-quality Radix UI components
- **Lucide React** - Icon library
- **Framer Motion 11.0.25** - Animation library

### Forms & Validation

- **React Hook Form 7.51.0** - Performant form handling
- **Zod 3.22.4** - Schema validation

### State Management & Data

- **Zustand 4.5.2** - Lightweight state management
- **TanStack React Query 5.28.0** - Server state management
- **Axios 1.6.8** - HTTP client

### Advanced Features

- **Monaco Editor** - Code editing
- **Three.js & React Three Fiber** - 3D graphics
- **Socket.IO** - Real-time communication
- **Next.js Auth** - Authentication
- **NextThemes** - Dark mode support

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - IDE support

## 🚀 Available Scripts

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000

# Production
npm run build           # Build for production
npm start               # Start production server

# Quality
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript compiler

# Formatting
npx prettier --write .  # Format code with Prettier
```

## 🔧 Configuration Files

### Environment Variables

Copy `.env.example` to `.env.local` and update values:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### TypeScript (tsconfig.json)

- Strict mode enabled
- ES2020 target
- Module resolution configured

### Tailwind CSS (tailwind.config.ts)

- Custom color system
- Animation utilities
- Dark mode support
- Responsive design breakpoints

### Next.js (next.config.ts)

- Image optimization
- Font optimization
- Environment-specific builds

## 📦 Key Dependencies

### UI Components (shadcn/ui)

- Buttons, Cards, Dialogs
- Dropdowns, Forms, Tooltips
- Alert dialogs, Popovers
- Tabs, Progress, Select

### Form Handling

- React Hook Form for performance
- Zod for validation schemas
- Custom form components

### Animations

- Framer Motion for React animations
- CSS animations via Tailwind
- Lottie for complex animations

### Real-time Features

- Socket.IO for WebSocket communication
- React Query for server state

### 3D Graphics

- Three.js for 3D rendering
- React Three Fiber for React integration
- Drei for helper components

## 🎨 Design System

### Color Palette

- **Primary**: Blue (#3b82f6)
- **Secondary**: Gray shades
- **Accent**: Purple, Cyan, Green, Yellow, Red
- **Support**: Success, Warning, Error, Info

### Typography

- **Sans**: Inter font (UI)
- **Mono**: JetBrains Mono (Code)

### Spacing & Sizing

- 4px base unit
- Tailwind CSS scale
- Responsive breakpoints

## 🔐 Authentication

- NextAuth.js integration
- JWT token storage
- Protected routes
- OAuth support (Google, GitHub)

## 📱 Responsive Design

Breakpoints:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🌓 Dark Mode

- Next.js Themes integration
- Automatic class-based switching
- Persistent user preference
- Smooth transitions

## 🔗 API Integration

- Axios instance in `lib/api.ts`
- Request/response interceptors
- Error handling
- JWT token injection

## 📊 State Management

### Zustand Stores

- Authentication store
- UI state store
- Quiz store
- Hackathon store
- Notification store
- Theme store

### React Query

- Server state caching
- Background refetching
- Pessimistic updates
- Infinite queries

## 🐛 Debugging

### VS Code Extensions Recommended

- ES7+ React/Redux/GraphQL Snippets
- Tailwind CSS IntelliSense
- Thunder Client (API testing)
- Prettier - Code formatter

### Browser DevTools

- React DevTools
- Redux DevTools (for Zustand)

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Connected to GitHub - auto-deploys on push
```

### Docker

```bash
npm run build
npm start
```

### Static Export

```bash
# Enable static export in next.config.ts
# npm run build generates static HTML/CSS/JS
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion)

## 📄 License

Proprietary - © 2026 BluelearnerHub (Powered by Bluecoderhub)
