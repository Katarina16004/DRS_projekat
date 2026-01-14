from flask import Flask, Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from classes.database import Session
from classes.models import User
from util.extensions import bcrypt  
import jwt

routes = Blueprint("routes", __name__)

# Ruteri (prebaciti u drugi fajl)
@routes.route("/")
def hello_world():
    with Session.begin() as session:
        data = request.form
        existing_user = (
            session.query(User)
            .filter(User.username == "testuser5")
            .first()
        )

        if existing_user:
            print(existing_user)
            return "ARR"

        session.add(User(
            ID_User="test124",
            username="testuser5",
            password=bcrypt.generate_password_hash("password"),
            role="user"
        ))
        return "Added"

@routes.route("/register", methods=['POST'])
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

@routes.route("/login", methods=['POST'])
def login():
    if request.method == "POST":
        data = request.json
        # fetch datu iz headera
        # proveri jel postoji
        # ako ne postoji ili pass nije valid, baci error

        # jwt logika
        pass