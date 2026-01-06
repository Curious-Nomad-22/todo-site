from sqlmodel import create_engine
import os
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
  engine=create_engine(DATABASE_URL)
else:
  sqlite_url = f"sqlite:///base.db"
  connect_args = {"check_same_thread": False}
  engine = create_engine(sqlite_url, connect_args=connect_args)


