from sqlalchemy import create_engine, text, Column, String, Date, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from dotenv import load_dotenv
import os

# Database 
load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"), echo=True)
Session = sessionmaker(engine)
