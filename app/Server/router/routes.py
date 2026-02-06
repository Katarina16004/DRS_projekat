from flask import Flask, Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from classes.database import Session
from classes.models import User, UserProfile
from util.extensions import bcrypt  
from functools import wraps
from collections import defaultdict
from services.mail_service import send_email
import jwt
import datetime
import requests

routes = Blueprint("routes", __name__)

FAILED_LOGINS = defaultdict(lambda: {
    "count": 0,
    "locked_until": None
})

MAX_ATTEMPTS = 3
LOCK_TIME = datetime.timedelta(minutes=1)

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
                    Street_Number=data["street_number"],
                    Image = data.get("image","")
                ))
                session.commit()
                return jsonify({"message": "User registered successfully"}), 201

            except Exception as e:
                session.rollback()
                return jsonify({"error": "Registration failed", "details": str(e)}), 400

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

            now = datetime.datetime.utcnow()
            user_state = FAILED_LOGINS[existing_user.email]

            # Check if user is locked
            if user_state["locked_until"] and user_state["locked_until"] > now:
                return jsonify({
                    "error": "Account locked. Try again later.",
                    "locked_until": user_state["locked_until"].isoformat()
                }), 403

            # Da li je lozinka tacna?
            if not bcrypt.check_password_hash(existing_user.password, data["password"]):
                user_state["count"] += 1
                if user_state["count"] >= MAX_ATTEMPTS:
                    user_state["locked_until"] = now + LOCK_TIME
                    user_state["count"] = 0

                    return jsonify({
                        "error": "Account locked due to multiple failed attempts. Try again in 1 minute."
                    }), 403
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
            # ceo decoded payload
            return jsonify({"message": "Token is valid", "user": decoded}), 200
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
    return jsonify({"error": "Invalid request"}), 400

def protected(required_role=None):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            if 'Authorization' in request.headers:
                auth_header = request.headers['Authorization']
                if auth_header.startswith("Bearer "):
                    token = auth_header.split(" ")[1]
            if not token:
                return jsonify({"msg": "Token is missing!"}), 401
            try:
                data = jwt.decode(token, "temporary_secret_key", algorithms=["HS256"])
                current_user = data["id"] #koristimo id
                if required_role:
                    allowed_roles = (
                        [required_role] if isinstance(required_role, str) else list(required_role)
                    )
                    with Session.begin() as session:
                        user = session.query(User).filter(User.ID_User == current_user).first()
                        if not user or user.role not in allowed_roles:
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

@routes.route("/all_users", methods=['GET'])
@protected(required_role=['admin'])
def all_users(current_user):
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
                "Street_Number": user.Street_Number,
                "role": user.user.role,
                "Image":user.Image
            }
            for user in users
        ]
        return jsonify(users_list), 200

@routes.route("/delete/<int:user_id>", methods=['DELETE'])
@protected(required_role=['admin'])
def delete(current_user, user_id):
    with Session.begin() as session:
        profile = session.query(UserProfile).filter(UserProfile.ID_User == user_id).first()
        if profile:
            session.delete(profile)
        user = session.query(User).filter(User.ID_User == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        session.delete(user)
        session.commit()
        return jsonify({"message": "User deleted successfully"}), 200

@routes.route("/role/<int:user_id>", methods=['PUT'])
@protected(required_role=['admin'])
def change_role(current_user, user_id):
    data = request.form
    new_role = data.get("role")

    if new_role not in ["user", "moderator", "admin"]:
        return jsonify({"error": "Invalid role"}), 400

    with Session.begin() as session:
        user = session.query(User).filter(User.ID_User == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        user.role = new_role

        profile = session.query(UserProfile).filter(UserProfile.ID_User == user_id).first()

        response_data = {
            "ID_User": user.ID_User,
            "First_Name": profile.First_Name if profile else None,
            "Last_Name": profile.Last_Name if profile else None,
            "Email": user.email,
            "Birth_Date": profile.Birth_Date.isoformat() if profile and profile.Birth_Date else None,
            "Gender": profile.Gender if profile else None,
            "Country": profile.Country if profile else None,
            "Street": profile.Street if profile else None,
            "Street_Number": profile.Street_Number if profile else None,
            "role": user.role,
            "Image": profile.Image if profile else ""
        }

        user_email = user.email
        user_username = user.username

    send_email(
        user_email,
        user_username,
        "Role Update",
        f"Your role has been changed to {new_role}",
    )

    return jsonify(response_data), 200

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
        if "image" in data:
            profile.Image = data["image"]
        if "role" in data:
            profile.user.role = data["role"]

        session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200
    
@routes.route("/profile/<int:user_id>", methods=['GET'])
@protected()
def get_profile(current_user, user_id):
    with Session.begin() as session:
        result = (
            session.query(UserProfile, User)
            .join(User, User.ID_User == UserProfile.ID_User)
            .filter(UserProfile.ID_User == user_id)
            .first()
        )

        if not result:
            return jsonify({"error": "Profile not found"}), 404

        profile, user = result

        profile_data = {
            "ID_User": user.ID_User,
            "First_Name": profile.First_Name if profile else None,
            "Last_Name": profile.Last_Name if profile else None,
            "Email": user.email,
            "Birth_Date": profile.Birth_Date.isoformat() if profile and profile.Birth_Date else None,
            "Gender": profile.Gender if profile else None,
            "Country": profile.Country if profile else None,
            "Street": profile.Street if profile else None,
            "Street_Number": profile.Street_Number if profile else None,
            "role": user.role,
            "Image": profile.Image if profile else ""
        }

        return jsonify(profile_data), 200

# Quiz Service
@protected(required_role=['moderator'])
@routes.route('/answers', methods=['GET'])
def get_all_answers(current_user):
    response = requests.get("http://localhost:5123/answers")
    return jsonify(response.json(), response.status_code)

@protected(required_role=['moderator'])
@routes.route('/answer/<int:question_id>/answers', methods=['GET'])
def get_all_answers(current_user, question_id):
    response = requests.get("http://localhost:5123/answer/" + question_id + "/answers")
    return jsonify(response.json(), response.status_code)

@protected()
@routes.route('/quizzes/answer', methods=['POST'])
def submit_answer(current_user):
    if current_user != data["user_id"]:
        return jsonify({"msg": "User ID mismatch!"}), 401

    data = request.form
    toSend = {
        'session_id': data["session_id"],
        'question_id': data["question_id"],
        'answer_id': data["answer_id"],
        'user_id': data["user_id"]
    }
    response = requests.post("http://localhost:5123/quizzes/answer", json = toSend)
    return jsonify(response.json(), response.status_code)

@protected(required_role=['moderator'])
@routes.route('/answer/<int:question_id>/answers', methods=['POST'])
def create_answer(current_user, question_id):
    data = request.form
    toSend = {
        'question_id': question_id,
        'Answer_Text': data["Answer_Text"],
        'Is_Correct': data["Is_Correct"],
    }
    response = requests.post("http://localhost:5123/answer/" + question_id + "/answers", json = toSend)
    return jsonify(response.json(), response.status_code)

@protected(required_role=['moderator'])
@routes.route('/answer/<int:question_id>/answers/<int:answer_id>', methods=['POST'])
def update_answer(current_user, question_id, answer_id):
    data = request.form
    toSend = {
        'question_id': question_id,
        'Answer_Text': data["Answer_Text"],
        'Is_Correct': data["Is_Correct"],
    }
    response = requests.post("http://localhost:5123/answer/<int:question_id>/answers/", json = toSend)
    return jsonify(response.json(), response.status_code)

# Game Service
@protected(required_role=['moderator'])
@routes.route('/games/all', methods=['GET'])
def get_all_games(current_user):
    response = requests.get("http://localhost:5123/games/all")
    return jsonify(response.json(), response.status_code)

@protected()
@routes.route('/games/<int:ID_Game>', methods=['GET'])
def get_game(current_user, ID_Game):
    response = requests.get("http://localhost:5123/games/" + ID_Game)
    return jsonify(response.json(), response.status_code)

@protected()
@routes.route('/games/<int:ID_Player>', methods=['GET'])
def get_player_games(current_user, ID_Player):
    response = requests.get("http://localhost:5123/games/" + ID_Player)
    return jsonify(response.json(), response.status_code)