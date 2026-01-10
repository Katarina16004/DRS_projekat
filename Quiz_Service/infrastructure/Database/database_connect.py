from flask import Flask
from sqlalchemy import text  
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@127.0.0.1:3306/mydb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  

db = SQLAlchemy(app)

def test_connection():
      with app.app_context():
        try:
            result = db.session.execute(text('SELECT 1'))
            print("Database connection successful!")
        except Exception as e:
            print("Database connection failed:", e)


