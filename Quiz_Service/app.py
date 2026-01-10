from flask import Flask
from infrastructure.Database.database_connect import app,test_connection
from infrastructure.classes.Answer import Answer

@app.route('/')
def index():
    return "Hello World!"

def saveTest():
    result = Answer(1,5,"Plava Motorola",1)
    result.save

if __name__ == "__main__":
    test_connection()
    with app.app_context():
        saveTest()
    app.run(debug=True)