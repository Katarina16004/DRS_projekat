from dotenv import load_dotenv

load_dotenv()

from flask import Flask
from flask_cors import CORS
from infrastructure.Database.database_connect import app, test_mysql_connection,test_redis_connection,db
from infrastructure.classes.Answer import Answer
from infrastructure.router.answer_router import answer_router
from infrastructure.router.game_routher import game_router
from infrastructure.router.question_router import question_router
from infrastructure.router.quiz_routher import quiz_router
import os

CORS_ORIGIN = os.getenv("CORS_ORIGIN")

@app.route('/')
def index():
    return "Hello World!"

CORS(app,resources={r"/*": {"origins": CORS_ORIGIN}})

app.register_blueprint(answer_router)
app.register_blueprint(game_router)
app.register_blueprint(quiz_router)
app.register_blueprint(question_router)

if __name__ == "__main__":
    test_mysql_connection()
    test_redis_connection()

    with app.app_context():
        db.create_all()

    port = int(os.getenv("PORT"))
    host = os.getenv("HOST")
    debug = os.getenv("DEBUG") 

    app.run(host=host, port=port, debug=debug)