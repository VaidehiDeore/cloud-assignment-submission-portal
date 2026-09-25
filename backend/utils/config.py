from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str

    frontend_url: str = "http://localhost:5173"
    max_upload_size_mb: int = 10
    allow_late_submission_default: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def frontend_origins(self):
        return [x.strip() for x in self.frontend_url.split(",") if x.strip()]

    @property
    def max_upload_bytes(self):
        return self.max_upload_size_mb * 1024 * 1024


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()
