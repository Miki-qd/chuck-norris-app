from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
import auth
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/register")
def register(body: schemas.AuthDto, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == body.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(body.password)
    new_user = models.User(email=body.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"id": new_user.id, "email": new_user.email}

@app.post("/auth/login")
def login(body: schemas.AuthDto, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == body.email).first()
    if not user or not auth.verify_password(body.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Matching NestJS JWT payload, usually it has email or sub
    access_token = auth.create_access_token(
        data={"email": user.email, "sub": user.email}
    )
    return {"access_token": access_token}

@app.post("/jokes")
def save_joke(
    body: schemas.JokeCreate,
    email: str = Depends(auth.get_current_user_email),
    db: Session = Depends(get_db)
):
    new_joke = models.Joke(email=email, jokeText=body.jokeText)
    db.add(new_joke)
    db.commit()
    db.refresh(new_joke)
    return new_joke

@app.get("/jokes")
def get_jokes(
    email: str = Depends(auth.get_current_user_email),
    db: Session = Depends(get_db)
):
    jokes = db.query(models.Joke).filter(models.Joke.email == email).all()
    return jokes

@app.delete("/jokes/{id}")
def delete_joke(
    id: int,
    email: str = Depends(auth.get_current_user_email),
    db: Session = Depends(get_db)
):
    joke = db.query(models.Joke).filter(models.Joke.id == id, models.Joke.email == email).first()
    if not joke:
        raise HTTPException(status_code=404, detail="Joke not found")
    
    db.delete(joke)
    db.commit()
    return {"message": "Joke deleted successfully"}
