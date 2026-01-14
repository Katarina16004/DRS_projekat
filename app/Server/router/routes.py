from flask import Flask, Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from classes.database import Session
from classes.models import User
from util.extensions import bcrypt  
from functools import wraps
import jwt
import datetime

routes = Blueprint("routes", __name__)

@routes.route("/register", methods=['POST'])
def register():
    if request.method == "POST":
        with Session.begin() as session:
            data = request.form
            print(request.form.get("username"))
            existing_user = (
                session.query(User)
                .filter(User.username == data["username"])
                .first()
            )

            # Da li korisnik vec postoji?
            if existing_user:
                return jsonify({"error": "User already exists"}), 409

            session.add(User(
                username=data["username"],
                password=bcrypt.generate_password_hash(data["password"]),
                role="user"
            ))
            return jsonify({"message": "User registered successfully"}), 201

    # Invalid request
    return jsonify({"error": "Invalid request"}), 400

@routes.route("/login", methods=['POST'])
def login():
    if request.method == "POST":
        with Session.begin() as session:
            data = request.form
            print(request.form.get("username"))
            existing_user = (
                session.query(User)
                .filter(User.username == data["username"])
                .first()
            )

            # Da li korisnik postoji?
            if not existing_user:
                return jsonify({"error": "No such user!"}), 409

            # Da li je lozinka tacna?
            if not bcrypt.check_password_hash(existing_user.password, data["password"]):
                return jsonify({"error": "Wrong password!"}), 409

            # JWT token
            payload = {
                "user": existing_user.ID_User,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            }

            token = jwt.encode(
                payload,
                "temporary_secret_key",
                algorithm="HS256" 
            )


            return jsonify({ "token": token, "message": "User exists!"}), 201

    # Invalid request
    return jsonify({"error": "Invalid request"}), 400

@routes.route("/check", methods=['POST'])
def check():
    if request.method == "POST":
        try:
            token = request.headers.get("Authorization").split(" ")[1]
            print(token)
            decoded = jwt.decode(token, "temporary_secret_key", algorithms=["HS256"])
            return jsonify({"message": "Token is valid", "user": decoded["user"]}), 200

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401

        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

    return jsonify({"error": "Invalid request"}), 400

# Protection
def protected(required_role=None):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None

            # Get token from header
            if 'Authorization' in request.headers:
                auth_header = request.headers['Authorization']
                if auth_header.startswith("Bearer "):
                    token = auth_header.split(" ")[1]

            if not token:
                return jsonify({"msg": "Token is missing!"}), 401

            try:
                data = jwt.decode(token, "temporary_secret_key", algorithms=["HS256"])
                current_user = data["user"]
                if (required_role):
                    allowed_roles = (
                        [required_role] if isinstance(required_role, str) else list(required_role)
                    )
                    
                    with Session.begin() as session:
                        user = session.query(User).filter(User.ID_User == current_user).first()
                        if user.role not in allowed_roles:
                            return jsonify({"msg": "Insufficient permissions!"}), 403
            except jwt.ExpiredSignatureError:
                return jsonify({"msg": "Token has expired!"}), 401
            except jwt.InvalidTokenError:
                return jsonify({"msg": "Invalid token!"}), 401

            return f(current_user, *args, **kwargs)
        return decorated
    return decorator


@routes.route("/admin", methods=['GET'])
@protected(required_role=['admin'])
def admin(current_user):  
    return jsonify({"message": "Welcome, admin!"}), 200

