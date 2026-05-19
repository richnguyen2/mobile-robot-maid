from typing import Optional
from sqlmodel import SQLModel, Field

class Robot(SQLModel, table=True):
    """Tracks Robot's State."""
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(default="Bot-01")
    status: str = Field(default="idle") # idle, routing, working
    
    current_node_id: int = Field(foreign_key="node.id", nullable=False)
    
    current_task_id: Optional[int] = Field(default=None, foreign_key="task.id")