from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application configuration loaded from environment variables.
    """

    # Application
    app_name: str = "LearnMate AI API"
    app_version: str = "1.0.0"
    environment: str = "development"

    # Server
    host: str = "127.0.0.1"
    port: int = 8000

    # Frontend
    frontend_url: str = "http://localhost:5173"

    # Database
    database_url: str = (
        "mysql+pymysql://root:@localhost:3306/edu_assistant"
    )

    # JWT
    secret_key: str = "change-this-secret-key"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # AI
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "phi3:mini"

    # File Uploads
    upload_dir: str = "uploads"
    max_upload_size_mb: int = 20

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """
    Return a cached application settings instance.
    """
    return Settings()


settings = get_settings()