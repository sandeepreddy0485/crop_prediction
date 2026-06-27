# CropSense - Deployment Guide (Vercel + Render)

## ✅ Pre-Deployment Checklist

Before deploying, complete all items:

- [ ] All tests pass locally (see TESTING_GUIDE.md)
- [ ] No console errors in browser
- [ ] No errors in backend terminal
- [ ] All API endpoints return correct data
- [ ] Weather API working
- [ ] MongoDB Atlas connection verified
- [ ] `.env` files NOT committed to GitHub
- [ ] `.gitignore` includes `.env`, `venv/`, `node_modules/`

---

## 🚀 Step 1: Prepare GitHub Repository

### 1.1 Create GitHub Repo (if not already done)

```bash
# Initialize git (if not done)
cd C:\Users\yaram\Desktop\crop_prediction
git init
git add .
git commit -m "Initial commit: CropSense full-stack app"

# Create new repo on GitHub:
# 1. Go to github.com/new
# 2. Name: crop_prediction
# 3. Description: AI-powered crop recommendation system
# 4. Public or Private (your choice)
# 5. Click "Create repository"
```

### 1.2 Push to GitHub

```bash
# Copy the HTTPS URL from GitHub
# Example: https://github.com/yourusername/crop_prediction.git

git remote add origin https://github.com/yourusername/crop_prediction.git
git branch -M main
git push -u origin main
```

### 1.3 Verify .gitignore

Make sure `.gitignore` in project root contains:

```
# Python
backend/venv/
backend/__pycache__/
backend/.env
backend/*.pyc

# Node
frontend/node_modules/
frontend/dist/
frontend/.env
frontend/.env.local

# ML
ml/venv/
ml/__pycache__/
ml/*.pkl

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
```

If no `.gitignore` file, create one:

```bash
cd C:\Users\yaram\Desktop\crop_prediction
# Create new file named .gitignore with content above
```

---

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Sign Up / Login to Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### 2.2 Import Your Repository

1. Click **"Add New"** → **"Project"**
2. Click **"Import Git Repository"**
3. Enter: `https://github.com/yourusername/crop_prediction`
4. Click **"Import"**

### 2.3 Configure Environment Variables

1. **Framework**: Vite (should auto-detect)
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Install Command**: `npm install`
5. Scroll down to **"Environment Variables"**
6. Click **"Add"** and enter:

```
Name:  VITE_WEATHER_API_KEY
Value: dc7f5f9999a016ab1055b4d3f6874ad6
```

7. Click **"Deploy"**

### 2.4 Wait for Deployment

- Vercel will:
  - Clone your repo
  - Install dependencies (`npm install`)
  - Build (`npm run build`)
  - Deploy to CDN
- Takes 2-3 minutes
- You'll get a URL like: `https://cropsense.vercel.app`

### 2.5 Verify Frontend Works

1. Open your Vercel URL: `https://cropsense.vercel.app`
2. You should see CropSense home page
3. **BUT** weather auto-fill won't work yet (backend not deployed)

---

## ⚙️ Step 3: Deploy Backend to Render

### 3.1 Sign Up / Login to Render

1. Go to **https://render.com**
2. Click **"Get Started"**
3. Choose **"Sign Up with GitHub"**
4. Authorize Render to access your GitHub

### 3.2 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Choose **"Connect a repository"**
3. Select `crop_prediction` from list
4. Click **"Connect"**

### 3.3 Configure Service

Fill in the form:

```
Name:                      cropsense-backend
Environment:               Python 3
Region:                    Oregon (or closest to you)
Branch:                    main
Root Directory:            backend
Build Command:             pip install -r requirements.txt
Start Command:             python app.py
```

### 3.4 Add Environment Variables

1. Scroll to **"Environment"**
2. Add each variable:

```
MONGO_URI
mongodb+srv://yaramalasandeepreddy_db_user:DKYE6SHJXTzzHhjG@cropsenseuser.lalktrv.mongodb.net/cropsense?retryWrites=true&w=majority&appName=cropsenseuser

JWT_SECRET
cropsense_super_secret_key_2024_xyz789abc

FLASK_ENV
production

FRONTEND_URL
https://cropsense.vercel.app
```

3. Click **"Create Web Service"**

### 3.5 Wait for Deployment

- Render will:
  - Clone your repo
  - Install dependencies
  - Start Flask app
- Takes 5-10 minutes
- You'll get a URL like: `https://cropsense-backend.onrender.com`

### 3.6 Verify Backend Works

```powershell
Invoke-WebRequest -Uri "https://cropsense-backend.onrender.com/api/health" | ConvertTo-Json
```

Expected response: `{"status": "ok", "service": "CropSense API"}`

---

## 🔗 Step 4: Connect Frontend to Deployed Backend

Now that both are deployed, update frontend to use deployed backend:

### 4.1 Update API URL in Frontend

Edit `frontend/src/components/InputForm.jsx`:

```javascript
// Change line 5:
// OLD:
const API = "http://127.0.0.1:5000/api";

// NEW:
const API = "https://cropsense-backend.onrender.com/api";
```

Also update in other files that use API:

1. `frontend/src/pages/Login.jsx` - update API URL
2. `frontend/src/pages/Dashboard.jsx` - update API url
3. Any other component using `http://127.0.0.1:5000`

### 4.2 Commit & Push to GitHub

```bash
cd C:\Users\yaram\Desktop\crop_prediction
git add -A
git commit -m "Update API URLs to deployed backend"
git push origin main
```

### 4.3 Vercel Auto-Redeploys

- Vercel automatically detects push to main
- Rebuilds and deploys frontend
- Takes 2-3 minutes
- Visit your Vercel URL to see updated app

---

## ✅ Step 5: Final Verification

### Test 5.1: Full End-to-End Test

1. Open **https://cropsense.vercel.app**
2. Test weather auto-fill:
   - Type city: `Bangalore`
   - Click "Get Weather"
   - ✅ Should fetch from deployed backend
3. Test login/register:
   - Register new user
   - ✅ Should save to MongoDB Atlas
4. Test prediction:
   - Make prediction with auto-filled data
   - ✅ Should use deployed backend ML model
5. Test history:
   - Save prediction
   - Go to Dashboard
   - ✅ Should show in history

### Test 5.2: API Endpoints

```powershell
# Test deployed backend health
Invoke-WebRequest -Uri "https://cropsense-backend.onrender.com/api/health" | ConvertTo-Json

# Test prediction
$body = @{
    N = 250
    P = 20
    K = 180
    temperature = 25
    humidity = 60
    rainfall = 100
    area = 1
} | ConvertTo-Json

Invoke-WebRequest `
  -Uri "https://cropsense-backend.onrender.com/api/predict" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body | ConvertTo-Json
```

### Test 5.3: CORS & Headers

Open browser DevTools (F12):

- Go to **Network** tab
- Make a request (e.g., weather auto-fill)
- Click on request
- Check **Response Headers** contain:
  ```
  access-control-allow-origin: https://cropsense.vercel.app
  ```

---

## 📊 Deployment Status Dashboard

### Vercel Dashboard

- URL: https://vercel.com/dashboard
- See deployment history
- Rollback if needed
- View logs: Click project → Deployments → View Function Logs

### Render Dashboard

- URL: https://dashboard.render.com
- See deployment history
- View logs: Click service → Logs

---

## 🐛 Common Deployment Issues

### ❌ Vercel: `VITE_WEATHER_API_KEY undefined`

**Solution:**

1. Go to Vercel Dashboard
2. Select project → Settings → Environment Variables
3. Verify `VITE_WEATHER_API_KEY` is set
4. Redeploy: Click "Deployments" → 3 dots → "Redeploy"

### ❌ Render: `MONGO_URI connection failed`

**Solution:**

1. Go to Render Dashboard → Environment
2. Verify MongoDB URI is exact (copy from MongoDB Atlas)
3. Check MongoDB Atlas IP whitelist allows Render IPs:
   - Go to https://cloud.mongodb.com → Network Access
   - Add IP: `0.0.0.0/0` (allows all IPs)

### ❌ Frontend can't reach backend

**Solution:**

1. Verify backend URL in frontend code:
   ```javascript
   const API = "https://cropsense-backend.onrender.com/api";
   ```
2. Check backend is running on Render:
   - Render Dashboard → Select backend service
   - Status should be "Live"
3. Check CORS headers in backend:
   - app.py should have `CORS(app)`

### ❌ Render backend in "suspended" state

**Solution:**

- Render suspends services that don't get traffic for 15+ minutes
- Make a request to wake it up: https://cropsense-backend.onrender.com/api/health
- Takes 30 seconds to start

### ❌ Long cold start time

**Solution:**

- Render free tier spins down after inactivity
- Consider upgrading to Paid tier for always-on
- Or make a request every 10 minutes to keep alive

---

## 🔐 Security Checklist

- [ ] `.env` files NOT in GitHub (check `.gitignore`)
- [ ] Secrets NOT printed in logs
- [ ] MongoDB password NOT in connection string comment
- [ ] JWT secret is strong (not "dev-secret")
- [ ] CORS allows only verified frontend URL
- [ ] HTTPS used everywhere (both Vercel & Render use HTTPS by default)

---

## 📈 Next Steps After Deployment

1. **Monitor Performance**
   - Check Vercel/Render dashboards weekly
   - Monitor response times
   - Check error rates

2. **Gather Feedback**
   - Share deployed URL with farmers
   - Collect feedback
   - Note bugs/feature requests

3. **Iterate & Improve**
   - Fix bugs
   - Add new crops to ML model
   - Improve UI/UX
   - Add more languages

4. **Scale Up** (if needed)
   - Upgrade Render to paid tier
   - Add database backups
   - Set up monitoring alerts

---

## 📞 Deployment Support

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas Support: https://support.mongodb.com
- Flask Deployment: https://flask.palletsprojects.com/en/2.3.x/deploying/

---

## ✨ Celebrate! 🎉

Your CropSense app is now live on the internet!

Share your deployed URL: **https://cropsense.vercel.app**

**Next: Gather feedback from users and keep improving!**
