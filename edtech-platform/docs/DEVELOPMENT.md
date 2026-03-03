# Development Guide

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- Redis 7+
- Git

### Setup Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd edtech-platform
```

2. **Install Dependencies**

Frontend:
```bash
cd frontend
npm install
```

Backend:
```bash
cd backend
npm install
```

AI Services:
```bash
cd ai-services
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Configure Environment**

Copy example files and update:
```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
cp ai-services/.env.example ai-services/.env
```

4. **Start Development Servers**

Frontend:
```bash
cd frontend
npm run dev
# Accessible at http://localhost:3000
```

Backend:
```bash
cd backend
npm run dev
# Accessible at http://localhost:5000
```

AI Services:
```bash
cd ai-services
python app/main.py
# Accessible at http://localhost:8000
```

## Project Structure

```
edtech-platform/
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js 14 app router
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities
│   │   ├── store/         # Zustand stores
│   │   └── types/         # TypeScript types
│   └── public/            # Static assets
│
├── backend/               # Express.js backend
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utilities
│   └── tests/             # Test files
│
└── ai-services/           # FastAPI services
    ├── app/
    │   ├── api/           # API routes
    │   ├── models/        # ML models
    │   ├── services/      # Business logic
    │   └── schemas/       # Pydantic schemas
    └── data/              # Training data
```

## Development Workflow

### Creating a New Feature

1. **Create feature branch**
```bash
git checkout -b feature/feature-name
```

2. **Backend Implementation**
   - Create route in `routes/`
   - Create controller in `controllers/`
   - Add business logic in `services/`
   - Update database models if needed

3. **Frontend Implementation**
   - Create component in `components/`
   - Create page in `app/`
   - Add API calls in `lib/api.ts`
   - Update state management in `store/`

4. **Testing**
```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test

# AI Services
cd ai-services
pytest
```

5. **Push and Create PR**
```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/feature-name
```

## Testing

### Backend Tests
```bash
cd backend
npm run test              # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm run test            # Run all tests
npm run test:watch     # Watch mode
```

### AI Services Tests
```bash
cd ai-services
pytest                  # Run all tests
pytest -v             # Verbose output
pytest --cov          # Coverage report
```

## Code Quality

### Linting

Frontend:
```bash
npm run lint
npm run lint --fix
```

Backend:
```bash
npm run lint
npm run lint --fix
```

### Type Checking

Frontend & Backend (TypeScript):
```bash
npm run type-check
```

## Database Management

### Migrations

Create migration:
```bash
cd backend
npm run migration:create -- -n migration_name
```

Run migrations:
```bash
npm run migration:run
```

### Seed Data

```bash
cd backend
npm run seed:data
```

## Debugging

### Backend Debugging
```bash
# Using node inspector
node --inspect-brk dist/server.js

# In VS Code, add to .vscode/launch.json:
{
  "type": "node",
  "request": "attach",
  "name": "Attach",
  "port": 9229
}
```

### Frontend Debugging
- Use React Developer Tools extension
- Use Next.js debug mode in VS Code

### Database Debugging
```bash
# Connect to PostgreSQL
psql -h localhost -U postgres -d edtech_platform

# Useful commands
\dt              # List tables
\d table_name    # Describe table
SELECT * FROM table_name LIMIT 10;
```

## Git Workflow

### Commit Messages
Use conventional commits:
```
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update dependencies
```

### Branch Naming
```
feature/feature-name
bugfix/bug-name
hotfix/critical-fix
docs/documentation-update
```

## Useful Commands

### Frontend
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run linter
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
```

### Backend
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run linter
npm run test             # Run tests
npm run migration:run    # Run migrations
```

### AI Services
```bash
python app/main.py       # Start server
pytest                   # Run tests
pytest --cov            # Run with coverage
```

## Environment Setup for Different OS

### Windows
```bash
# Use PowerShell or CMD
cd frontend
npm install
set NODE_ENV=development
npm run dev
```

### macOS/Linux
```bash
cd frontend
npm install
export NODE_ENV=development
npm run dev
```

## Contributing Guidelines

1. Follow the existing code style
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation
5. Request code review before merging
6. Ensure all tests pass before merging

## Performance Optimization

- Profile frontend with Chrome DevTools
- Use React.memo for expensive components
- Implement pagination for large datasets
- Use database indexes efficiently
- Cache frequently accessed data
- Optimize images and assets

## Common Issues and Solutions

### Port already in use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database connection errors
- Verify PostgreSQL is running
- Check connection string in .env
- Ensure database exists

### Node modules issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
