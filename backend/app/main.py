import json
from fastapi import FastAPI, WebSocket, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from models import LeaderboardEntry, GameUpdate, AllGames, ActiveGames, GameCreate, UserBase, UserCreate
from database import engine, Base, get_db
from websocket_service import WebSocketService
from game_service import GameService
from user_service import UserService

app = FastAPI()

allowed_origins = [
    "http://localhost:3000",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ws_service = WebSocketService()

Base.metadata.create_all(bind=engine)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            action = message.get('action')

            if action == 'connect':
                user_id = message.get('userId')
                await ws_service.set_user(websocket, user_id)
            else:
                await ws_service.send_message(data)
    except Exception as e:
        print(e)
    finally:
        await ws_service.disconnect(websocket)


@app.post("/user", response_model=UserBase)
def create_user(user_name: UserCreate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    return user_service.create_user(user_name.name)


@app.get('/leaderboard', response_model=List[LeaderboardEntry])
def leaderboard(count: int = None, db: Session = Depends(get_db)):
    game_service = GameService(db)
    return game_service.leaderboard(count)


@app.get('/games', response_model=List[ActiveGames])
def active_games(db: Session = Depends(get_db)):
    game_service = GameService(db)
    return game_service.get_active_games()


@app.post("/game", response_model=AllGames)
def create_game(lobby_name: GameCreate, db: Session = Depends(get_db)):
    game_service = GameService(db)
    return game_service.create_game(lobby_name.lobby_name)


@app.put("/game/{game_id}", response_model=AllGames)
def update_game(game_id: int, game_update: GameUpdate, db: Session = Depends(get_db)):
    game_service = GameService(db)
    return game_service.update_game(game_id, game_update)
