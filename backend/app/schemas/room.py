"""Room schemas."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class RoomCreateSchema(BaseModel):
    name: str
    x_coord: float
    y_coord: float
    localization_data: Optional[dict] = None


class RoomSchema(RoomCreateSchema):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
