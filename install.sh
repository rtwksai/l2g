#!/bin/sh
STARTDIR=$PWD
FRONTEND_LOCATION="${STARTDIR}/frontend"
BACKEND_LOCATION="${STARTDIR}/backend"
EXAMPLE_CONFIG="${BACKEND_LOCATION}/backend/config.example.py"

# Frontend
npm install --prefix ${STARTDIR}/frontend/

# Backend
pip install FLASK flask_cors

# Config and Env
cp ${EXAMPLE_CONFIG} '${STARTDIR}//backend/backend/config.py'
cp .env.example .env