"""Task model."""
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship


class Task(SQLModel, table=True):
    """Task database model."""

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    status: str = Field(default="standby", index=True)
    dispatched_at: Optional[datetime] = Field(default=None, index=True)
    room_id: int = Field(foreign_key="room.id", index=True)
    room: Optional["Room"] = Relationship(back_populates="tasks")
