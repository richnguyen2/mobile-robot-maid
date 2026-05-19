"""Node model."""
from typing import List, Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.dialects.postgresql import JSONB


class Node(SQLModel, table=True):
    """Node database model."""

    id: Optional[int] = Field(default=None, primary_key=True)

    x_coord: int = Field(nullable=False)
    y_coord: int = Field(nullable=False)

    node_type: str = Field(default="grid_cell", index=True)
    label: Optional[str] = Field(default=None)

    is_occupied: float = Field(default=0, nullable=False)

    tasks: List["Task"] = Relationship(back_populates="node")
