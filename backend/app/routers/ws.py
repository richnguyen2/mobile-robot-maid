from fastapi import APIRouter, WebSocket
from app.services.websocket_manager import manager

ws_router = APIRouter()

@ws_router.websocket("/robot")
async def robot_websocket(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except Exception:
        manager.disconnect(websocket)