# CropSense 🌾 - AI-Powered Crop Recommendation System

An intelligent, full-stack web application that helps Indian farmers select the best crops for their fields using machine learning, real-time weather data, and soil analysis.

## 🎯 Features

✅ **AI-Powered Recommendations**: Random Forest model with 99.55% accuracy  
✅ **Real-Time Weather Integration**: Auto-fetch temperature & humidity from OpenWeatherMap  
✅ **Soil Analysis**: Auto-fill soil values based on Indian state agricultural data  
✅ **Secure Authentication**: JWT-based login/register with bcrypt password hashing  
✅ **Prediction History**: Save and track crop recommendations over time  
✅ **Dashboard Analytics**: View statistics on predictions and accuracy  
✅ **Seasonal Advice**: Kharif/Rabi/Zaid season recommendations  
✅ **Responsive Design**: Works seamlessly on desktop and mobile

## 🏗️ Project Structure

```
crop_prediction/
├── ml/
│   ├── train_model.py          # ML model training script
│   ├── dataset/crop_data.csv   # Training dataset (Indian agriculture data)
│   ├── crop_model.pkl          # Trained Random Forest model (99.55% accuracy)
│   ├── scaler.pkl              # Data normalization scaler
│   └── label_encoder.pkl       # Crop label encoder
│
├── backend/
│   ├── app.py                  # Flask application entry point
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables (MongoDB, JWT secret)
│   └── routes/
│       ├── predict.py          # POST /api/predict - crop recommendation endpoint
│       ├── auth.py             # User registration, login, JWT tokens
│       └── history.py          # Save/retrieve/delete predictions from MongoDB
│
└── frontend/
    ├── package.json            # React dependencies
    ├── .env                    # Frontend environment variables (Weather API key)
    ├── vite.config.js          # Vite bundler configuration
    ├── tailwind.config.js      # Tailwind CSS configuration
    ├── index.html              # HTML entry point
    └── src/
        ├── main.jsx            # React DOM render
        ├── App.jsx             # Main app component with routing
        ├── index.css           # Tailwind styles
        ├── context/
        │   └── AuthContext.jsx # Global user authentication state
        ├── components/
        │   ├── Navbar.jsx      # Navigation with login/logout
        │   ├── InputForm.jsx   # Weather + soil input with auto-fill
        │   ├── ResultCard.jsx  # Display crop recommendation results
        │   └── SeasonalAdvice.jsx # Show seasonal planting tips
        └── pages/
            ├── Home.jsx        # Landing page with InputForm
            ├── Login.jsx       # Registration & login page
            └── Dashboard.jsx   # View prediction history & stats
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 14+
- MongoDB Atlas account (free tier available)
- OpenWeatherMap API key (free)

### 1. Clone & Setup Backend

```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Create .env file with:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cropsense
JWT_SECRET=your_secret_key_here
FLASK_ENV=development
FRONTEND_URL=http://localhost:3000
```

Start backend:

```bash
python app.py
# Runs on http://127.0.0.1:5000
```

### 2. Setup Frontend

```bash
cd frontend
npm install

# Create .env file with:
VITE_WEATHER_API_KEY=your_openweathermap_api_key

npm run dev
# Runs on http://localhost:5173
```

### 3. Test the App

- Open **http://localhost:5173**
- Enter a city name and click "Get Weather"
- Auto-fill form or enter soil values manually
- Click "Get Recommendation"
- See crop suggestion with confidence score
- Save to history and view dashboard

---

## 📊 Tech Stack

| Layer              | Technology                                    |
| ------------------ | --------------------------------------------- |
| **ML Model**       | Python, Scikit-learn Random Forest            |
| **Backend**        | Flask, PyMongo, PyJWT, bcrypt, Flask-CORS     |
| **Frontend**       | React.js, Vite, Tailwind CSS, Axios, Recharts |
| **Database**       | MongoDB Atlas                                 |
| **Weather API**    | OpenWeatherMap                                |
| **Authentication** | JWT tokens, bcrypt password hashing           |

---

## 📚 API Endpoints

### Prediction

- **POST** `/api/predict` - Get crop recommendation
  ```json
  {
    "N": 250,
    "P": 20,
    "K": 180,
    "temperature": 25,
    "humidity": 60,
    "rainfall": 100,
    "area": 1
  }
  ```

### Authentication

- **POST** `/api/auth/register` - Create new user
- **POST** `/api/auth/login` - Login user, get JWT token
- **GET** `/api/auth/me` - Get current user info (requires token)

### History

- **POST** `/api/history/save` - Save prediction (requires token)
- **GET** `/api/history/` - Get all predictions for user (requires token)
- **GET** `/api/history/stats` - Get prediction statistics (requires token)
- **DELETE** `/api/history/<id>` - Delete prediction (requires token)

---

## 🔑 Environment Variables

### Backend (.env)

```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/cropsense
JWT_SECRET=your_super_secret_key_change_in_production
FLASK_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```
VITE_WEATHER_API_KEY=your_openweathermap_api_key
```

---

## 📈 ML Model Details

- **Algorithm**: Random Forest Classifier
- **Features**: 7 inputs (N, P, K, Temperature, Humidity, Rainfall, Area)
- **Accuracy**: 99.55% on test set
- **Crops Supported**: 22 Indian crops (Rice, Wheat, Corn, Sugarcane, Cotton, Tobacco, Lentil, Barley, Chickpea, Kidney Beans, Pigeon Pea, Mothbeans, Mungbean, Blackgram, Maize, Coconut, Coffee, Jute, Pomegranate, Pulses, Chick Pea, Tur)

### Training Data

- **Dataset**: Indian agriculture crops dataset
- **Size**: 2,200+ samples
- **Features**: Normalized N-P-K values, regional weather patterns, rainfall data
- **Target**: Crop type (22 classes)

---

## 🌱 How It Works

### 1. **Auto-Fill Weather**

- User enters city name
- Calls OpenWeatherMap API
- Fetches real-time temp, humidity, rainfall
- Auto-fills in form

### 2. **Soil Data**

- System pre-loads average soil values for Indian states
- User selects state → soil N-P-K values appear automatically
- Can override manually if needed

### 3. **ML Prediction**

- All 7 features sent to backend
- Random Forest model processes
- Returns: crop + confidence + yield estimate + alternatives

### 4. **Save & Track**

- User can save prediction to MongoDB
- Dashboard shows history with analytics
- Track prediction accuracy over time

---

## 🔐 Security

- ✅ Passwords hashed with bcrypt (never stored plain text)
- ✅ JWT tokens for API authentication
- ✅ CORS configured (only frontend allowed)
- ✅ Environment variables for secrets (MONGO_URI, JWT_SECRET)
- ✅ Input validation on both frontend & backend
- ✅ MongoDB Atlas encryption

---

## 📱 Responsive Design

- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)
- ✅ Tested on iPhone, iPad, Android devices

---

## 🚀 Deployment

### Frontend → Vercel

```bash
# 1. Push to GitHub
# 2. Connect GitHub to Vercel
# 3. Add env var: VITE_WEATHER_API_KEY
# 4. Auto-deploys on push
```

### Backend → Render

```bash
# 1. Push to GitHub
# 2. Connect GitHub to Render
# 3. Add env vars: MONGO_URI, JWT_SECRET
# 4. Set start command: python app.py
# 5. Auto-deploys on push
```

---

## 📋 Testing Guide

See **TESTING_GUIDE.md** for comprehensive testing procedures:

- Weather API testing
- Authentication flow
- Prediction accuracy
- History tracking
- Error handling
- Mobile responsiveness
- API endpoint testing

---

## 🤝 Contributing

Feel free to:

- Add more crops to the ML model
- Improve recommendation accuracy
- Add regional language support (Hindi, Telugu, etc.)
- Integrate with other weather APIs
- Add IoT sensor integration for real soil data

---

## 📄 License

MIT License - feel free to use for educational or commercial purposes.

---

## 👨‍🌾 For Indian Farmers

This app is designed with Indian farmers in mind:

- ✅ Supports all major Indian states
- ✅ Uses Indian agricultural data
- ✅ Shows prices in Indian Rupees (₹)
- ✅ Regional crop suitability
- ✅ Seasonal planting advice (Kharif, Rabi, Zaid)
- ✅ Accessible design for low literacy

---

## 📞 Support

For issues, feature requests, or questions:

1. Check **TESTING_GUIDE.md** for common issues
2. Review error messages in browser console
3. Verify MongoDB Atlas connection
4. Check weather API key is valid
5. Ensure backend & frontend are running

---

**Built with ❤️ for Indian Agriculture**

---

_Last Updated: 2024_
