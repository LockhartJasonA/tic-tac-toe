from fastapi import HTTPException
from sqlalchemy.orm import Session

from schemas import User


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def no_users_found_check(self, user_ids: [int]):
        existing_users = self.db.query(User.id).filter(User.id.in_(user_ids)).all()

        if len(existing_users) != len(user_ids):
            raise HTTPException(status_code=404, detail="One or more Users do not exist")

    def create_user(self, name: str):
        existing_user = self.db.query(User).filter(User.name == name).first()

        if existing_user is not None:
            raise HTTPException(status_code=409, detail="User with this name already exists")

        new_user = User(name=name)
        self.db.add(new_user)
        self.db.commit()

        return new_user
