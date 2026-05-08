from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends
from datetime import datetime
from typing import Annotated, Any, Generic, List, Optional, TypeVar
from sqlmodel import SQLModel, create_engine, Session, select, Field, Relationship
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import Column
from pydantic import BaseModel
from annotated_types import T
import os
from dotenv import load_dotenv

class Room(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    x_coord: float
    y_coord: float
    created_at: datetime = Field(default_factory=datetime.now)
    tasks: List["Task"] = Relationship(back_populates="room")

class RoomCreate(SQLModel):
    name: str
    x_coord: float
    y_coord: float

T = TypeVar("T")
class Response(BaseModel, Generic[T]):
    data: T

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    description: str
    detection_data: Optional[dict] = Field(
        default={}, 
        sa_column=Column(JSONB)
    )
    room_id: int = Field(foreign_key="room.id")
    
    room: Optional[Room] = Relationship(back_populates="tasks")

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    with Session(engine) as session:
        if not session.exec(select(Room)).first():
            session.add_all([
                Room(name="Kitchen", x_coord=2, y_coord=3),
                Room(name="Living Room", x_coord=4, y_coord=6)
            ])
            session.commit()
    yield

app = FastAPI(root_path="/api/v1", lifespan=lifespan)

@app.get("/")
async def root():
    return {"message" : "hello world"}

@app.get("/rooms", response_model=Response[list[Room]])
async def read_rooms(session: SessionDep):
    rooms = session.exec(select(Room)).all()
    return {"data": rooms}

@app.get("/rooms/{room_id}", response_model=Response[Room])
async def read_room(room_id: int, session: SessionDep):
    data = session.get(Room, room_id)
    if not data:
        raise HTTPException(status_code=404)
    return {"data": data}

@app.post("/rooms", status_code=201, response_model=Response[Room])
async def create_room(room: RoomCreate, session: SessionDep):
    db_room = Room.model_validate(room)
    session.add(db_room)
    session.commit()
    session.refresh(db_room)
    return {"data": db_room}

@app.put("/rooms/{room_id}", response_model=Response[Room])
async def update_room(room_id: int, room: RoomCreate, session: SessionDep):
    data = session.get(Room, room_id)
    if not data:
        raise HTTPException(status_code=404)
    data.name = room.name
    data.x_coord = room.x_coord
    data.y_coord = room.y_coord
    session.add(data)
    session.commit()
    session.refresh(data)
    return {"data": data}

@app.delete("/rooms/{id}")
async def delete_room(room_id: int, session: SessionDep):
    data = session.get(Room, room_id)
    if not data:
        raise HTTPException(status_code=404)
    session.delete(data)
    session.commit()
    return {"ok", True}