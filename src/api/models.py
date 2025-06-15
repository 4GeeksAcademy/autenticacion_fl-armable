from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
    def add_user(email, password):
        new_user = User(email=email, password=password)
        if User.query.filter_by(email=email).first():
            return False
        db.session.add(new_user)
        db.session.commit()
        return True
    
    def get_user(email, password):
        user = User.query.filter_by(email=email, password=password).first()
        if user:
            return True
        return False
    
class Task(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    background: Mapped[str] = mapped_column(String(120), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "background": self.background,
        }
    def get_all_tasks():
        tasks = Task.query.all()
        if tasks:
            return [task.serialize() for task in tasks]
        return None
    def get_single_task(id):
        task = Task.query.get(id)
        if task:
            return task.serialize()
        return False
