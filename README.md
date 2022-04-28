# l2g
A webapp to convert given local schemas to a single global schema. This could be used to converge information from multiple data models and make queries in a single relational data model format. The project generates paths describing which data model to access the data from, thus converging the information for the teams to query on.

Currently supports CSV and SQL data models.

## Steps to install
- `cd l2g`
- `chmod +x install.sh`
- `./install.sh`

## Steps to run
Open 2 terminals. One is for the frontend and other is for the backend

### Frontend server
- `cd l2g`
- `cd frontend`
- `npm start`

### Backend server
- `cd l2g`
- `cd backend`
- `flask run`
