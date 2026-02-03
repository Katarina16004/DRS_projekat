from flask import Flask
from sqlalchemy import text  
from flask_sqlalchemy import SQLAlchemy
from redis_om import get_redis_connection   
import os

app = Flask(__name__)

#MYSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@127.0.0.1:3306/mydb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  

db = SQLAlchemy(app)

def test_MySQL_connection():
      with app.app_context():
        try:
            result = db.session.execute(text('SELECT 1'))
            print("Database connection successful!")
        except Exception as e:
            print("Database connection failed:", e)


#REDIS
redis = get_redis_connection(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True
)


def test_redis_connection():
    try:
        redis.ping()
        print("Redis connection successful!")
    except Exception as e:
        print("Redis connection failed:", e)
