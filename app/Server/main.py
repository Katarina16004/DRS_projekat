from dotenv import load_dotenv
import os
load_dotenv()

from flask import Flask
from flask_cors import CORS

from classes.models import Base
from classes.database import engine
from router.routes import routes
from util.extensions import bcrypt


app = Flask(__name__)
app.config["BCRYPT_LOG_ROUNDS"] = int(os.getenv("BCRYPT_LOG_ROUNDS"))
app.json.sort_keys = False
bcrypt.init_app(app)
CORS_ORIGIN = os.getenv("CORS_ORIGIN")


Base.metadata.create_all(engine)
app.register_blueprint(routes)

CORS(
    app,
    resources={r"/*": {"origins": CORS_ORIGIN}},
    supports_credentials=True
)

# Boot up
if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=False)