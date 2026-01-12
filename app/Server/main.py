from flask import Flask
import jwt

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/register", methods=['POST'])
def register():
    if request.method == "POST":
        # fetch datu iz headera
        # proveri jel postoji
        # ako postoji baci error

        # hash, i u bazu podataka
        pass

@app.route("/login", methods=['POST'])
def login():
    if request.method == "POST":
        # fetch datu iz headera
        # proveri jel postoji
        # ako ne postoji ili pass nije valid, baci error

        # jwt logika
        pass

print(__name__)

if __name__ == "__main__":
    app.run(debug=True)