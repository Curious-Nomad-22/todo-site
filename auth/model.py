
from sqlmodel import Field, Relationship, SQLModel


class User_Create(SQLModel):
    username: str
    password: str 
    

class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password: str

    notes: list["Notes"] = Relationship(back_populates="user")


class User_Read(SQLModel):
    id:int
    username: str

class Token(SQLModel):
    access_token: str
    token_type: str

class Notes(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    note: str 
    completed: bool = Field(default=False)
    user_id: int = Field(default=None, foreign_key="user.id")
    user: User = Relationship(back_populates="notes")

class Note_Create(SQLModel):
    note: str


 