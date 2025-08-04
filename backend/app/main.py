# backend/app/main.py
from fastapi import FastAPI, HTTPException, Depends, Header
from app.models import UserRegister, UserLogin
from app.auth import (
    users_db,
    get_password_hash,
    verify_password,
    create_access_token,
    decode_token
)
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register")
def register(user: UserRegister):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Username already exists")
    users_db[user.username] = get_password_hash(user.password)
    return {"msg": "User registered successfully"}

@app.post("/login")
def login(user: UserLogin):
    if user.username not in users_db:
        raise HTTPException(status_code=400, detail="User not found")
    if not verify_password(user.password, users_db[user.username]):
        raise HTTPException(status_code=400, detail="Incorrect password")
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/protected")
def protected_route(authorization: str = Header(...)):
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"msg": f"Welcome {payload['sub']}!"}
