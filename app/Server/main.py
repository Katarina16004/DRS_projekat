from flask import Flask
from flask_bcrypt import Bcrypt
from sqlalchemy import create_engine, text, Column, String, Date, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
import jwt
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

Base = declarative_base()

bcrypt = Bcrypt(app)

# Classes
class User(Base):
    __tablename__ = 'Users'
    ID_User = Column(String(45), primary_key=True)
    username = Column(String(45), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(45), nullable=False)

    profile = relationship(
        "UserProfile",
        back_populates="user",
        uselist=False,
    )

class UserProfile(Base):
    __tablename__ = "User_Profiles"

    ID_User = Column(
        String(45),
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

    user = relationship("User", back_populates="profile")

# Database 
engine = create_engine(os.getenv("DATABASE_URL"), echo=True)
Session = sessionmaker(engine)

Base.metadata.create_all(engine)

# Ruteri (prebaciti u drugi fajl)
@app.route("/")
def hello_world():
    with Session.begin() as session:
        session.add(User(
            ID_User="test123",
            username="testuser",
            password=bcrypt.generate_password_hash("password"),
            role="user"
        ))
    return "<p>Hello, World!</p>"

@app.route("/register", methods=['POST'])
def register():
    if request.method == "POST":
        # fetch datu iz headera
        data = request.json
        
        # proveri jel postoji
        if User.query.filter_by(username=data["username"]).first():
            # ako postoji baci error
            return jsonify({"error": "User already exists"}), 409
        
        hashed_pw = bcrypt.generate_password_hash(data["password"])
        db.sess
        # hash, i u bazu podataka
        pass

@app.route("/login", methods=['POST'])
def login():
    if request.method == "POST":
        data = request.json
        # fetch datu iz headera
        # proveri jel postoji
        # ako ne postoji ili pass nije valid, baci error

        # jwt logika
        pass

# Boot up
if __name__ == "__main__":
    app.run(debug=True)