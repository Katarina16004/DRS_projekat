from flask import Flask, Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from classes.database import Session
from classes.models import User, UserProfile
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
            existing_user = (
                session.query(User)
                .filter(User.username == data["username"] or User.email == data["email"])
                .first()
            )

            # Da li korisnik vec postoji?
            if existing_user:
                return jsonify({"error": "Username or email already exists!"}), 409


            try:
                session.add(User(
                    email=data["email"],
                    username=data["username"],
                    password=bcrypt.generate_password_hash(data["password"]),
                    role="user"
                ))

                new_user = (
                    session.query(User)
                    .filter(User.email == data["email"])
                    .first()
                )

                session.add(UserProfile(
                    ID_User=new_user.ID_User,
                    First_Name=data["first_name"],
                    Last_Name=data["last_name"],
                    Email=data["email"],
                    Birth_Date=data["birth_date"],
                    Gender=data["gender"],
                    Country=data["country"],
                    Street=data["street"],
                    Street_Number=data["street_number"]
                ))
                session.commit()
                return jsonify({"message": "User registered successfully"}), 201

            except Exception as e:
                session.rollback()
                return jsonify({"error": "Registration failed", "details": str(e)}), 400
            

    # Invalid request
    return jsonify({"error": "Invalid request"}), 400

@routes.route("/login", methods=['POST'])
def login():
    if request.method == "POST":
        with Session.begin() as session:
            data = request.form
            existing_user = (
                session.query(User)
                .filter(User.email == data["email"])
                .first()
            )

            if not existing_user:
                return jsonify({"error": "No such user!"}), 409
            if not bcrypt.check_password_hash(existing_user.password, data["password"]):
                return jsonify({"error": "Wrong password!"}), 409

            # JWT token (nova polja!)
            payload = {
                "id": existing_user.ID_User,
                "username": existing_user.username,
                "role": existing_user.role,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            }
            token = jwt.encode(payload, "temporary_secret_key", algorithm="HS256")
            return jsonify({ "token": token, "message": "User exists!"}), 201
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

# Admin ruta za sve usere
@routes.route("/all_users", methods=['GET'])
@protected(required_role=['admin'])
def all_users():
    with Session.begin() as session:
        users = session.query(UserProfile).all()
        users_list = [
            {
                "ID_User": user.ID_User,
                "First_Name": user.First_Name,
                "Last_Name": user.Last_Name,
                "Email": user.Email,
                "Birth_Date": user.Birth_Date.isoformat() if user.Birth_Date else None,
                "Gender": user.Gender,
                "Country": user.Country,
                "Street": user.Street,
                "Street_Number": user.Street_Number
            }
            for user in users
        ]
        return jsonify(users_list), 200

# Admin delete 
@routes.route("/delete/<int:user_id>", methods=['DELETE'])
@protected(required_role=['admin'])
def delete(user_id):
    with Session.begin() as session:
        user = session.query(User).filter(User.ID_User == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        session.delete(user)
        session.commit()
        return jsonify({"message": "User deleted successfully"}), 200

# Admin change role
@routes.route("/role/<int:user_id>", methods=['PUT'])
@protected(required_role=['admin'])
def change_role(user_id):
    data = request.form
    new_role = data.get("role")
    if new_role not in ["user", "moderator", "admin"]:
        return jsonify({"error": "Invalid role"}), 400

    with Session.begin() as session:
        user = session.query(User).filter(User.ID_User == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        user.role = new_role
        session.commit()
        return jsonify({"message": "User role updated successfully"}), 200

# User change self
@routes.route("/update_profile", methods=['PUT'])
@protected()
def update_profile(current_user):
    data = request.form

    with Session.begin() as session:
        profile = session.query(UserProfile).filter(UserProfile.ID_User == current_user).first()
        if not profile:
            return jsonify({"error": "Profile not found"}), 404

        if "first_name" in data:
            profile.First_Name = data["first_name"]

        if "last_name" in data:
            profile.Last_Name = data["last_name"]

        if "email" in data:
            profile.Email = data["email"]

        if "birth_date" in data:
            profile.Birth_Date = data["birth_date"]

        if "gender" in data:
            profile.Gender = data["gender"]

        if "country" in data:
            profile.Country = data["country"]

        if "street" in data:
            profile.Street = data["street"]

        if "street_number" in data:
            profile.Street_Number = data["street_number"]

        session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200