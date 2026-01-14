from flask import Flask

from classes.models import Base
from classes.database import engine
from router.routes import routes
from util.extensions import bcrypt

app = Flask(__name__)
bcrypt.init_app(app)


Base.metadata.create_all(engine)
app.register_blueprint(routes)


# Boot up
if __name__ == "__main__":
    app.run(debug=True)