import os
from flask import Flask
from backend.config import configs

app = Flask(__name__)
UPLOAD_FOLDER = configs["UPLOAD_PATH"]
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

from backend import routes