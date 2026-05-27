from pydantic_settings import BaseSettings
from typing import List
import json

class Settings(BaseSettings):
    OPENAI_API_KEY: str = ""
    OPENROUTER_API_KEY: str
    CHROMA_DB_DIR: str = "./chroma_db"
    UPLOAD_DIR: str = "./uploads"
    ALLOWED_ORIGINS: str = '["http://localhost:5173"]'

    class Config:
        env_file = ".env"

    @property
    def cors_origins(self) -> List[str]:
        try:
            result = json.loads(self.ALLOWED_ORIGINS)
            print(f"CORS origins: {result}")  # Debug
            return result
        except:
            print(f"CORS origins: using default ['http://localhost:5173']")  # Debug
            return ["http://localhost:5173"]

settings = Settings()