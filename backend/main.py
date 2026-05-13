from contextlib import asynccontextmanager
from fastapi import FastAPI
from datetime import datetime
from sqlmodel import Session, select
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS
from app.database import create_db_and_tables, engine, SessionDep
from app.models import Room
from app.routers import rooms, tasks, robot


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    with Session(engine) as session:
        if not session.exec(select(Room)).first():
            session.add(Room(name="Snack Area", x_coord=0, y_coord=0))
            session.commit()
    yield


app = FastAPI(root_path="/api/v1", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rooms.router)
app.include_router(tasks.router)
app.include_router(robot.router)


@app.get("/")
async def root():
    return {"message": "hello world"}
