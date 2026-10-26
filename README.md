# Capitec Loan Eligibilty

### Prepared by Simamkele Ndabeni

A responsive loan eligibility simulator built with React, Express.js, and JSON Server.

## How to run the app

### 1. Clone the repository

```bash
git clone <repository-url>
cd capitec-eligibility-app
```

### 2. Start the mock database

Open a terminal in the backend directory:

```bash
cd backend
npm install
```

Start JSON Server using the database file:

```bash
npx json-server --watch db.json --port 3001
```

The mock database should now be available at:

```text
http://localhost:3001
```

### 3. Start the Express backend

Open a second terminal in the backend directory.

Install dependencies if you have not already done so:

```bash
npm install
```

Start the Express server using the script defined in
`backend/package.json`. For example:

```bash
npm run dev
```

The backend API should be available at:

```text
http://localhost:3000
```

### 4. Start the React frontend

Open a third terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

## How to run in Docker

### 1. Install and start Docker Desktop

Ensure Docker Desktop is installed and running.

Verify the installation:

```bash
docker --version
docker compose version
```

### 2. Build and start the containers

From the root directory containing docker-compose.yml, run:

```bash
docker compose up --build
```

### 3. Access the application

Once the containers are running, open the frontend URL configured in docker-compose.yml, expected to be:

```text
http://localhost:5173
```
