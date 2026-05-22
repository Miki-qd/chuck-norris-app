from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class JokeBase(BaseModel):
    jokeText: str

class JokeCreate(JokeBase):
    pass

class JokeResponse(JokeBase):
    id: int
    email: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    
class AuthDto(BaseModel):
    email: EmailStr
    password: str
