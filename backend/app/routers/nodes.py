"""Node endpoints."""
from fastapi import APIRouter, HTTPException
from sqlmodel import select
from app.database import SessionDep
from app.models import Node
from app.schemas import ResponseSchema, NodeSchema, NodeCreateSchema, NodeUpdate

router = APIRouter(prefix="/nodes", tags=["nodes"])


@router.get("", response_model=ResponseSchema[list[NodeSchema]])
async def list_nodes(session: SessionDep) -> dict:
    """List all nodes on the grid"""
    nodes = session.exec(select(Node)).all()
    return {"data": nodes}

@router.get("/locations", response_model=ResponseSchema[list[NodeSchema]])
async def list_location_nodes(session: SessionDep) -> dict:
    """List nodes with a location"""
    data = select(Node).where(Node.node_type == "location")
    nodes = session.exec(data).all()
    return {"data": nodes}

@router.get("/occupants", response_model=ResponseSchema[list[NodeSchema]])
async def list_occupant_nodes(session:SessionDep) -> dict:
    """List nodes with occupants"""
    data = select(Node).where(Node.is_occupied == "1.0")
    nodes = session.exec(data).all()
    return {"data": nodes}

@router.get("/{node_id}", response_model=ResponseSchema[NodeSchema])
async def get_node(node_id: int, session: SessionDep) -> dict:
    """Return a node from its id"""
    node = session.get(Node, node_id)
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    return {"data": node}


@router.post("", response_model=ResponseSchema[NodeSchema], status_code=201)
async def create_node(node_data: NodeCreateSchema, session: SessionDep) -> dict:
    """Create a new node"""
    node = Node.model_validate(node_data)
    session.add(node)
    session.commit()
    session.refresh(node)
    return {"data": node}


@router.patch("/{node_id}/update", response_model=ResponseSchema[NodeSchema])
async def update_node(node_id: int, node_update: NodeUpdate, session: SessionDep) -> dict:
    """Update a node's label and node_type"""
    node = session.get(Node, node_id)
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")

    update_data = node_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(node, key, value)

    session.add(node)
    session.commit()
    session.refresh(node)
    return {"data": node}

@router.delete("/{node_id}")
async def delete_node(node_id: int, session: SessionDep) -> dict:
    """Delete a node"""
    node = session.get(Node, node_id)
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    session.delete(node)
    session.commit()
    return {"ok": True}
