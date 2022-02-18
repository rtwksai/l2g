#!/bin/sh
STARTDIR=$PWD
FRONTEND_LOCATION="${STARTDIR}/frontend"
BACKEND_LOCATION="${STARTDIR}/backend"
EXAMPLE_CONFIG="${STARTDIR}/backend/config.example.py"

# Frontend
cd ${FRONTEND_LOCATION} & npm install

# Backend
cd ${BACKEND_LOCATION} & pip install FLASK flask_cors

# Config and Env
cp ${EXAMPLE_CONFIG} '${STARTDIR}/backend/config.py'
cp .env.example .env