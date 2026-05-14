"""Database configuration and session management."""
from typing import Annotated
from fastapi import Depends
from sqlmodel import SQLModel, create_engine, Session
from app.config import DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_timeout=30,
    pool_pre_ping=True,
    pool_recycle=1800,
)

def create_db_and_tables() -> None:
    """Create database tables."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Session:
    """Yield a database session for dependencies."""
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
