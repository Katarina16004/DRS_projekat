from flask import Flask
from sqlalchemy import text
from flask_sqlalchemy import SQLAlchemy
from redis_om import get_redis_connection
import os

app = Flask(__name__)

# MYSQL 
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_PORT = os.getenv("MYSQL_PORT")
MYSQL_DB = os.getenv("MYSQL_DB")

app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}"
    f"@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

def test_mysql_connection():
    with app.app_context():
        try:
            db.session.execute(text('SELECT 1'))
            print(" MySQL connection successful!")
        except Exception as e:
            print(" MySQL connection failed:", e)

# REDIS 
REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = int(os.getenv("REDIS_PORT"))

redis = get_redis_connection(
    host=REDIS_HOST,
    port=REDIS_PORT,
    decode_responses=True
)

def test_redis_connection():
    try:
        redis.ping()
        print(" Redis connection successful!")
    except Exception as e:
        print(" Redis connection failed:", e)
