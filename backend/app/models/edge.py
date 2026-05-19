"""Edge model."""
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.dialects.postgresql import JSONB


class Edge(SQLModel, table=True):
    """Edge database model."""

    id: Optional[int] = Field(default=None, primary_key=True)
    source: int = Field(foreign_key="node.id", index=True, nullable=False)
    target: int = Field(foreign_key="node.id", index=True, nullable=False)
    
