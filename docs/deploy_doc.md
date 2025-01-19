# Deployment Guide for OR1ON

# Original website: https://or1on.city/

This guide outlines the steps required to deploy and run the OR1ON application, ensuring you meet all the necessary prerequisites and configurations.

---

## Prerequisites

1. **Docker**: Ensure Docker is installed, running, and properly configured on your system.
2. **Repository Access**: Verify you have access rights to the repository.
3. **Environment Variables**:
   Configure the following environment variables based on your setup:
    - **JWT_SECRET**: A secret key for JWT authentication. Example: `Spa5VQm_UZv55urGvyEEhZQLogOm9Ia7eZFTZXIlitfSYj6wrQCXAL9R3uQNqA5HAcdBAdJynJA9cu6khpev9Q`. This should be a securely generated random string.
    - **HOST**: The host address for the backend server. Typically `127.0.0.1` for local setups.
    - **PORT**: The port on which the backend server runs. Commonly `3000`.
    - **CLIENT_PORT**: The port for the frontend development server. Default: `4173`.
    - **DB_HOST**: The database host. Use `localhost` if the database is local.
    - **DB_PORT**: The port for the database connection. Example: `5435` for PostgreSQL.
    - **DB_NAME**: The name of your database. Choose a relevant name, e.g., `or1on_db`.
    - **DB_USER**: The database user. Example: `user`.
    - **DB_PASSWORD**: The password for the database user. Example: `password2`.
    - **VITE_GRASSHOPER_API_KEY**: Your API key for GraphHopper. Example: `81b3426d-e75c-4098-969c-b2f9f3d3988c`. Obtain it from [GraphHopper](https://www.graphhopper.com/).
    - **VITE_BACKEND_URL**: The URL for the backend API. Example: `http://127.0.0.1:3000`.

---

## Deployment Steps

# Clone the Repository
```bash
git clone git@gitlab.com:saxionnl/hbo-ict/2.2-project-client-on-board/or1on.git
```
```bash
cd ./or1on/server
```

# Backend Setup
```bash
npm install
```
```bash
docker-compose up
```
```bash
npm run
```

# Insert Mock Data (Optional)
```bash
npm run insert-users
```
```bash
npm run insert-highlights
```
```bash
npm run insert-tours
```
```bash
npm run insert-feedbacks
```

# Frontend Setup
```bash
cd ../client
```
```bash
npm install --legacy-peer-deps
```
```bash
npm run dev
```

# Production Build
```bash
npm run build
```
```bash
npm run preview
```

# Testing
# Access the application at http://localhost:4173/
