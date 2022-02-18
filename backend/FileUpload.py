import os
from flask import Flask, flash, request, redirect, url_for, session
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import logging
from config import configs

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger('ping')

UPLOAD_FOLDER = configs["UPLOAD_PATH"]
ALLOWED_EXTENSIONS = set(configs["ALLOWED_EXTNS"])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def fileUpload():
    target=os.path.join(UPLOAD_FOLDER, 'local_schema_files')
    if not os.path.isdir(target):
        os.mkdir(target)

    logger.info("Uploader Ready")
    
    file = request.files['file']
    
    filename = secure_filename(file.filename)
    destination="/".join([target, filename])
    file.save(destination)
    session['uploadFilePath']=destination
    
    response="Uploaded file"    
    return response

if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True,host="0.0.0.0", use_reloader=False)

app.secret_key = os.urandom(24)
CORS(app, expose_headers='Authorization')
