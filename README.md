# Personal Expense Management System

A MERN stack application for user registration, login, and secure personal expense tracking.

## Features

- User registration with hashed passwords
- JWT-based login authentication
- Protected expense APIs
- Add and list personal expenses
- Dashboard total expense summary
- Optional category filtering on the dashboard

## Project Structure

- `server` - Express, MongoDB, JWT, bcrypt backend
- `client` - React frontend built with Vite

## Setup

1. Install dependencies:

```bash
npm install
npm run install:all
```

2. Create a backend environment file:

```bash
cp server/.env.example server/.env
```

3. Update `server/.env` with your MongoDB connection string and JWT secret.

4. Run the app:

```bash
npm run dev
```

## Deployment on Vercel and Render

Use this split deployment:

- `client` -> Vercel
- `server` -> Render
- Database -> MongoDB Atlas

### 1. Deploy the backend to Render

Create a new Render Web Service from the same repository and use:

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

Set these environment variables in Render:

- `MONGO_URI=your_mongodb_atlas_connection_string`
- `JWT_SECRET=your_secure_jwt_secret`
- `CLIENT_URLS=https://your-vercel-app.vercel.app`

After deploy, confirm the API is live at:

- `https://your-render-service.onrender.com/api/health`

### 2. Deploy the frontend to Vercel

Create a Vercel project from the same repository and set:

- Root Directory: `client`
- Framework Preset: `Vite`

Set this environment variable in Vercel:

- `BACKEND_URL=https://your-render-service.onrender.com`

The included [client/vercel.json](client/vercel.json) proxies `/api/*` to Render and rewrites all app routes to `index.html` for React Router.

### 3. Update CORS

If your Vercel URL changes, update `CLIENT_URLS` on Render to the new frontend domain and redeploy.

### 4. Local development

- Backend env template: [server/.env.example](server/.env.example)
- Frontend env template: [client/.env.example](client/.env.example)

For local development, the frontend can still use:

- `VITE_API_URL=http://localhost:5000/api`

### MongoDB

For production deployment, use MongoDB Atlas and place its connection string in `MONGO_URI`.

## Required Backend APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/expenses`
- `GET /api/expenses`

## Tech Stack

- MongoDB
- Express.js
- React
- Node.js
