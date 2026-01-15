from flask import Flask
from infrastructure.Database.database_connect import app,test_connection,db
from infrastructure.classes.Answer import Answer
from infrastructure.router.answer_router import answer_router



@app.route('/')
def index():
    return "Hello World!"

app.register_blueprint(answer_router)
if __name__ == "__main__":
    test_connection()
    with app.app_context():
        db.create_all()
    app.run()