from pydantic import BaseModel

class SystemStats(BaseModel):
    total_pastes: int
    total_views: int
    total_users: int
