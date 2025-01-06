from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from schemas import Game, User
from models import GameUpdate
from user_service import UserService


class GameService:
    def __init__(self, db: Session):
        self.db = db

    def game_exists_check(self, lobby_name: str, game_id: int = None):
        existing_game_query = self.db.query(Game).filter(Game.lobby_name == lobby_name)
        if game_id is not None:
            existing_game_query = existing_game_query.filter(Game.id != game_id)
        existing_game = existing_game_query.first()

        if existing_game is not None:
            raise HTTPException(status_code=409, detail="Game with this lobby name already exists")

    def create_game(self, lobby_name: str):
        self.game_exists_check(lobby_name)

        new_game = Game(lobby_name=lobby_name)

        self.db.add(new_game)
        self.db.commit()

        return new_game

    def update_game(self, game_id: int, game_update: GameUpdate):
        update_data = game_update.dict(exclude_unset=True)

        if not update_data:
            raise HTTPException(status_code=400, detail="Provide at least one field to update")

        game = self.db.query(Game).filter(Game.id == game_id).first()

        if game is None:
            raise HTTPException(status_code=404, detail="Game does not exist")

        self.game_exists_check(game_update.lobby_name, game_id)

        user_related_keys = ['player1_user_id', 'player2_user_id', 'winner_user_id']
        user_ids = []

        for key, value in update_data.items():
            if key in user_related_keys and value:
                user_ids.append(value)

        if len(user_ids):
            user_service = UserService(self.db)
            user_service.no_users_found_check(user_ids)

        for key, value in update_data.items():
            setattr(game, key, value)

        self.db.commit()

        return game

    def active_games(self):
        return self.db.query(Game).filter(Game.tie == False, Game.winner_user_id == None)

    def leaderboard(self, count: int = None):
        leaderboard_query = (
            self.db.query(User.name.label('name'), func.count(Game.winner_user_id).label('wins'))
            .join(User, Game.winner_user_id == User.id)
            .group_by(User.name)
            .order_by(func.count(Game.winner_user_id).desc(), User.name)
        )

        if count is not None:
            leaderboard_query = leaderboard_query.limit(count)

        return leaderboard_query.all()

    def get_active_games(self):
        return self.active_games().order_by(Game.id.desc()).all()

    def remove_user_from_active_games(self, user_id: str):
        users_active_games = (
            self.active_games()
            .filter((Game.player1_user_id == user_id) | (Game.player2_user_id == user_id))
            .all()
        )
        for game in users_active_games:
            if game.player1_user_id == user_id:
                game.player1_user_id = None
            if game.player2_user_id == user_id:
                game.player2_user_id = None
            self.db.commit()
