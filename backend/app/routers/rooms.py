"""Room endpoints."""
from fastapi import APIRouter, HTTPException
from sqlmodel import select
from app.database import SessionDep
from app.models import Room
from app.schemas import ResponseSchema, RoomSchema, RoomCreateSchema

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.get("", response_model=ResponseSchema[list[RoomSchema]])
async def list_rooms(session: SessionDep) -> dict:
    rooms = session.exec(select(Room)).all()
    return {"data": rooms}


@router.get("/{room_id}", response_model=ResponseSchema[RoomSchema])
async def get_room(room_id: int, session: SessionDep) -> dict:
    room = session.get(Room, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"data": room}


@router.post("", response_model=ResponseSchema[RoomSchema], status_code=201)
async def create_room(room_data: RoomCreateSchema, session: SessionDep) -> dict:
    room = Room.model_validate(room_data)
    session.add(room)
    session.commit()
    session.refresh(room)
    return {"data": room}


@router.put("/{room_id}", response_model=ResponseSchema[RoomSchema])
async def update_room(room_id: int, room_data: RoomCreateSchema, session: SessionDep) -> dict:
    room = session.get(Room, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    update_data = room_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(room, key, value)

    session.add(room)
    session.commit()
    session.refresh(room)
    return {"data": room}


@router.delete("/{room_id}")
async def delete_room(room_id: int, session: SessionDep) -> dict:
    room = session.get(Room, room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    session.delete(room)
    session.commit()
    return {"ok": True}
