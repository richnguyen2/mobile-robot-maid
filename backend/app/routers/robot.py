"""Robot endpoints."""
from typing import Optional
from fastapi import APIRouter
from sqlmodel import select
from app.database import SessionDep
from app.models import Task

router = APIRouter(prefix="/robot", tags=["robot"])


@router.get("/next-task", response_model=Optional[dict])
async def get_next_task(session: SessionDep) -> Optional[dict]:
    statement = select(Task).where(Task.status == "pending").order_by(Task.dispatched_at)
    task = session.exec(statement).first()
    if not task:
        return None

    task.status = "in_progress"
    session.add(task)
    session.commit()
    session.refresh(task)

    return {
        "task_id": task.id,
        "name": task.name,
        "x_coord": task.node.x_coord,
        "y_coord": task.node.y_coord,
    }
