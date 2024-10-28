# Basketball ELO Rating System

A web application for tracking basketball games and player rankings using the ELO rating system.

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd basketball-elo
```

2. Install dependencies for all packages:
```bash
npm run install-all
```

3. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your configuration
```

4. Start the development servers:
```bash
npm start
```

This will start both the backend server (port 3001) and frontend development server (port 3000).

## Available Scripts

- `npm start`: Start both frontend and backend servers
- `npm run frontend`: Start only the frontend server
- `npm run backend`: Start only the backend server
- `npm run install-all`: Install dependencies for all packages

## Development

- Backend runs on: http://localhost:3001
- Frontend runs on: http://localhost:3000

## Technologies Used

- Frontend: React, TypeScript, Styled Components
- Backend: Node.js, Express, TypeScript, MongoDB
- Authentication: JWT
