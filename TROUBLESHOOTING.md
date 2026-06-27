# CropSense - Troubleshooting & Quick Reference

## 🔧 Common Issues & Solutions

### Backend Issues

#### ❌ `ModuleNotFoundError: No module named 'flask'`
**Solution:**
```powershell
cd C:\Users\yaram\Desktop\crop_prediction\backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

#### ❌ `Connection refused: 127.0.0.1:5000`
**Solution:**
```powershell
# Make sure backend is running:
cd C:\Users\yaram\Desktop\crop_prediction\backend
.\venv\Scripts\Activate.ps1
python app.py
# Should show: Running on http://127.0.0.1:5000
```

#### ❌ `MONGO_URI not found` or MongoDB connection error
**Solution:**
1. Open `backend/.env` and verify:
   ```
   MONGO_URI=mongodb+srv://yaramalasandeepreddy_db_user:DKYE6SHJXTzzHhjG@cropsenseuser.lalktrv.mongodb.net/cropsense?retryWrites=true&w=majority&appName=cropsenseuser
   ```
2. Check MongoDB Atlas:
   - Go to https://cloud.mongodb.com
   - Verify IP whitelist includes `0.0.0.0/0` (allows all IPs)
   - Verify database user credentials are correct

#### ❌ `CORS error: Access to XMLHttpRequest blocked`
**Solution:**
- Backend should have `CORS(app)` in app.py (it does)
- Make sure `FRONTEND_URL` in `.env` is correct
- Try hard-refresh frontend: `Ctrl+Shift+R`

#### ❌ Prediction returns wrong crop
**Solution:**
- Check ML model is properly loaded
- Verify input values are in expected ranges:
  - N, P, K: 0-300
  - Temperature: -20 to 50°C
  - Humidity: 0-100%
  - Rainfall: 0-400mm
  - Area: 0.1-100 hectares

---

### Frontend Issues

#### ❌ `npm: command not found`
**Solution:**
```powershell
# Install Node.js from nodejs.org
# Then restart PowerShell and try:
npm --version
```

#### ❌ `Error: Cannot find module 'react'`
**Solution:**
```powershell
cd C:\Users\yaram\Desktop\crop_prediction\frontend
npm install
npm run dev
```

#### ❌ Weather API returns 401 (Unauthorized)
**Solution:**
1. Check `frontend/.env`:
   ```
   VITE_WEATHER_API_KEY=dc7f5f9999a016ab1055b4d3f6874ad6
   ```
2. Try getting a new key from: https://openweathermap.org/api
3. If key is correct, wait 10 minutes (sometimes takes time to activate)
4. Hard-refresh frontend: `Ctrl+Shift+R`

#### ❌ "City not found" error when typing valid city
**Solution:**
- OpenWeatherMap API is case-sensitive for some cities
- Try alternatives:
  - `Hyderabad` ✅ (not `hyderabad`)
  - `Bangalore` ✅ (not `bangalore`)
  - Or use full address: `Hyderabad, Telangana, India`
- If still not found, city may be too small; try nearest district/town

#### ❌ Form fields won't fill when clicking "Auto-Fill All"
**Solution:**
1. Open browser DevTools: `F12`
2. Go to **Console** tab
3. Check for error messages
4. Try "Get Weather" first to ensure API connection works
5. Select a region in dropdown before clicking "Auto-Fill All"

#### ❌ Login shows "Invalid credentials"
**Solution:**
- Verify email & password are correct
- Check MongoDB Atlas has user saved:
  1. Go to https://cloud.mongodb.com
  2. Collections → cropsense → users
  3. Look for your user email
- Try registering again with new email

#### ❌ Logout doesn't work
**Solution:**
```javascript
// Check localStorage is cleared:
// DevTools → Application → Local Storage → http://localhost:5173
// Should be empty after logout
```

#### ❌ Dashboard page is empty
**Solution:**
1. Make sure you're logged in (check Navbar)
2. Make sure you've made at least one prediction
3. Check browser console for errors: `F12` → Console
4. Try making a prediction and saving it first

---

### API Testing in PowerShell

#### ✅ Test Backend Health
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/health" -Method GET | ConvertTo-Json
```
Expected: `{"status": "ok", "service": "CropSense API"}`

#### ✅ Test Prediction API
```powershell
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
  -Uri "http://127.0.0.1:5000/api/predict" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body | ConvertTo-Json
```
Expected: `{crop: "...", confidence: ..., yield_estimate: ..., alternatives: [...]}`

#### ✅ Register Test User
```powershell
$body = @{
    name = "Test User"
    email = "testuser@example.com"
    password = "TestPass123"
} | ConvertTo-Json

$response = Invoke-WebRequest `
  -Uri "http://127.0.0.1:5000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json
```
Expected: `{message: "...", token: "...", user: {...}}`

#### ✅ Login & Get Token
```powershell
$loginBody = @{
    email = "testuser@example.com"
    password = "TestPass123"
} | ConvertTo-Json

$loginResp = Invoke-WebRequest `
  -Uri "http://127.0.0.1:5000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $loginBody

$token = ($loginResp.Content | ConvertFrom-Json).token
Write-Host "Token: $token"

# Use token in future requests
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
```

---

## 🔍 Debugging Tips

### 1. Check Browser Console for Errors
```
Press F12 → Console tab
Look for red error messages
Copy error and search in TESTING_GUIDE.md
```

### 2. Check Network Requests
```
Press F12 → Network tab
Make a prediction
Click on requests to see response
Look for red (failed) requests
```

### 3. Check MongoDB Connection
```powershell
# In PowerShell, test MongoDB connection:
mongo "mongodb+srv://user:pass@cluster.mongodb.net/cropsense"
```

### 4. Check Backend Logs
```
Terminal where backend is running should show:
- Request logs (GET, POST, DELETE)
- Error traces if something fails
```

### 5. Check Frontend Logs
```
Browser Console (F12) should show:
- API requests being made
- Response data
- Error messages
```

### 6. Test API Manually
```powershell
# Use Invoke-WebRequest to test each endpoint
Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/health"
```

---

## 📱 Browser DevTools Shortcuts

| Action | Shortcut |
|--------|----------|
| Open DevTools | F12 |
| Console | F12 → Console |
| Network | F12 → Network |
| Local Storage | F12 → Application → Local Storage |
| Elements | F12 → Elements |
| Hard Refresh | Ctrl + Shift + R |
| Clear Cache | Ctrl + Shift + Delete |

---

## 🔑 Important Files Reference

| File | Purpose |
|------|---------|
| `backend/.env` | Database & JWT secrets |
| `backend/app.py` | Flask app entry point |
| `backend/routes/predict.py` | Prediction endpoint |
| `backend/routes/auth.py` | Login/register endpoint |
| `backend/routes/history.py` | Save/view predictions |
| `frontend/.env` | Weather API key |
| `frontend/src/App.jsx` | Main routing |
| `frontend/src/context/AuthContext.jsx` | User login state |
| `frontend/src/components/InputForm.jsx` | Weather auto-fill |
| `ml/crop_model.pkl` | Trained ML model |

---

## ✅ Pre-Deployment Checklist

Before deploying to Vercel/Render, make sure:

### Backend
- [ ] `python app.py` runs without errors
- [ ] All `/api/*` endpoints return 200 status
- [ ] MongoDB Atlas connection works
- [ ] JWT tokens are generated & validated
- [ ] Error messages are clear & helpful
- [ ] `CORS` is enabled

### Frontend
- [ ] `npm run dev` runs without errors
- [ ] No console errors or warnings
- [ ] All pages load (Home, Login, Dashboard)
- [ ] Weather API calls work
- [ ] Prediction API calls return data
- [ ] Login/logout flow works
- [ ] Mobile responsive

### Database
- [ ] MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- [ ] User credentials are correct
- [ ] Collections created (users, predictions, etc.)
- [ ] Database backup enabled

### Environment
- [ ] All `.env` variables set correctly
- [ ] No secrets in code (only in `.env`)
- [ ] `.gitignore` includes `.env` files
- [ ] `.env` files are NOT committed to GitHub

---

## 🆘 Still Stuck?

1. **Check error message** in browser console (F12)
2. **Copy exact error** and search in this guide
3. **Check API response** in Network tab (F12 → Network)
4. **Verify `.env` files** have correct values
5. **Restart backend**: Kill terminal, run `python app.py` again
6. **Restart frontend**: Kill terminal, run `npm run dev` again
7. **Hard refresh browser**: `Ctrl+Shift+R`
8. **Check internet connection** for weather/MongoDB APIs

---

**Good luck! 🌾**
