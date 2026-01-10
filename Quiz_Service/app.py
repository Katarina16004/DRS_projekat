from flask import Flask
from infrastructure.repo.database_connect import app, db,test_connection

@app.route('/')
def index():
    return "Hello World!"


if __name__ == "__main__":
    test_connection()
    app.run(debug=True)