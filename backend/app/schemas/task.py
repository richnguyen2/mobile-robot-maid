"""Task schemas."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class TaskCreateSchema(BaseModel):
    name: str
    room_id: int


class TaskSchema(TaskCreateSchema):
    id: int
    status: str
    dispatched_at: Optional[datetime] = None

    class Config:
        from_attributes = True
