"""Edge schemas."""
from pydantic import BaseModel


class EdgeSchema(BaseModel):
    id: int
    source: int
    target: int
