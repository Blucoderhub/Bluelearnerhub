# 🧠 AI Training Data Generation System

This system generates 10,000+ high-quality quiz and hackathon questions for training AI models using Google Gemini API and external data sources.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [System Architecture](#system-architecture)
- [Generated Data Structure](#generated-data-structure)
- [Usage Examples](#usage-examples)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

### What This System Generates

- **Total Questions**: 10,000+ training questions
- **Quiz Questions**: 8,000+ (70% AI-generated, 30% external sources)
- **Hackathon Questions**: 2,000+ project-based challenges
- **Categories**: 15+ technical domains
- **Question Types**: Multiple choice, coding, true/false, fill-in-blank
- **Difficulty Levels**: Beginner, Intermediate, Advanced, Expert

### Key Features

- **AI-Powered Generation**: Uses Google Gemini 1.5 Flash for intelligent question creation
- **External Data Collection**: Scrapes GitHub repos and educational platforms
- **Data Augmentation**: Creates variations and difficulty levels automatically
- **Multiple Export Formats**: JSONL, Parquet, CSV for different use cases
- **Training-Ready Splits**: 80% train, 10% validation, 10% test
- **Comprehensive Metadata**: Tags, difficulty, timing, and quality weights

## 🚀 Quick Start

### Prerequisites

```bash
# Database setup (PostgreSQL required)
psql -d $DATABASE_URL -f database/migrations/003_training_data_schema.sql

# Environment variables
export GEMINI_API_KEY=YOUR_GEMINI_API_KEY
export DB_HOST=localhost
export DB_NAME=edtech_platform
export DB_USER=postgres
export DB_PASSWORD=your_password
export DB_PORT=5432
```

### Install Dependencies

```bash
cd ai-services
pip install -r requirements.txt
```

### Generate Training Data

```bash
# Complete pipeline (recommended - generates all 10,000+ questions)
python -m app.training.run_training_generation

# Quick test generation (100 questions)
python -m app.training.run_training_generation --quick 100

# Skip specific phases
python -m app.training.run_training_generation --skip-generation  # Skip AI generation
python -m app.training.run_training_generation --skip-collection  # Skip external data
python -m app.training.run_training_generation --skip-preparation # Skip processing
```

### Expected Output

```
🎉 CONGRATULATIONS! Your AI training dataset is ready for model training! 🎉
═══════════════════════════════════════════════════════════════════════════════
🎯 TARGET ACHIEVEMENT:
   • Target Questions: 10,000
   • Generated Questions: 10,247
   • Achievement Rate: 102.5%
   • Status: ✅ TARGET MET

📊 QUESTION BREAKDOWN:
   Quiz Questions:
   • Total: 8,198
   • AI Generated: 5,739
   • External Sources: 2,459
   
   Hackathon Questions:
   • Total: 2,049
   • AI Generated: 1,434
   • External Sources: 615

🔄 DATA SPLITS:
   • Training Set: 8,198 (80%)
   • Validation Set: 1,025 (10%)
   • Test Set: 1,024 (10%)
```

## 🏗️ System Architecture

### Components

1. **AI Generator** (`generate_training_data.py`)
   - Uses Google Gemini API for question generation
   - Covers 10+ technical categories
   - Creates diverse question types and difficulties

2. **External Collector** (`collect_external_data.py`)
   - Scrapes GitHub repositories
   - Collects competitive programming questions
   - Gathers web development content

3. **Data Preparer** (`prepare_training_data.py`)
   - Cleans and validates data
   - Augments with variations
   - Creates training splits
   - Exports in multiple formats

4. **Master Orchestrator** (`run_training_generation.py`)
   - Runs complete pipeline
   - Provides progress tracking
   - Generates comprehensive reports

### Database Schema

```sql
-- Quiz Questions Table
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL,
    correct_answer TEXT NOT NULL,
    wrong_answers JSONB,
    explanation TEXT,
    tags JSONB,
    source VARCHAR(100),
    language VARCHAR(20) DEFAULT 'english',
    estimated_time_seconds INTEGER DEFAULT 60,
    training_weight FLOAT DEFAULT 1.0,
    validation_split VARCHAR(20) DEFAULT 'train',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Hackathon Questions Table  
CREATE TABLE hackathon_questions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    problem_statement TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL,
    tech_stack JSONB,
    requirements JSONB,
    evaluation_criteria JSONB,
    estimated_hours INTEGER,
    max_team_size INTEGER DEFAULT 4,
    sample_solution TEXT,
    test_cases JSONB,
    resources JSONB,
    tags JSONB,
    source VARCHAR(100),
    validation_split VARCHAR(20) DEFAULT 'train',
    -- ... additional fields
);
```

## 📊 Generated Data Structure

### Quiz Question Format

```json
{
  "input": {
    "question": "What is the time complexity of binary search?",
    "type": "multiple_choice",
    "topic": "algorithms",
    "category": "computer_science",
    "difficulty": "intermediate"
  },
  "output": {
    "answer": "O(log n)",
    "explanation": "Binary search eliminates half the search space in each step...",
    "options": ["O(n)", "O(n log n)", "O(n²)"]
  },
  "metadata": {
    "source": "gemini_generated",
    "tags": ["algorithms", "complexity", "searching"],
    "estimated_time": 60,
    "weight": 1.0
  }
}
```

### Hackathon Question Format

```json
{
  "input": {
    "title": "Real-time Chat Application",
    "description": "Build a scalable chat application with real-time messaging",
    "problem": "Design and implement a chat system supporting multiple rooms...",
    "category": "web_applications",
    "difficulty": "advanced"
  },
  "output": {
    "tech_stack": ["react", "node.js", "socket.io", "mongodb"],
    "requirements": ["Real-time messaging", "Multiple chat rooms", "User authentication"],
    "solution_approach": "Use WebSockets for real-time communication...",
    "evaluation": {"functionality": 40, "design": 25, "innovation": 20, "code_quality": 15}
  },
  "metadata": {
    "source": "gemini_generated",
    "tags": ["web_dev", "real_time", "chat"],
    "estimated_hours": 24,
    "team_size": 4,
    "weight": 1.0
  }
}
```

## 💡 Usage Examples

### Individual Component Usage

```bash
# Generate only AI questions
python -m app.training.generate_training_data

# Collect only external data
python -m app.training.collect_external_data

# Process existing data
python -m app.training.prepare_training_data
```

### Database Queries

```sql
-- Check generation progress
SELECT 
  category,
  COUNT(*) as total,
  COUNT(CASE WHEN source LIKE 'gemini%' THEN 1 END) as ai_generated,
  AVG(training_weight) as avg_weight
FROM quiz_questions 
WHERE is_active = true
GROUP BY category
ORDER BY total DESC;

-- Question difficulty distribution
SELECT 
  difficulty_level,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM quiz_questions
GROUP BY difficulty_level;

-- Training splits
SELECT 
  validation_split,
  COUNT(*) as count
FROM quiz_questions
GROUP BY validation_split;
```

### Export Data for Training

```python
# Load training data in Python
import pandas as pd
import json

# Load as DataFrame
df = pd.read_parquet('data/processed_training_data/edtech_training_20241201_quiz_train.parquet')

# Load as JSONL for transformers
with open('data/processed_training_data/edtech_training_20241201_quiz_train.jsonl', 'r') as f:
    training_data = [json.loads(line) for line in f]

# Use with HuggingFace datasets
from datasets import load_dataset
dataset = load_dataset('json', data_files='data/processed_training_data/*.jsonl')
```

## ⚙️ Configuration

### Environment Variables

```bash
# Required
GEMINI_API_KEY=YOUR_GEMINI_API_KEY  # Google Gemini API key
DB_HOST=localhost                                      # Database host
DB_NAME=edtech_platform                               # Database name  
DB_USER=postgres                                      # Database user
DB_PASSWORD=your_password                             # Database password
DB_PORT=5432                                         # Database port

# Optional
GENERATION_LOG_LEVEL=INFO                            # Logging level
BATCH_SIZE=10                                       # Generation batch size
RATE_LIMIT_DELAY=0.5                               # API rate limiting delay
```

### Customizing Generation Targets

Edit `generate_training_data.py` to modify target counts:

```python
# Modify target counts per category
self.question_configs = [
    QuestionConfig(
        category='programming_fundamentals',
        topics=['variables', 'data_types', 'control_structures'],
        target_count=1000,  # Increase this number
        difficulty_levels=['beginner', 'intermediate']
    ),
    # ... other configurations
]
```

### Adding New Categories

```python
# Add new category configuration
QuestionConfig(
    category='blockchain_development',
    topics=['smart_contracts', 'defi', 'nfts', 'dao'],
    difficulty_levels=['intermediate', 'advanced', 'expert'],
    question_types=['multiple_choice', 'coding'],
    target_count=500
)
```

## 🔧 Troubleshooting

### Common Issues

**1. API Rate Limiting**
```
Error: 429 Too Many Requests
Solution: Increase rate_limit_delay in configuration or reduce batch_size
```

**2. Database Connection Failed**
```
Error: could not connect to server
Solution: Verify database credentials and ensure PostgreSQL is running
```

**3. Out of Memory During Generation**
```
Error: MemoryError
Solution: Reduce batch_size or increase system RAM
```

**4. Incomplete Generation**
```
Issue: Generation stops before reaching target
Solution: Check logs for API errors, increase timeout values
```

### Performance Optimization

```bash
# Monitor generation progress
tail -f data_generation.log

# Check database performance
psql -d $DATABASE_URL -c "SELECT COUNT(*) FROM quiz_questions;"

# Monitor system resources
htop  # Linux/Mac
taskmgr  # Windows
```

### Data Quality Validation

```sql
-- Check for duplicate questions
SELECT question_text, COUNT(*) 
FROM quiz_questions 
GROUP BY question_text 
HAVING COUNT(*) > 1;

-- Validate required fields
SELECT COUNT(*) as missing_explanations
FROM quiz_questions 
WHERE explanation IS NULL OR explanation = '';

-- Check category distribution
SELECT category, COUNT(*) as count
FROM quiz_questions
GROUP BY category
ORDER BY count DESC;
```

## 📈 Monitoring and Analytics

### Generation Metrics

- **Generation Rate**: ~50-100 questions/minute
- **API Usage**: ~7,000 Gemini API calls for full dataset
- **Storage Requirements**: ~500MB for complete dataset
- **Processing Time**: 2-4 hours for full generation

### Quality Metrics

- **AI Generated Quality**: 95%+ valid questions
- **External Source Quality**: 80%+ after cleaning
- **Category Balance**: ±10% from target distribution
- **Difficulty Balance**: Normal distribution across levels

## 🚀 Next Steps

After generating training data:

1. **Model Training**: Use exported datasets with your ML framework
2. **Quality Review**: Manual review of sample questions
3. **Performance Testing**: Validate model performance on test set
4. **Production Deployment**: Deploy trained models to platform
5. **Continuous Learning**: Regularly update training data

## 📞 Support

For issues or questions:

1. Check logs: `tail -f master_training_generation.log`
2. Review database: Check question counts and distributions
3. Validate environment: Ensure all required variables are set
4. Monitor resources: Check system memory and disk space

The training data generation system is designed to be robust and scalable, providing high-quality educational content for AI model training at scale.
