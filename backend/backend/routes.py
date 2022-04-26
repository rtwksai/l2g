from crypt import methods
from curses import meta
from backend import app
from backend.models import Database, ExtractMetadata, Schema, XMLParser
from backend.config import configs

import os
import logging
from werkzeug.utils import secure_filename
from flask import request, session

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('ping')

@app.route('/upload', methods=['POST'])
def fileUpload():
    UPLOAD_FOLDER = configs["UPLOAD_PATH"]
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

'''
Request Type
- GET from forms

Inputs
- DB_Url
- DB_Name
- Username
- Password

Outputs
- DB Metadata
'''

@app.route('/query-db', methods=['GET'])
def query_db():
    logger.info("Starting Query")
    db_url = request.args['db_url']
    db_name = request.args['db_name']
    db_uname = request.args['db_uname']
    db_pass = request.args['db_pass']
    emd = ExtractMetadata()
    metadata = emd.get_metadata(db_url, db_name, db_uname, db_pass)
    schema = Schema(db_name, metadata)
    schema.write_schema()
    xmp = XMLParser()
    # xmp.parse_xml('/home/keiser/test1.xml')
    return metadata