import json
from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base


class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    lobby_name = Column(String, unique=True)
    player1_user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    player2_user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    winner_user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    tie = Column(Boolean, default=False)
    game_state = Column(String, default=json.dumps([None]*9))
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    created_at = Column(DateTime, default=func.now())
    player1 = relationship("User", back_populates="games_as_player1", foreign_keys=[player1_user_id])
    player2 = relationship("User", back_populates="games_as_player2", foreign_keys=[player2_user_id])
    winner = relationship("User", back_populates="games_won", foreign_keys=[winner_user_id])


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    created_at = Column(DateTime, default=func.now())
    games_as_player1 = relationship("Game", back_populates="player1", foreign_keys="Game.player1_user_id")
    games_as_player2 = relationship("Game", back_populates="player2", foreign_keys="Game.player2_user_id")
    games_won = relationship("Game", back_populates="winner", foreign_keys="Game.winner_user_id")
