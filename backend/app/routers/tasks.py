"""Task endpoints."""
from datetime import datetime
from fastapi import APIRouter, HTTPException
from sqlmodel import select
from app.database import SessionDep
from app.models import Task
from app.schemas import ResponseSchema, TaskSchema, TaskCreateSchema

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=ResponseSchema[list[TaskSchema]])
async def list_tasks(session: SessionDep) -> dict:
    tasks = session.exec(select(Task)).all()
    return {"data": tasks}

@router.get("/active", response_model=ResponseSchema[list[TaskSchema]])
async def list_active_tasks(session: SessionDep) -> dict:
    data = select(Task).where(Task.status != "standby").order_by(Task.dispatched_at)
    active_task = session.exec(data).all()
    return {"data": active_task}

@router.get("/{task_id}", response_model=ResponseSchema[TaskSchema])
async def get_task(task_id: int, session: SessionDep) -> dict:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"data": task}

@router.get("/node/{node_id}", response_model=ResponseSchema[list[TaskSchema]])
async def list_tasks_by_node(node_id: int, session: SessionDep) -> dict:
    tasksByNodeId = session.exec(select(Task).where(Task.node_id == node_id)).all()
    return {"data": tasksByNodeId}

@router.post("", response_model=ResponseSchema[TaskSchema], status_code=201)
async def create_task(task_data: TaskCreateSchema, session: SessionDep) -> dict:
    task = Task.model_validate(task_data)
    session.add(task)
    session.commit()
    session.refresh(task)
    return {"data": task}

@router.delete("/{task_id}")
async def delete_task(task_id: int, session: SessionDep) -> dict:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    session.delete(task)
    session.commit()
    return {"ok": True}


@router.patch("/{task_id}/dispatch", response_model=ResponseSchema[TaskSchema])
async def dispatch_task(task_id: int, session: SessionDep) -> dict:
    task = session.get(Task, task_id)
    if not task or task.status not in ("standby", "completed"):
        raise HTTPException(status_code=400, detail="Task not in standby")

    task.status = "pending"
    task.dispatched_at = datetime.now()
    session.add(task)
    session.commit()
    session.refresh(task)
    return {"data": task}


@router.patch("/{task_id}/standby", response_model=ResponseSchema[TaskSchema])
async def standby_task(task_id: int, session: SessionDep) -> dict:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = "standby"
    session.add(task)
    session.commit()
    session.refresh(task)
    return {"data": task}


@router.patch("/{task_id}/complete", response_model=ResponseSchema[TaskSchema])
async def complete_task(task_id: int, session: SessionDep) -> dict:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = "completed"
    session.add(task)
    session.commit()
    session.refresh(task)
    return {"data": task}
