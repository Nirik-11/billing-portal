# Role-Based SaaS Billing Portal

A MERN stack app with role-based access (admin / manager / member) and mock subscription billing.

## Features
- JWT auth (signup/login)
- 3 roles: **admin** (manage users, view all invoices), **manager** (view all invoices), **member** (own plan + invoices only)
- Plans: Free / Pro / Enterprise, with mock instant-pay upgrade flow
- Invoice history per user + a combined admin/manager view

## Folder structure
```
billing-portal/
  server/   → Express + MongoDB API
  client/   → React (Vite) frontend
```

## Local setup

### 1. Backend
```
cd server
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev
```

### 2. Frontend
```
cd client
npm install
npm run dev
```
Create a `.env` in `client/` with:
```
VITE_API_URL=http://localhost:5000
```

## Deployment (same pattern as your task dashboard)
1. **MongoDB Atlas**: create a free cluster, get the connection string → `MONGO_URI`.
2. **Backend → Railway**: push `server/` to GitHub, deploy on Railway, set `MONGO_URI` and `JWT_SECRET` as environment variables there.
3. **Frontend → Netlify**: push `client/` to GitHub, deploy on Netlify, set `VITE_API_URL` to your Railway backend URL in Netlify's environment variables.

## Making your first admin
Sign up normally (role defaults to member/manager), then manually update that one user's `role` field to `"admin"` directly in MongoDB Atlas (Collections → users → edit document). After that, you can promote/demote anyone from the in-app **Manage Users** page.
