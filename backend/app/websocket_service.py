from fastapi import WebSocket
from typing import Dict
import json

from database import get_db
from game_service import GameService

class WebSocketService:
    def __init__(self):
        self.active_connections: Dict[WebSocket, str] = {}

    async def set_user(self, websocket: WebSocket, user_id: str):
        self.active_connections[websocket] = user_id

    async def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            user_id = self.active_connections[websocket]
            del self.active_connections[websocket]

            db = next(get_db())
            game_service = GameService(db)
            game_service.remove_user_from_active_games(user_id)
            db.close()

            message = {
                "action": "userDisconnected",
                "userId": user_id
            }
            await self.send_message(json.dumps(message))

    async def send_message(self, message: str):
        for connection, user_id in self.active_connections.items():
            try:
                await connection.send_text(message)
            except Exception as e:
                print(f'Error sending message: {e}')
