#!/usr/bin/env python3
"""
AI Training Data Generator
Generates 10,000+ quiz and hackathon questions for AI model training
Uses Google Gemini API for intelligent question generation
"""

import os
import json
import asyncio
import aiohttp
import psycopg2
from psycopg2.extras import RealDictCursor
import google.generativeai as genai
from datetime import datetime
import random
import logging
from typing import List, Dict, Any
from dataclasses import dataclass

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('data_generation.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class QuestionConfig:
    category: str
    topics: List[str]
    difficulty_levels: List[str]
    question_types: List[str]
    target_count: int

class TrainingDataGenerator:
    def __init__(self):
        self.gemini_api_key = os.getenv('GEMINI_API_KEY', '')
        if not self.gemini_api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        genai.configure(api_key=self.gemini_api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Database configuration
        self.db_config = {
            'host': os.getenv('DB_HOST', 'localhost'),
            'database': os.getenv('DB_NAME', 'edtech_platform'),
            'user': os.getenv('DB_USER', 'postgres'), 
            'password': os.getenv('DB_PASSWORD', 'password'),
            'port': os.getenv('DB_PORT', 5432)
        }
        
        # Question generation configuration
        self.question_configs = [
            QuestionConfig(
                category='programming_fundamentals',
                topics=['variables', 'data_types', 'control_structures', 'functions', 'loops'],
                difficulty_levels=['beginner', 'intermediate'],
                question_types=['multiple_choice', 'true_false', 'coding'],
                target_count=800
            ),
            QuestionConfig(
                category='data_structures',
                topics=['arrays', 'linked_lists', 'stacks', 'queues', 'trees', 'graphs', 'heaps'],
                difficulty_levels=['beginner', 'intermediate', 'advanced'],
                question_types=['multiple_choice', 'coding', 'fill_blank'],
                target_count=900
            ),
            QuestionConfig(
                category='algorithms',
                topics=['sorting', 'searching', 'dynamic_programming', 'recursion', 'graph_algorithms'],
                difficulty_levels=['intermediate', 'advanced', 'expert'],
                question_types=['multiple_choice', 'coding'],
                target_count=1000
            ),
            QuestionConfig(
                category='web_development',
                topics=['html', 'css', 'javascript', 'react', 'node.js', 'databases', 'apis'],
                difficulty_levels=['beginner', 'intermediate', 'advanced'],
                question_types=['multiple_choice', 'coding', 'true_false'],
                target_count=1200
            ),
            QuestionConfig(
                category='data_science',
                topics=['statistics', 'machine_learning', 'pandas', 'numpy', 'visualization', 'sql'],
                difficulty_levels=['intermediate', 'advanced', 'expert'],
                question_types=['multiple_choice', 'coding', 'fill_blank'],
                target_count=800
            ),
            QuestionConfig(
                category='artificial_intelligence',
                topics=['neural_networks', 'deep_learning', 'nlp', 'computer_vision', 'reinforcement_learning'],
                difficulty_levels=['advanced', 'expert'],
                question_types=['multiple_choice', 'coding'],
                target_count=600
            ),
            QuestionConfig(
                category='cybersecurity',
                topics=['encryption', 'network_security', 'web_security', 'ethical_hacking', 'compliance'],
                difficulty_levels=['intermediate', 'advanced', 'expert'],
                question_types=['multiple_choice', 'true_false', 'coding'],
                target_count=500
            ),
            QuestionConfig(
                category='cloud_computing',
                topics=['aws', 'azure', 'gcp', 'devops', 'containers', 'kubernetes'],
                difficulty_levels=['intermediate', 'advanced'],
                question_types=['multiple_choice', 'coding'],
                target_count=600
            ),
            QuestionConfig(
                category='mobile_development',
                topics=['android', 'ios', 'react_native', 'flutter', 'app_design'],
                difficulty_levels=['beginner', 'intermediate', 'advanced'],
                question_types=['multiple_choice', 'coding'],
                target_count=500
            ),
            QuestionConfig(
                category='system_design',
                topics=['scalability', 'microservices', 'distributed_systems', 'caching', 'load_balancing'],
                difficulty_levels=['advanced', 'expert'],
                question_types=['multiple_choice', 'coding'],
                target_count=400
            )
        ]
        
        # Hackathon categories
        self.hackathon_configs = [
            {
                'category': 'web_applications',
                'topics': ['e-commerce', 'social_media', 'productivity', 'education', 'healthcare'],
                'tech_stacks': [['react', 'node.js', 'mongodb'], ['vue.js', 'express', 'postgresql'], ['angular', 'nest.js', 'mysql']],
                'target_count': 200
            },
            {
                'category': 'mobile_applications',
                'topics': ['fitness', 'finance', 'travel', 'food', 'entertainment'],
                'tech_stacks': [['react_native', 'firebase'], ['flutter', 'nodejs'], ['ionic', 'supabase']],
                'target_count': 150
            },
            {
                'category': 'ai_ml_projects',
                'topics': ['nlp', 'computer_vision', 'recommendation_systems', 'predictive_analytics', 'chatbots'],
                'tech_stacks': [['python', 'tensorflow', 'flask'], ['python', 'pytorch', 'fastapi'], ['python', 'scikit_learn', 'streamlit']],
                'target_count': 180
            },
            {
                'category': 'blockchain_projects',
                'topics': ['defi', 'nfts', 'smart_contracts', 'dao', 'tokenization'],
                'tech_stacks': [['solidity', 'web3.js', 'react'], ['rust', 'anchor', 'solana'], ['go', 'ethereum', 'truffle']],
                'target_count': 100
            },
            {
                'category': 'iot_projects',
                'topics': ['smart_home', 'wearables', 'industrial_monitoring', 'environmental_sensing', 'automation'],
                'tech_stacks': [['arduino', 'raspberry_pi', 'mqtt'], ['esp32', 'firebase', 'flutter'], ['python', 'influxdb', 'grafana']],
                'target_count': 80
            },
            {
                'category': 'game_development',
                'topics': ['puzzle_games', 'arcade_games', 'rpg', 'strategy', 'multiplayer'],
                'tech_stacks': [['unity', 'c#'], ['unreal', 'c++'], ['godot', 'gdscript'], ['html5', 'javascript']],
                'target_count': 90
            }
        ]

    def get_db_connection(self):
        """Get database connection"""
        return psycopg2.connect(**self.db_config)

    async def generate_quiz_question(self, config: QuestionConfig, topic: str, difficulty: str, question_type: str) -> Dict[str, Any]:
        """Generate a single quiz question using Gemini AI"""
        try:
            prompt = f"""Generate a {difficulty} level {question_type} question about {topic} in {config.category}.

Requirements:
- Question must be clear, specific, and pedagogically sound
- For multiple_choice: Provide 1 correct answer and 3 plausible distractors
- For true_false: Provide a statement and boolean answer  
- For coding: Provide a programming problem with expected solution
- For fill_blank: Provide statement with blank and answer
- Include detailed explanation for learning
- Add 3-5 relevant tags
- Estimate time to solve in seconds

Return ONLY valid JSON in this exact format:
{{
    "question_text": "Clear question text here",
    "question_type": "{question_type}",
    "topic": "{topic}",
    "category": "{config.category}",
    "difficulty_level": "{difficulty}",
    "correct_answer": "Correct answer here",
    "wrong_answers": ["option1", "option2", "option3"] or null,
    "explanation": "Detailed explanation with reasoning",
    "tags": ["tag1", "tag2", "tag3"],
    "estimated_time_seconds": 60
}}"""

            response = await asyncio.to_thread(
                self.model.generate_content,
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.8,
                    max_output_tokens=1000
                )
            )
            
            # Parse JSON response
            response_text = response.text.strip()
            if response_text.startswith('```json'):
                response_text = response_text[7:-3]
            elif response_text.startswith('```'):
                response_text = response_text[3:-3]
                
            question_data = json.loads(response_text)
            
            # Add metadata
            question_data['source'] = 'gemini_generated'
            question_data['language'] = 'english'
            question_data['training_weight'] = 1.0
            question_data['validation_split'] = random.choice(['train'] * 8 + ['validation'] * 1 + ['test'] * 1)
            
            return question_data
            
        except Exception as e:
            logger.error(f"Error generating question: {e}")
            return None

    async def generate_hackathon_question(self, config: Dict[str, Any], topic: str, tech_stack: List[str], difficulty: str) -> Dict[str, Any]:
        """Generate a hackathon project question using Gemini AI"""
        try:
            tech_list = ', '.join(tech_stack)
            prompt = f"""Generate a {difficulty} level hackathon project about {topic} in {config['category']} using {tech_list}.

Create a comprehensive project proposal including:
- Engaging title and clear description
- Detailed problem statement with real-world relevance
- Specific technical requirements
- Evaluation criteria with weights
- Estimated completion time
- Team size recommendation
- Sample implementation approach
- Test cases or success metrics
- Helpful resources

Return ONLY valid JSON in this exact format:
{{
    "title": "Project Title Here",
    "description": "Brief project description", 
    "problem_statement": "Detailed problem explanation with context",
    "category": "{config['category']}",
    "difficulty_level": "{difficulty}",
    "tech_stack": {json.dumps(tech_stack)},
    "requirements": ["req1", "req2", "req3", "req4"],
    "evaluation_criteria": {{"functionality": 40, "design": 25, "innovation": 20, "code_quality": 15}},
    "estimated_hours": 24,
    "max_team_size": 4,
    "sample_solution": "High-level implementation approach",
    "test_cases": ["test case 1", "test case 2", "test case 3"],
    "resources": ["resource1", "resource2", "resource3"],
    "tags": ["{topic}", "{difficulty}", "{config['category']}"]
}}"""

            response = await asyncio.to_thread(
                self.model.generate_content,
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.9,
                    max_output_tokens=1500
                )
            )
            
            # Parse JSON response
            response_text = response.text.strip()
            if response_text.startswith('```json'):
                response_text = response_text[7:-3]
            elif response_text.startswith('```'):
                response_text = response_text[3:-3]
                
            hackathon_data = json.loads(response_text)
            
            # Add metadata
            hackathon_data['source'] = 'gemini_generated'
            hackathon_data['language'] = 'english'
            hackathon_data['training_weight'] = 1.0
            hackathon_data['validation_split'] = random.choice(['train'] * 8 + ['validation'] * 1 + ['test'] * 1)
            
            return hackathon_data
            
        except Exception as e:
            logger.error(f"Error generating hackathon question: {e}")
            return None

    async def batch_insert_quiz_questions(self, questions: List[Dict[str, Any]]):
        """Batch insert quiz questions into database"""
        if not questions:
            return
            
        conn = self.get_db_connection()
        try:
            cursor = conn.cursor()
            
            insert_query = """
                INSERT INTO quiz_questions (
                    question_text, question_type, topic, category, difficulty_level,
                    correct_answer, wrong_answers, explanation, tags, source,
                    language, estimated_time_seconds, training_weight, validation_split
                ) VALUES %s
            """
            
            values = []
            for q in questions:
                if q:  # Skip None questions
                    values.append((
                        q['question_text'], q['question_type'], q['topic'], q['category'],
                        q['difficulty_level'], q['correct_answer'], json.dumps(q.get('wrong_answers')),
                        q['explanation'], json.dumps(q['tags']), q['source'],
                        q['language'], q['estimated_time_seconds'], q['training_weight'], q['validation_split']
                    ))
            
            if values:
                from psycopg2.extras import execute_values
                execute_values(cursor, insert_query, values)
                conn.commit()
                logger.info(f"Inserted {len(values)} quiz questions")
                
        except Exception as e:
            logger.error(f"Error inserting quiz questions: {e}")
            conn.rollback()
        finally:
            conn.close()

    async def batch_insert_hackathon_questions(self, questions: List[Dict[str, Any]]):
        """Batch insert hackathon questions into database"""
        if not questions:
            return
            
        conn = self.get_db_connection()
        try:
            cursor = conn.cursor()
            
            insert_query = """
                INSERT INTO hackathon_questions (
                    title, description, problem_statement, category, difficulty_level,
                    tech_stack, requirements, evaluation_criteria, estimated_hours,
                    max_team_size, sample_solution, test_cases, resources, tags,
                    source, language, training_weight, validation_split
                ) VALUES %s  
            """
            
            values = []
            for q in questions:
                if q:  # Skip None questions
                    values.append((
                        q['title'], q['description'], q['problem_statement'], q['category'],
                        q['difficulty_level'], json.dumps(q['tech_stack']), json.dumps(q['requirements']),
                        json.dumps(q['evaluation_criteria']), q['estimated_hours'], q['max_team_size'],
                        q['sample_solution'], json.dumps(q['test_cases']), json.dumps(q['resources']),
                        json.dumps(q['tags']), q['source'], q['language'], q['training_weight'], q['validation_split']
                    ))
            
            if values:
                from psycopg2.extras import execute_values  
                execute_values(cursor, insert_query, values)
                conn.commit()
                logger.info(f"Inserted {len(values)} hackathon questions")
                
        except Exception as e:
            logger.error(f"Error inserting hackathon questions: {e}")
            conn.rollback()
        finally:
            conn.close()

    async def generate_quiz_questions_batch(self, config: QuestionConfig, batch_size: int = 10):
        """Generate quiz questions in batches"""
        logger.info(f"Generating {config.target_count} quiz questions for {config.category}")
        
        generated_count = 0
        batch_questions = []
        
        while generated_count < config.target_count:
            # Generate batch
            tasks = []
            for _ in range(min(batch_size, config.target_count - generated_count)):
                topic = random.choice(config.topics)
                difficulty = random.choice(config.difficulty_levels)
                question_type = random.choice(config.question_types)
                
                task = self.generate_quiz_question(config, topic, difficulty, question_type)
                tasks.append(task)
            
            # Wait for batch completion
            batch_results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Filter valid results
            valid_questions = [q for q in batch_results if q and not isinstance(q, Exception)]
            batch_questions.extend(valid_questions)
            
            # Insert batch when it reaches threshold or we're done
            if len(batch_questions) >= 50 or generated_count + len(valid_questions) >= config.target_count:
                await self.batch_insert_quiz_questions(batch_questions)
                generated_count += len(batch_questions)
                logger.info(f"Progress: {generated_count}/{config.target_count} quiz questions for {config.category}")
                batch_questions = []
            
            # Rate limiting
            await asyncio.sleep(0.5)

    async def generate_hackathon_questions_batch(self, config: Dict[str, Any], batch_size: int = 5):
        """Generate hackathon questions in batches"""
        logger.info(f"Generating {config['target_count']} hackathon questions for {config['category']}")
        
        generated_count = 0
        batch_questions = []
        difficulty_levels = ['beginner', 'intermediate', 'advanced']
        
        while generated_count < config['target_count']:
            # Generate batch
            tasks = []
            for _ in range(min(batch_size, config['target_count'] - generated_count)):
                topic = random.choice(config['topics'])
                tech_stack = random.choice(config['tech_stacks'])
                difficulty = random.choice(difficulty_levels)
                
                task = self.generate_hackathon_question(config, topic, tech_stack, difficulty)
                tasks.append(task)
            
            # Wait for batch completion
            batch_results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Filter valid results
            valid_questions = [q for q in batch_results if q and not isinstance(q, Exception)]
            batch_questions.extend(valid_questions)
            
            # Insert batch when it reaches threshold or we're done
            if len(batch_questions) >= 20 or generated_count + len(valid_questions) >= config['target_count']:
                await self.batch_insert_hackathon_questions(batch_questions)
                generated_count += len(batch_questions)
                logger.info(f"Progress: {generated_count}/{config['target_count']} hackathon questions for {config['category']}")
                batch_questions = []
            
            # Rate limiting
            await asyncio.sleep(1.0)

    async def generate_all_questions(self):
        """Generate all quiz and hackathon questions"""
        logger.info("Starting generation of 10,000+ training questions...")
        
        start_time = datetime.now()
        
        # Generate quiz questions
        quiz_tasks = []
        for config in self.question_configs:
            task = self.generate_quiz_questions_batch(config)
            quiz_tasks.append(task)
        
        await asyncio.gather(*quiz_tasks)
        
        # Generate hackathon questions  
        hackathon_tasks = []
        for config in self.hackathon_configs:
            task = self.generate_hackathon_questions_batch(config)
            hackathon_tasks.append(task)
        
        await asyncio.gather(*hackathon_tasks)
        
        end_time = datetime.now()
        duration = end_time - start_time
        
        # Get final counts
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM quiz_questions WHERE source = 'gemini_generated'")
        quiz_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM hackathon_questions WHERE source = 'gemini_generated'")
        hackathon_count = cursor.fetchone()[0]
        
        conn.close()
        
        logger.info(f"Generation completed in {duration}")
        logger.info(f"Generated {quiz_count} quiz questions and {hackathon_count} hackathon questions")
        logger.info(f"Total: {quiz_count + hackathon_count} training questions")
        
        return {
            'quiz_questions': quiz_count,
            'hackathon_questions': hackathon_count,
            'total': quiz_count + hackathon_count,
            'duration': str(duration)
        }

    def export_training_data(self, dataset_name: str, format_type: str = 'jsonl'):
        """Export training data for AI model training"""
        logger.info(f"Exporting training data as {format_type}")
        
        conn = self.get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Export quiz questions
        cursor.execute("""
            SELECT 
                question_text, question_type, topic, category, difficulty_level,
                correct_answer, wrong_answers, explanation, tags, validation_split
            FROM quiz_questions 
            WHERE is_active = true
            ORDER BY id
        """)
        quiz_data = cursor.fetchall()
        
        # Export hackathon questions
        cursor.execute("""
            SELECT 
                title, description, problem_statement, category, difficulty_level,
                tech_stack, requirements, evaluation_criteria, tags, validation_split
            FROM hackathon_questions
            WHERE is_active = true
            ORDER BY id
        """)
        hackathon_data = cursor.fetchall()
        
        conn.close()
        
        # Create export directory
        export_dir = '../data/training_datasets'
        os.makedirs(export_dir, exist_ok=True)
        
        if format_type == 'jsonl':
            # Export as JSONL for training
            with open(f'{export_dir}/{dataset_name}_quiz_train.jsonl', 'w') as f:
                for row in quiz_data:
                    if row['validation_split'] == 'train':
                        f.write(json.dumps(dict(row)) + '\n')
            
            with open(f'{export_dir}/{dataset_name}_quiz_validation.jsonl', 'w') as f:
                for row in quiz_data:
                    if row['validation_split'] == 'validation':
                        f.write(json.dumps(dict(row)) + '\n')
            
            with open(f'{export_dir}/{dataset_name}_hackathon_train.jsonl', 'w') as f:
                for row in hackathon_data:
                    if row['validation_split'] == 'train':
                        f.write(json.dumps(dict(row)) + '\n')
            
            with open(f'{export_dir}/{dataset_name}_hackathon_validation.jsonl', 'w') as f:
                for row in hackathon_data:
                    if row['validation_split'] == 'validation':
                        f.write(json.dumps(dict(row)) + '\n')
        
        logger.info(f"Training data exported to {export_dir}")
        
        return {
            'quiz_train_count': len([r for r in quiz_data if r['validation_split'] == 'train']),
            'quiz_validation_count': len([r for r in quiz_data if r['validation_split'] == 'validation']),
            'hackathon_train_count': len([r for r in hackathon_data if r['validation_split'] == 'train']),
            'hackathon_validation_count': len([r for r in hackathon_data if r['validation_split'] == 'validation']),
            'export_path': export_dir
        }

async def main():
    """Main execution function"""
    generator = TrainingDataGenerator()
    
    # Generate all questions
    results = await generator.generate_all_questions()
    
    # Export training data
    export_results = generator.export_training_data('edtech_training_v1')
    
    logger.info("Training data generation completed successfully!")
    logger.info(f"Generation results: {results}")
    logger.info(f"Export results: {export_results}")

if __name__ == '__main__':
    asyncio.run(main())
