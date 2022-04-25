from backend import app
import os
from flask_cors import CORS

if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True,host="0.0.0.0", use_reloader=False)

app.secret_key = os.urandom(24)
CORS(app, expose_headers='Authorization')

