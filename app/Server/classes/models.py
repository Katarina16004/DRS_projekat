from sqlalchemy import text, Column, String, Date, ForeignKey, Integer
from sqlalchemy.orm import declarative_base, relationship


Base = declarative_base()

# Classes
class User(Base):
    __tablename__ = 'Users'
    ID_User = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(45), unique=True)
    username = Column(String(45), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(45), nullable=False)

    profile = relationship(
        "UserProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
        single_parent=True
    )

class UserProfile(Base):
    __tablename__ = "User_Profiles"

    ID_User = Column(
        Integer,
        ForeignKey("Users.ID_User"),
        primary_key=True
    )
    First_Name = Column(String(45))
    Last_Name = Column(String(45))
    Email = Column(String(45))
    Birth_Date = Column(Date)
    Gender = Column(String(10))
    Country = Column(String(45))
    Street = Column(String(45))
    Street_Number = Column(String(10))
    Image = Column(String(255))

    user = relationship("User", back_populates="profile")