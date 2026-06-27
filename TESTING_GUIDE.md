# CropSense - Complete Testing & Deployment Guide

## 🚀 Quick Start: Run Locally

### Terminal 1: Start Flask Backend
```powershell
cd C:\Users\yaram\Desktop\crop_prediction\backend
.\venv\Scripts\Activate.ps1
python app.py
```
✅ Should see: `Running on http://127.0.0.1:5000`

### Terminal 2: Start React Frontend  
```powershell
cd C:\Users\yaram\Desktop\crop_prediction\frontend
npm run dev
```
✅ Should see: `Local: http://localhost:5173`

---

## 📋 Phase 1: Weather Auto-fill Testing

### Test 1.1: Get Weather Only
1. Open **http://localhost:5173** in browser
2. You should see **InputForm** component with:
   - Blue "Weather" box on top
   - "Get Weather" button (light blue)
   - "Auto-Fill All" button (green)
3. **Type city name**: `Hyderabad`
4. **Click "Get Weather"** button
5. ✅ Expected: Temperature and Humidity auto-fill
   - Example: `28.5°C`, `65%`
   - Message shows: `✅ Fetched weather for Hyderabad!`

### Test 1.2: Auto-Fill Everything
1. Keep city as: `Hyderabad`
2. **Keep region as**: `Telangana` (or any state)
3. **Click "Auto-Fill All"** button (green)
4. ✅ Expected: All fields auto-filled:
   - Weather (temp, humidity, rainfall)
   - Soil values (N, P, K, pH) from Telangana defaults
   - Message shows: `✅ Auto-filled for Hyderabad!`

### Test 1.3: Error Handling
**Test 1.3a: Empty city**
- Leave city empty
- Click "Get Weather"
- ✅ Expected: `⚠️ Please enter your city name.`

**Test 1.3b: Invalid city**
- Type: `XyzInvalidCity999`
- Click "Get Weather"
- ✅ Expected: `❌ Village/city not found. Try nearest town or district name.`

**Test 1.3c: Invalid API key (simulate)**
- To test: Go to frontend `.env`, change `VITE_WEATHER_API_KEY=invalid`
- Click "Get Weather"
- ✅ Expected: `❌ Weather API key invalid. Check frontend .env file.`
- Then restore the correct key

---

## 🔐 Phase 2: Authentication Testing

### Test 2.1: Register New User
1. Click **"Login/Register"** link in Navbar (top right)
2. You're on **Login page**
3. **Look for**: "Don't have an account? Register here" link
4. **Click Register link**
5. Fill form:
   - Name: `Raj Farmer`
   - Email: `raj@example.com` (use unique email each test)
   - Password: `Password123`
   - Confirm: `Password123`
6. Click **"Register"** button
7. ✅ Expected:
   - Message: `✅ Registration successful! Redirecting...`
   - Redirected to Home page
   - Navbar now shows: `"Hi Raj, Logout"` (not "Login")

### Test 2.2: Login with Existing User
1. Click **"Logout"** in Navbar
2. Click **"Login"** (Navbar)
3. Fill form:
   - Email: `raj@example.com`
   - Password: `Password123`
4. Click **"Login"** button
5. ✅ Expected:
   - Redirected to Home page
   - Navbar shows: `"Hi Raj, Logout"`
   - localStorage has JWT token (check DevTools → Application → Local Storage)

### Test 2.3: Invalid Login
1. Click **"Logout"**
2. Click **"Login"**
3. Fill form:
   - Email: `wrong@example.com`
   - Password: `WrongPass`
4. Click **"Login"** button
5. ✅ Expected: `❌ Invalid credentials. Please try again.`

### Test 2.4: Logout
1. Click **"Logout"** in Navbar
2. ✅ Expected:
   - Redirected to Home page
   - Navbar shows: `"Login"` (not "Hi Raj")
   - localStorage cleared (DevTools → Application → Local Storage is empty)

---

## 🌾 Phase 3: Prediction & Save to History

### Test 3.1: Make a Prediction
1. **Login** as user (from Test 2.1 or 2.2)
2. On **Home page**, click **InputForm**
3. **Option A**: Use Auto-Fill
   - Enter city: `Bangalore`
   - Select region: `Karnataka`
   - Click "Auto-Fill All"
   - All fields fill automatically
4. **Option B**: Manual Entry
   - Enter all values manually:
     - Nitrogen (N): 250
     - Phosphorus (P): 20
     - Potassium (K): 180
     - pH: 7.0
     - Temperature: 25
     - Humidity: 60
     - Rainfall: 100
     - Area (hectares): 1
5. Click **"Get Recommendation"** button
6. ✅ Expected: **ResultCard** appears showing:
   - Recommended crop (e.g., "Rice") with **color indicator**:
     - 🟢 Green: Highly suitable (confidence > 80%)
     - 🟡 Yellow: Moderately suitable (60-80%)
     - 🔴 Red: Less suitable (< 60%)
   - Confidence score (e.g., "95.2%")
   - Yield estimate (e.g., "5.2 tons/ha")
   - Price range (e.g., "₹2,500 - ₹3,200 per quintal")
   - **Top 3 alternatives** (other recommended crops)
   - **Seasonal advice** (Kharif/Rabi/Zaid best season)
   - **"Save to History"** button

### Test 3.2: Save Prediction to History
1. From **ResultCard** (Test 3.1 completed)
2. Click **"Save to History"** button
3. ✅ Expected:
   - Message: `✅ Prediction saved to history!`
   - Prediction stored in **MongoDB Atlas** database

### Test 3.3: View History Dashboard
1. Click **"Dashboard"** link in Navbar
2. ✅ Expected: **Dashboard page** shows:
   - List of all saved predictions
   - Each prediction shows:
     - Crop name
     - Confidence
     - Soil conditions (N, P, K)
     - Weather conditions (Temp, Humidity)
     - Date saved
     - **Delete button** for each prediction

### Test 3.4: Delete Prediction
1. On **Dashboard page** (from Test 3.3)
2. Click **"Delete"** button on any prediction
3. ✅ Expected:
   - Message: `✅ Prediction deleted!`
   - Prediction removed from list
   - Deleted from MongoDB

### Test 3.5: Dashboard Stats
1. On **Dashboard page**
2. Scroll to **"Your Statistics"** section
3. ✅ Expected: Shows:
   - Total predictions made
   - Accuracy (how many matched expected crop)
   - Most predicted crop
   - Average confidence

---

## 🔍 Phase 4: Edge Cases & Error Handling

### Test 4.1: Empty Form Submit
1. **Home page** → InputForm
2. Leave all fields empty
3. Click **"Get Recommendation"**
4. ✅ Expected: `❌ Please fill all fields correctly`

### Test 4.2: Invalid Values
1. **Home page** → InputForm
2. Try entering:
   - **Negative values**: `-10` for N → should reject
   - **Non-numeric**: `abc` for temperature → should show error
   - **pH out of range**: `15` (valid range 3-10) → should warn
3. ✅ Expected: Form validation prevents submission with error message

### Test 4.3: No Internet Connection (Simulate)
1. Disable WiFi/Ethernet
2. Click "Get Weather"
3. ✅ Expected: `❌ Could not fetch data. Check your internet connection.`
4. Re-enable internet

### Test 4.4: Concurrent Requests (Stress Test)
1. **Home page** → InputForm
2. Fill form with Auto-Fill
3. Click **"Get Recommendation"** button **multiple times quickly**
4. ✅ Expected: No duplicate submissions, clean result displayed

### Test 4.5: Mobile Responsiveness
1. Open **http://localhost:5173**
2. Press **F12** → DevTools
3. Click **device toggle** (phone icon)
4. Select **iPhone 12** or any mobile
5. ✅ Expected: 
   - Layout responsive (no overflow)
   - Buttons clickable
   - Form usable on small screens
   - Navbar collapses to hamburger menu

---

## 🌐 Phase 5: API Testing (PowerShell)

### Test 5.1: Health Check
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/health" -Method GET
```
✅ Expected: `{"status": "ok", "service": "CropSense API"}`

### Test 5.2: Prediction API
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

$response = Invoke-WebRequest `
  -Uri "http://127.0.0.1:5000/api/predict" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

$response.Content | ConvertFrom-Json | Format-Table
```
✅ Expected: Returns `{crop, confidence, yield_estimate, price_range, alternatives}`

### Test 5.3: Register User
```powershell
$body = @{
    name = "Test Farmer"
    email = "testfarmer@example.com"
    password = "TestPass123"
} | ConvertTo-Json

$response = Invoke-WebRequest `
  -Uri "http://127.0.0.1:5000/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

$response.Content | ConvertFrom-Json | Format-Table
```
✅ Expected: Returns `{message, token, user: {_id, name, email}}`

### Test 5.4: Login User
```powershell
$body = @{
    email = "testfarmer@example.com"
    password = "TestPass123"
} | ConvertTo-Json

$response = Invoke-WebRequest `
  -Uri "http://127.0.0.1:5000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

$response.Content | ConvertFrom-Json | Format-Table
```
✅ Expected: Returns `{message, token, user: {_id, name, email}}`

---

## ✅ Testing Checklist

| Test | Status | Date |
|------|--------|------|
| Weather API key configured | ⬜ | |
| Get Weather (city) | ⬜ | |
| Auto-Fill All (city + state) | ⬜ | |
| Register new user | ⬜ | |
| Login with credentials | ⬜ | |
| Invalid login (error) | ⬜ | |
| Logout | ⬜ | |
| Make prediction | ⬜ | |
| Save to History | ⬜ | |
| View Dashboard | ⬜ | |
| Delete prediction | ⬜ | |
| Dashboard stats | ⬜ | |
| Mobile responsive | ⬜ | |
| API health check | ⬜ | |
| All CORS headers working | ⬜ | |

---

## 🚀 Deployment (After All Tests Pass)

### Step 1: Deploy Frontend to Vercel
```bash
# Prerequisites:
# 1. Push code to GitHub
# 2. Go to vercel.com, sign in with GitHub
# 3. Import project
# 4. Add Environment Variable:
#    VITE_WEATHER_API_KEY = dc7f5f9999a016ab1055b4d3f6874ad6
# 5. Deploy
```

**After deployment, you get a Vercel URL** (e.g., `https://cropsense.vercel.app`)

### Step 2: Deploy Backend to Render
```bash
# Prerequisites:
# 1. Push code to GitHub
# 2. Go to render.com, sign in with GitHub
# 3. Create new Web Service
# 4. Select GitHub repo
# 5. Add Environment Variables:
#    MONGO_URI = mongodb+srv://...
#    JWT_SECRET = cropsense_super_secret_key_2024_xyz789abc
#    FLASK_ENV = production
#    FRONTEND_URL = https://cropsense.vercel.app
# 6. Deploy
```

**After deployment, you get a Render URL** (e.g., `https://cropsense-backend.onrender.com`)

### Step 3: Update Frontend to Use Deployed Backend
After backend is deployed, update frontend:
```javascript
// frontend/src/components/InputForm.jsx
// Change line 5:
// const API = "http://127.0.0.1:5000/api"  // OLD
const API = "https://cropsense-backend.onrender.com/api"  // NEW
```

Same for all components using API.

Then re-deploy frontend to Vercel.

### Step 4: Verify Deployed App
- Visit `https://cropsense.vercel.app`
- Test weather auto-fill → should connect to deployed backend
- Test login/register → should save to MongoDB Atlas
- Test prediction → should work end-to-end

---

## 📝 Notes
- **JWT tokens** are stored in `localStorage` (client-side)
- **MongoDB** stores user accounts and prediction history
- **Weather API** fetches real-time data from OpenWeatherMap
- **CORS** configured to allow frontend ↔ backend communication
- **Email validation** in register/login (server-side)
- **Password hashing** using `bcrypt` (never stored as plain text)

---

## 🎯 Success Criteria
✅ All tests pass locally  
✅ No console errors  
✅ No CORS issues  
✅ All API responses correct  
✅ Database operations work  
✅ Responsive on mobile  

Then → Ready to deploy! 🚀
