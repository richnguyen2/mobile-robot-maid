"""Node model."""
from typing import List, Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.dialects.postgresql import JSONB


class Node(SQLModel, table=True):
    """Node database model."""

    id: Optional[int] = Field(default=None, primary_key=True)
    node_type: str = Field(index=True, nullable=False)
    label: str = Field(index=True, nullable=True)
    x_coord: float = Field(nullable=False)
    y_coord: float = Field(nullable=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(), nullable=False)
    tasks: List["Task"] = Relationship(back_populates="node")
