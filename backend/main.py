from fastapi import FastAPI, Depends, HTTPException, status
from sqlmodel import SQLModel, Session, select
from model import Note_Create, User, User_Create, User_Read, Notes
from database import engine
from typing import Annotated
from log import get_current_user
from passlib.context import CryptContext 
import log as log
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.include_router(log.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session

sessionDep = Annotated[Session, Depends(get_session)]
userDep = Annotated[dict, Depends(get_current_user)]
argon2_context = CryptContext(schemes=["argon2"], deprecated="auto")

@app.post("/register", response_model=User_Read, status_code=status.HTTP_201_CREATED)
def register_user(user: User_Create, session: sessionDep):
    db_user = session.exec(select(User).where(User.username == user.username)).first()

    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    new_user = User(username=user.username, password=argon2_context.hash(user.password))
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user

@app.post("/notes", status_code=status.HTTP_201_CREATED)
def add_note(data: Note_Create, user: userDep, session: sessionDep):
    new_note = Notes(note=data.note, user_id=user.id)
    session.add(new_note)
    session.commit()
    session.refresh(new_note)
    return new_note

@app.get("/notes")
def get_notes(user: userDep, session: sessionDep):
    notes = session.exec(select(Notes).where(Notes.user_id == user.id)).all()
    return notes
   
@app.patch("/notes/{note_id}/toggle")
def toggle_note_completion(note_id: int, user: userDep, session: sessionDep):
    note = session.exec(select(Notes).where(Notes.id == note_id, Notes.user_id == user.id)).first()
    if not note or note.user_id != user.id:
        raise HTTPException(status_code=404, detail="Note not found")
    note.completed = not note.completed
    session.add(note)
    session.commit()
    session.refresh(note)
    return note
 
@app.delete("/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int, user: userDep, session: sessionDep):
    note = session.exec(select(Notes).where(Notes.id == note_id, Notes.user_id == user.id)).first()
    if not note or note.user_id != user.id:
        raise HTTPException(status_code=404, detail="Note not found")
    session.delete(note)
    session.commit()
    return 


