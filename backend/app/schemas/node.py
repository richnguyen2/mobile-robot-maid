"""Node schemas."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class NodeCreateSchema(BaseModel):
    node_type: str
    label: Optional[str] = None
    x_coord: float
    y_coord: float


class NodeSchema(NodeCreateSchema):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class NodeUpdate(BaseModel):
    label: Optional[str] = None
    node_type: Optional[str] = None