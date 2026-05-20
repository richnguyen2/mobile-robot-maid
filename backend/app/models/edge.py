"""Edge model."""
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy.dialects.postgresql import JSONB


class Edge(SQLModel, table=True):
    """Edge database model."""

    id: Optional[int] = Field(default=None, primary_key=True)
    source: int = Field(foreign_key="node.id", index=True, nullable=False)
    target: int = Field(foreign_key="node.id", index=True, nullable=False)
    
    source_node: Optional["Node"] = Relationship(
        back_populates="source_edges", 
        sa_relationship_kwargs={"foreign_keys": "[Edge.source]"}
    )
    target_node: Optional["Node"] = Relationship(
        back_populates="target_edges", 
        sa_relationship_kwargs={"foreign_keys": "[Edge.target]"}
    )
