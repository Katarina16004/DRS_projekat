from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

print(__name__)

if __name__ == "__app__":
    app.run(debug=True)