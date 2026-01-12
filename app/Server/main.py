from flask import Flask
from sqlalchemy import create_engine, text
import jwt
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# Database 
engine = create_engine(os.getenv("DATABASE_URL"))
with engine.connect() as conn:
    row = conn.execute(text("SELECT DATABASE(), VERSION()")).one()
    print(row)

# Ruteri (prebaciti u drugi fajl)
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/register", methods=['POST'])
def register():
    if request.method == "POST":
        # fetch datu iz headera
        # proveri jel postoji
        # ako postoji baci error

        # hash, i u bazu podataka
        pass

@app.route("/login", methods=['POST'])
def login():
    if request.method == "POST":
        # fetch datu iz headera
        # proveri jel postoji
        # ako ne postoji ili pass nije valid, baci error

        # jwt logika
        pass

# Boot up
if __name__ == "__main__":
    app.run(debug=True)