# BlueLearnerHub Deployment Guide

## Overview
- **Backend**: Render (https://render.com)
- **Frontend**: Vercel (https://vercel.com)
- **Database**: MongoDB Atlas (your existing cluster)
- **Cache**: Render Redis (free tier)

---

## Step 1: Prepare for Deployment

### Generate Required Secrets
Run these commands to generate secure secrets:
```bash
openssl rand -hex 32  # JWT_SECRET
openssl rand -hex 32  # JWT_REFRESH_SECRET
openssl rand -hex 32  # SESSION_SECRET
openssl rand -hex 32  # COOKIE_SECRET
```

---

## Step 2: Deploy Backend to Render

### Option A: Using render.yaml (Auto-deploy)
1. Push your code to GitHub
2. Go to https://dashboard.render.com/blueprints
3. Click "New Blueprint Instance"
4. Connect your GitHub repo
5. Select the `devops/render.yaml` file
6. Create blueprint

### Option B: Manual Deploy
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add Environment Variables:

| Key | Value |
|-----|-------|
| NODE_ENV | `production` |
| MONGODB_URL | `mongodb+srv://connect_db_usern:<password>@bluelearnerhub.ty38f2n.mongodb.net/?appName=Bluelearnerhub` |
| JWT_SECRET | (your generated secret) |
| JWT_REFRESH_SECRET | (your generated secret) |
| SESSION_SECRET | (your generated secret) |
| COOKIE_SECRET | (your generated secret) |
| TRUST_PROXY | `true` |
| FRONTEND_URL | (your Vercel URL - see below) |
| GEMINI_API_KEY | (your API key - optional) |

6. Click "Create Web Service"

---

## Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repo
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
5. Add Environment Variables:

| Key | Value |
|-----|-------|
| NEXT_PUBLIC_API_URL | `https://bluelearnerhub-backend.onrender.com` |
| NEXT_PUBLIC_APP_NAME | `BluelearnerHub` |

6. Click "Deploy"

---

## Step 4: Update Environment Variables

After deployment, update these values:

### Backend (.env on Render):
- `FRONTEND_URL`: Your Vercel URL (e.g., `https://bluelearnerhub-frontend.vercel.app`)

### Frontend (.env on Vercel):
- `NEXT_PUBLIC_API_URL`: Your Render URL (e.g., `https://bluelearnerhub-backend.onrender.com`)

---

## Step 5: Verify Deployment

1. Check backend health: `https://bluelearnerhub-backend.onrender.com/health`
2. Check frontend: `https://your-vercel-project.vercel.app`

---

## Service URLs (Example)

| Service | URL |
|---------|-----|
| Backend | `https://bluelearnerhub-backend.onrender.com` |
| Frontend | `https://bluelearnerhub-frontend.vercel.app` |
| API | `https://bluelearnerhub-backend.onrender.com/api` |

---

## Troubleshooting

### If MongoDB connection fails:
- Verify MONGODB_URL in Render dashboard
- Check Atlas Network Access allows Render's IP

### If CORS errors:
- Update FRONTEND_URL in backend environment variables

### If 502 errors:
- Check Build logs in Render dashboard
- Verify `npm start` works locally

---

## Product API Endpoints

After deployment, products are available at:
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product