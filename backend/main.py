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

T = TypeVar("T")
class Response(BaseModel, Generic[T]):
    data: T

class Room(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    x_coord: float
    y_coord: float
    localization_data: dict | None = Field(
        default=None, 
        sa_column=Column(JSONB, nullable=True)
    )
    created_at: datetime = Field(default_factory=datetime.now)
    tasks: List["Task"] = Relationship(back_populates="room")

class RoomCreate(SQLModel):
    name: str
    x_coord: float
    y_coord: float
    localization_data: dict | None = None


class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    status: str = Field(default="standby")
    dispatched_at: Optional[datetime] = Field(default=None)
    room_id: int = Field(foreign_key="room.id")
    
    room: Optional[Room] = Relationship(back_populates="tasks")

class TaskCreate(BaseModel):
    name: str
    room_id: int

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
            session.add_all(
                [
                    Room(name="Snack Area", x_coord=0, y_coord=0)
                ],
            )
            session.commit()
    yield

app = FastAPI(root_path="/api/v1", lifespan=lifespan)

@app.get("/")
async def root():
    return {"message" : "hello world"}

# API Endpoints for Rooms

@app.get("/rooms", response_model=Response[list[Room]])
async def read_rooms(session: SessionDep):
    data = session.exec(select(Room)).all()
    return {"data": data}

@app.get("/rooms/{room_id}", response_model=Response[Room])
async def read_room(room_id: int, session: SessionDep):
    data = session.get(Room, room_id)
    if not data:
        raise HTTPException(status_code=404)
    return {"data": data}

@app.post("/rooms", status_code=201, response_model=Response[Room])
async def create_room(room: RoomCreate, session: SessionDep):
    data = Room.model_validate(room)
    session.add(data)
    session.commit()
    session.refresh(data)
    return {"data": data}

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

@app.delete("/rooms/{room_id}")
async def delete_room(room_id: int, session: SessionDep):
    data = session.get(Room, room_id)
    if not data:
        raise HTTPException(status_code=404)
    session.delete(data)
    session.commit()
    return {"ok": True}

# API Endpoints for Tasks

@app.get("/tasks", response_model=Response[list[Task]])
async def read_tasks(session: SessionDep):
    data = session.exec(select(Task)).all()
    return {"data": data}

@app.get("/tasks/{task_id}", response_model=Response[Task])
async def read_task(task_id : int, session: SessionDep):
    data = session.get(Task, task_id)
    if not data:
        raise HTTPException(status_code=404)
    return {"data": data}

@app.post("/tasks", status_code=201, response_model=Response[Task])
async def create_task(task: TaskCreate, session: SessionDep):
    data = Task.model_validate(task)
    session.add(data)
    session.commit()
    session.refresh(data)
    return {"data": data}

@app.put("/tasks/{task_id}", response_model=Response[Task])
async def update_task(task_id: int, task: TaskCreate, session: SessionDep):
    data = session.get(Task, task_id)
    if not data:
        raise HTTPException(status_code=404)
    data.name = task.name
    data.room_id = task.room_id
    session.commit()
    session.refresh(data)
    return {"data": data}

@app.delete("/tasks/{tasks_id}")
async def delete_task(task_id: int, session: SessionDep):
    data = session.get(Task, task_id)
    if not data:
        raise HTTPException(status_code=404)
    session.delete(data)
    session.commit()
    return {"ok": True}

# Set the task's status to "pending"
@app.patch("/tasks/{task_id}/dispatch", response_model=Response[Task])
async def dispatch_task(task_id: int, session: SessionDep):
    data = session.get(Task, task_id)
    if not data or not(data.status == "standby" or data.status == "completed"):
        raise HTTPException(status_code=400, detail="Task not in standby")
    data.status = "pending"
    data.dispatched_at = datetime.now()
    session.add(data)
    session.commit()
    return {"data": data}

# Cancels a task by resetting the status to "standby"
@app.patch("/tasks/{task_id}/cancel", response_model=Response[Task])
async def cancel_task(task_id: int, session: SessionDep):
    data = session.get(Task, task_id)
    if not data:
        raise HTTPException(status_code=404)
    data.status = "standby"
    session.add(data)
    session.commit()
    return {"data": data}

# API Endpoints for the Mobile Robot Maid

# Starts the next task that is pending
@app.get("/robot/next-task", response_model=Optional[dict])
async def get_robot_task(session: SessionDep):
    tasks_pending = (
        select(Task)
        .where(Task.status == "pending")
        .order_by(Task.dispatched_at) 
    )
    task = session.exec(tasks_pending).first()
    if not task:
        return None
    
    task.status = "in_progress"
    session.add(task)
    session.commit()
    session.refresh(task)

    return {
        "task_id": task.id,
        "name": task.name,
        "x_coord": task.room.x_coord,
        "y_coord": task.room.y_coord,
        "localization_data": task.room.localization_data
    }

# Marks a task complete
@app.patch("/tasks/{task_id}/complete", response_model=Response[Task])
async def complete_task(task_id: int, session: SessionDep):
    task_completed = session.get(Task, task_id)
    if not task_completed:
        raise HTTPException(status_code=404)
    task_completed.status = "completed"
    session.add(task_completed)
    session.commit()
    session.refresh(task_completed)
    return {"data": task_completed}