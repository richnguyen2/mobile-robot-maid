"""Robot schemas."""
from typing import Optional
from pydantic import BaseModel


class RobotSchema(BaseModel):
    id: int
    name: str
    status: str
    current_node_id: int
    current_task_id: Optional[int] = None

class RobotUpdate(BaseModel):
    current_node_id: Optional[int] = None
