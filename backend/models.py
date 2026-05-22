from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

class Joke(Base):
    __tablename__ = "joke"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    jokeText = Column(String)
