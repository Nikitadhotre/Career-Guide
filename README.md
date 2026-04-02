# Career Guidance System

## Structure
- `frontend/` - React/Vite app (cd frontend && npm i && npm run dev → localhost:5173)
- `backend/` - Express/MongoDB API (cd backend && npm i && npm run dev → port 5000)
- Root: `npm run dev` starts both.

## Quick Start
1. `npm run install-all` (installs deps)
2. Copy `.env.example` → `.env` in backend/frontend, set `MONGODB_URI` in backend/.env
3. **Manual (permissions)**: `move src frontend\src` , `ren server backend`
4. `npm run dev`
5. Open http://localhost:5173

## Errors Fix
- 404 manifest.json: Complete src move to frontend/src
- MongoDB: Set MONGODB_URI (e.g. mongodb://localhost:27017/career_guide)

## Deploy
Vercel auto-detects frontend/backend from vercel.json.

Backend connected, frontend proxies /api calls to backend!
