"""Room model."""
from typing import List, Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import Column


class Room(SQLModel, table=True):
    """Room database model."""

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: Optional[str] = None
    x_coord: float
    y_coord: float
    localization_data: dict | None = Field(
        default=None,
        sa_column=Column(JSONB, nullable=True)
    )
    created_at: datetime = Field(default_factory=datetime.now)
    tasks: List["Task"] = Relationship(back_populates="room")
