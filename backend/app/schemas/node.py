"""Node schemas."""
from typing import Optional
from pydantic import BaseModel


class NodeCreateSchema(BaseModel):
    node_type: str
    label: Optional[str] = None
    x_coord: int
    y_coord: int
    is_occupied: float


class NodeSchema(NodeCreateSchema):
    id: int

    class Config:
        from_attributes = True

class NodeUpdate(BaseModel):
    label: Optional[str] = None
    node_type: Optional[str] = None