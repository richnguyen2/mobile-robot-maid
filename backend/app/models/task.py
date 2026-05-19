"""Task model."""
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

class Task(SQLModel, table=True):
    """Task database model."""

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(nullable=False)
    status: str = Field(default="standby", index=True)
    dispatched_at: Optional[datetime] = Field(default=None, index=True)
    node_id: int = Field(foreign_key="node.id", index=True, nullable=False)
    node: Optional["Node"] = Relationship(back_populates="tasks")
