# Platform-Specific Build and Deployment Scripts
# This file contains optimized build commands for different hosting platforms

# Install all dependencies
npm install

# Individual service build scripts
npm run build:frontend   # Next.js production build
npm run build:backend    # TypeScript compilation
npm run build:ai         # Python dependencies and setup

# Platform-specific deployment
npm run deploy:vercel    # Deploy to Vercel
npm run deploy:railway   # Deploy to Railway  
npm run deploy:aws       # Deploy to AWS
npm run deploy:docker    # Build and run Docker containers

# Development commands
npm run dev              # Start all services in development
npm run dev:frontend     # Frontend only (port 3000)
npm run dev:backend      # Backend only (port 5000)
npm run dev:ai           # AI services only (port 8000)

# Testing commands
npm run test:all         # Run all tests
npm run test:frontend    # Frontend tests only
npm run test:backend     # Backend tests only
npm run test:ai          # AI services tests

# Linting and formatting
npm run lint:all         # Lint all services
npm run format:all       # Format all code

# Database operations
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with sample data
npm run db:reset         # Reset and recreate database

# ⚡ Google Gemini AI Configuration
# The platform now uses Google Gemini API exclusively
# API Key: REPLACE_WITH_YOUR_GEMINI_API_KEY
# Make sure this is set in your environment variables:
# GEMINI_API_KEY=REPLACE_WITH_YOUR_GEMINI_API_KEY

## 🧠 AI Training Data Generation - 10,000+ Questions

### Complete Pipeline (Recommended)
Generate 10,000+ quiz and hackathon questions using AI and external sources:

```bash
# Run complete training data generation pipeline
cd ai-services
python -m app.training.run_training_generation

# Quick generation for testing (100 questions)
python -m app.training.run_training_generation --quick 100

# Skip specific phases if needed
python -m app.training.run_training_generation --skip-generation  # Skip AI generation
python -m app.training.run_training_generation --skip-collection  # Skip external collection
python -m app.training.run_training_generation --skip-preparation # Skip data preparation
```

### Individual Components

#### 1. AI-Generated Questions (7,000+ questions)
```bash
# Generate comprehensive quiz questions using Google Gemini API
python -m app.training.generate_training_data

# Categories covered:
# - Programming Fundamentals (800 questions)
# - Data Structures (900 questions) 
# - Algorithms (1000 questions)
# - Web Development (1200 questions)
# - Data Science (800 questions)
# - Artificial Intelligence (600 questions)
# - Cybersecurity (500 questions)
# - Cloud Computing (600 questions)
# - Mobile Development (500 questions)
# - System Design (400 questions)
# - Hackathon Projects (800 questions)
```

#### 2. External Data Collection (3,000+ questions)
```bash
# Collect from GitHub repos, competitive programming sites
python -m app.training.collect_external_data

# Sources include:
# - GitHub repositories (coding-interview-university, algorithms, etc.)
# - Competitive programming patterns
# - Web development questions
# - Educational content from multiple platforms
```

#### 3. Training Data Preparation
```bash
# Clean, augment, and format data for AI training
python -m app.training.prepare_training_data

# Features:
# - Data cleaning and validation
# - Question augmentation and variations
# - Dataset balancing by category/difficulty
# - Train/validation/test splits (80/10/10)
# - Export in multiple formats (JSONL, Parquet, CSV)
```

### Database Setup for Training Data
```bash
# Apply training data schema migration
psql -d $DATABASE_URL -f database/migrations/003_training_data_schema.sql

# Verify tables created
psql -d $DATABASE_URL -c "\\dt *questions*"
```

### Training Data Validation
```bash
# Check question counts and distribution
psql -d $DATABASE_URL -c "
SELECT 
  'Quiz Questions' as type, COUNT(*) as total,
  COUNT(CASE WHEN validation_split = 'train' THEN 1 END) as train_count,
  COUNT(CASE WHEN validation_split = 'validation' THEN 1 END) as val_count,
  COUNT(CASE WHEN validation_split = 'test' THEN 1 END) as test_count
FROM quiz_questions WHERE is_active = true
UNION ALL
SELECT 
  'Hackathon Questions', COUNT(*),
  COUNT(CASE WHEN validation_split = 'train' THEN 1 END),
  COUNT(CASE WHEN validation_split = 'validation' THEN 1 END),
  COUNT(CASE WHEN validation_split = 'test' THEN 1 END)
FROM hackathon_questions WHERE is_active = true;"

# Check category distribution
psql -d $DATABASE_URL -c "
SELECT category, COUNT(*) as count, 
       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM quiz_questions 
WHERE is_active = true 
GROUP BY category 
ORDER BY count DESC;"
```

### Training Data Export Formats
After generation, training data is available in multiple formats:

```bash
# JSONL format (for transformers/LLM training)
ls ai-services/data/processed_training_data/*.jsonl

# Parquet format (for efficient storage/processing) 
ls ai-services/data/processed_training_data/*.parquet

# Metadata and statistics
cat ai-services/data/processed_training_data/*_metadata.json
```

### Environment Variables Required
```bash
# Google Gemini API (primary)
GEMINI_API_KEY=REPLACE_WITH_YOUR_GEMINI_API_KEY

# Database connection
DB_HOST=localhost
DB_NAME=edtech_platform  
DB_USER=postgres
DB_PASSWORD=your_password
DB_PORT=5432
```

### Expected Output
- **Total Questions**: 10,000+ (Quiz: 8,000+, Hackathon: 2,000+)
- **AI Generated**: ~70% using Google Gemini API
- **External Sources**: ~30% from GitHub, competitive programming  
- **Categories**: 15+ technical categories
- **Difficulty Levels**: Beginner, Intermediate, Advanced, Expert
- **Question Types**: Multiple choice, coding, true/false, fill-in-blank
- **Training Splits**: 80% train, 10% validation, 10% test
- **Export Formats**: JSONL, Parquet, CSV with metadata