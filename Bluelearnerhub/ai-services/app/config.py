from functools import lru_cache
from typing import List, Optional, Dict
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    def __init__(self):
        # Application
        self.app_name = "EdTech AI Services"
        self.app_version = "1.0.0"
        self.debug = str(os.getenv("DEBUG", "True")).lower() == "true"
        
        # Server
        self.host = os.getenv("HOST", "0.0.0.0")
        self.port = int(os.getenv("PORT", "8000"))
        
        # Database
        self.database_url = os.getenv(
            "DATABASE_URL",
            "postgresql://edtech_user:REPLACE_WITH_ACTUAL_PASSWORD@localhost:5432/edtech_platform"
        )
        
        # Redis
        self.redis_host = os.getenv("REDIS_HOST", "localhost")
        self.redis_port = int(os.getenv("REDIS_PORT", "6379"))
        self.redis_password = os.getenv("REDIS_PASSWORD", "")
        self.redis_db = int(os.getenv("REDIS_DB", "0"))
        self.redis_url = f"redis://:{self.redis_password}@{self.redis_host}:{self.redis_port}/{self.redis_db}"
        
        # CORS
        self.allowed_origins = [
            "http://localhost:3000",
            "http://localhost:5000",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5000",
        ]
        
        # Google Gemini
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "")
        self.gemini_model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        self.gemini_temperature = float(os.getenv("GEMINI_TEMPERATURE", "0.7"))
        self.gemini_max_tokens = int(os.getenv("GEMINI_MAX_TOKENS", "2048"))
        
        # Model Paths
        self.models_dir = os.getenv("MODELS_DIR", "data/models")
        self.data_dir = os.getenv("DATA_DIR", "data")
        
        # ML Settings
        self.max_sequence_length = 512
        self.batch_size = 32
        self.learning_rate = 0.001
        self.epochs = 10
        self.device = os.getenv("DEVICE", "cpu")
        
        # Model Configuration
        self.question_gen_model = os.getenv("QUESTION_GEN_MODEL", "gpt-3.5-turbo")
        self.response_eval_model = os.getenv("RESPONSE_EVAL_MODEL", "gpt-3.5-turbo")
        self.code_eval_model = os.getenv("CODE_EVAL_MODEL", "judge0")
        
        # Cache Settings
        self.cache_ttl = 3600
        self.enable_caching = True
        
        # JWT
        self.jwt_secret = os.getenv("JWT_SECRET", "")
        self.jwt_algorithm = "HS256"
        self.jwt_expires_in = 86400
        
        # Celery
        self.celery_broker_url = f"redis://:{self.redis_password}@{self.redis_host}:{self.redis_port}/1"
        self.celery_result_backend = f"redis://:{self.redis_password}@{self.redis_host}:{self.redis_port}/2"
        
        # Logging
        self.log_level = os.getenv("LOG_LEVEL", "INFO")
        self.log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
