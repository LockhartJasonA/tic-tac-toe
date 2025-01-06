from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class LeaderboardEntry(BaseModel):
    name: str
    wins: int


class UserBase(BaseModel):
    id: int
    name: str


class UserCreate(BaseModel):
    name: str


class ActiveGames(BaseModel):
    id: int
    lobby_name: str
    player1: Optional[UserBase] = None
    player2: Optional[UserBase] = None
    game_state: Optional[str] = None
    created_at: datetime


class AllGames(ActiveGames):
    winner: Optional[UserBase] = None
    game_state: Optional[str] = None
    tie: Optional[bool] = None


class GameCreate(BaseModel):
    lobby_name: str


class GameUpdate(BaseModel):
    lobby_name: Optional[str] = None
    player1_user_id: Optional[int] = None
    player2_user_id: Optional[int] = None
    winner_user_id: Optional[int] = None
    game_state: Optional[str] = None
    tie: Optional[bool] = None
