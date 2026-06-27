"""
CropSense — POST /api/predict
"""

from flask import Blueprint, request, jsonify
import numpy as np
import joblib
import os

predict_bp = Blueprint("predict", __name__)

# Load ML files once at startup
ML_DIR      = os.path.join(os.path.dirname(__file__), "..", "..", "ml")
MODEL_PATH  = os.path.join(ML_DIR, "crop_model.pkl")
SCALER_PATH = os.path.join(ML_DIR, "scaler.pkl")
LE_PATH     = os.path.join(ML_DIR, "label_encoder.pkl")

try:
    model  = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    le     = joblib.load(LE_PATH)
    print("✅ ML model loaded")
except FileNotFoundError:
    print("⚠️  Run ml/train_model.py first!")
    model = scaler = le = None

# Yield & price data per crop
CROP_DATA = {
    "rice":        {"yield_qa": 14,  "price": "₹1,800–₹2,200 per quintal"},
    "maize":       {"yield_qa": 20,  "price": "₹1,500–₹1,900 per quintal"},
    "chickpea":    {"yield_qa": 8,   "price": "₹4,500–₹5,500 per quintal"},
    "kidneybeans": {"yield_qa": 9,   "price": "₹5,000–₹6,000 per quintal"},
    "pigeonpeas":  {"yield_qa": 7,   "price": "₹5,500–₹6,500 per quintal"},
    "mothbeans":   {"yield_qa": 6,   "price": "₹4,000–₹5,000 per quintal"},
    "mungbean":    {"yield_qa": 6,   "price": "₹6,000–₹7,500 per quintal"},
    "blackgram":   {"yield_qa": 6,   "price": "₹5,000–₹6,000 per quintal"},
    "lentil":      {"yield_qa": 8,   "price": "₹4,500–₹5,500 per quintal"},
    "pomegranate": {"yield_qa": 60,  "price": "₹40–₹80 per kg"},
    "banana":      {"yield_qa": 250, "price": "₹15–₹35 per kg"},
    "mango":       {"yield_qa": 50,  "price": "₹30–₹80 per kg"},
    "grapes":      {"yield_qa": 120, "price": "₹30–₹70 per kg"},
    "watermelon":  {"yield_qa": 200, "price": "₹8–₹20 per kg"},
    "muskmelon":   {"yield_qa": 150, "price": "₹10–₹25 per kg"},
    "apple":       {"yield_qa": 80,  "price": "₹40–₹100 per kg"},
    "orange":      {"yield_qa": 100, "price": "₹20–₹50 per kg"},
    "papaya":      {"yield_qa": 300, "price": "₹8–₹20 per kg"},
    "coconut":     {"yield_qa": 40,  "price": "₹15–₹30 per nut"},
    "cotton":      {"yield_qa": 12,  "price": "₹5,500–₹7,000 per quintal"},
    "jute":        {"yield_qa": 25,  "price": "₹3,500–₹4,500 per quintal"},
    "coffee":      {"yield_qa": 8,   "price": "₹180–₹300 per kg"},
}

# Seasonal suitability for crops (Kharif: Jun-Oct, Rabi: Oct-Feb, Zaid: Feb-Jun)
CROP_SEASONAL_MAP = {
    "rice":        {"kharif": True,  "rabi": False, "zaid": False},
    "wheat":       {"kharif": False, "rabi": True,  "zaid": False},
    "maize":       {"kharif": True,  "rabi": False, "zaid": True},
    "chickpea":    {"kharif": False, "rabi": True,  "zaid": False},
    "lentil":      {"kharif": False, "rabi": True,  "zaid": False},
    "mungbean":    {"kharif": True,  "rabi": False, "zaid": True},
    "blackgram":   {"kharif": True,  "rabi": False, "zaid": False},
    "cotton":      {"kharif": True,  "rabi": False, "zaid": False},
    "sugarcane":   {"kharif": True,  "rabi": True,  "zaid": True},
    "groundnut":   {"kharif": True,  "rabi": False, "zaid": False},
    "soybean":     {"kharif": True,  "rabi": False, "zaid": False},
    "mustard":     {"kharif": False, "rabi": True,  "zaid": False},
    "kidneybeans": {"kharif": True,  "rabi": False, "zaid": False},
    "pigeonpeas":  {"kharif": True,  "rabi": False, "zaid": False},
    "mothbeans":   {"kharif": True,  "rabi": False, "zaid": False},
    "jute":        {"kharif": True,  "rabi": False, "zaid": False},
    "mango":       {"kharif": False, "rabi": False, "zaid": True},
    "banana":      {"kharif": True,  "rabi": True,  "zaid": True},
    "papaya":      {"kharif": True,  "rabi": True,  "zaid": True},
    "coconut":     {"kharif": False, "rabi": False, "zaid": True},
    "grapes":      {"kharif": False, "rabi": True,  "zaid": False},
    "apple":       {"kharif": False, "rabi": False, "zaid": True},
    "orange":      {"kharif": False, "rabi": True,  "zaid": False},
    "pomegranate": {"kharif": False, "rabi": True,  "zaid": False},
    "watermelon":  {"kharif": False, "rabi": False, "zaid": True},
    "muskmelon":   {"kharif": False, "rabi": False, "zaid": True},
    "coffee":      {"kharif": False, "rabi": True,  "zaid": False},
}

FEATURE_COLS = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]

# Regional crop suitability mapping - filters unsuitable crops
CROP_REGION_MAP = {
    "Andhra Pradesh":   ["rice", "maize", "cotton", "sugarcane", "chickpea", "mango", "pomegranate"],
    "Assam":            ["rice", "mungbean", "tea", "banana", "papaya", "maize"],
    "Bihar":            ["rice", "wheat", "maize", "chickpea", "lentil"],
    "Chhattisgarh":     ["rice", "maize", "cotton", "sugarcane", "chickpea"],
    "Gujarat":          ["cotton", "groundnut", "maize", "sugarcane", "mango"],
    "Haryana":          ["wheat", "rice", "maize", "chickpea"],
    "Himachal Pradesh": ["apple", "orange", "grapes", "maize", "wheat"],
    "Jharkhand":        ["rice", "maize", "chickpea", "mungbean"],
    "Karnataka":        ["rice", "maize", "sugarcane", "cotton", "mango", "coffee"],
    "Kerala":           ["coconut", "banana", "papaya", "rice", "pepper"],
    "Madhya Pradesh":   ["wheat", "chickpea", "soybean", "maize", "cotton"],
    "Maharashtra":      ["sugarcane", "cotton", "mango", "orange", "grapes"],
    "Manipur":          ["rice", "mungbean", "maize"],
    "Meghalaya":        ["rice", "mungbean", "banana", "papaya"],
    "Mizoram":          ["rice", "mungbean", "maize"],
    "Nagaland":         ["rice", "maize", "mungbean"],
    "Odisha":           ["rice", "maize", "mungbean", "cotton"],
    "Punjab":           ["wheat", "rice", "cotton", "maize"],
    "Rajasthan":        ["groundnut", "maize", "cotton", "mustard"],
    "Sikkim":           ["cardamom", "ginger", "turmeric", "mango"],
    "Tamil Nadu":       ["rice", "sugarcane", "mango", "banana", "orange"],
    "Telangana":        ["rice", "maize", "cotton", "sugarcane", "chickpea", "groundnut"],
    "Tripura":          ["rice", "mungbean", "rubber", "banana"],
    "Uttar Pradesh":    ["wheat", "rice", "sugarcane", "maize", "chickpea"],
    "Uttarakhand":      ["apple", "mandarin", "mango", "wheat", "rice"],
    "West Bengal":      ["rice", "mungbean", "maize", "lentil"],
}

def get_suitability(confidence):
    if confidence >= 70: return "high"
    elif confidence >= 40: return "moderate"
    else: return "low"

def filter_crops_by_region(region, crops_with_confidence):
    """Filter crops to only those suitable for the region"""
    suitable = CROP_REGION_MAP.get(region, [])
    if not suitable:
        return crops_with_confidence
    
    # Only keep crops that are in the regional suitable list
    filtered = [c for c in crops_with_confidence if c["crop"].lower() in [s.lower() for s in suitable]]
    
    # If all crops filtered out, return original (fallback)
    return filtered if filtered else crops_with_confidence

def estimate_yield(crop, area):
    info = CROP_DATA.get(crop.lower(), {"yield_qa": 10, "price": "N/A"})
    return {
        "quintals": round(info["yield_qa"] * area, 1),
        "price_range": info["price"]
    }

@predict_bp.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"success": False, "error": "Model not loaded"}), 503

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"success": False, "error": "No JSON body"}), 400

    missing = [f for f in FEATURE_COLS if f not in data]
    if missing:
        return jsonify({"success": False, "error": f"Missing: {missing}"}), 422

    try:
        features = np.array([[float(data[f]) for f in FEATURE_COLS]])
    except (ValueError, TypeError) as e:
        return jsonify({"success": False, "error": str(e)}), 422

    scaled     = scaler.transform(features)
    pred_int   = model.predict(scaled)[0]
    proba      = model.predict_proba(scaled)[0]
    top4_idx   = np.argsort(proba)[::-1][:4]

    # Get region for filtering
    region = data.get("region", "")
    
    # DEBUG: Log what we receive
    print(f"[PREDICT] region='{region}', top4_idx={list(top4_idx)}")
    
    # Build list of all top crops with confidence
    all_crops = [
        {"crop": le.classes_[i], "confidence": round(float(proba[i])*100, 2), "idx": i}
        for i in top4_idx
    ]
    
    print(f"  All top crops: {[c['crop'] for c in all_crops]}")
    
    # Filter by region to get regionally suitable crops
    suitable_crops = filter_crops_by_region(region, all_crops)
    
    print(f"  Suitable crops after filter: {[c['crop'] for c in suitable_crops]}")
    print(f"  CROP_REGION_MAP[{region}] = {CROP_REGION_MAP.get(region, 'NOT FOUND')}")
    
    # If we have filtered crops, use the best one; otherwise use model's top pick
    if suitable_crops:
        recommended_data = suitable_crops[0]
        recommended = recommended_data["crop"]
        confidence = recommended_data["confidence"]
    else:
        recommended = le.classes_[top4_idx[0]]
        confidence = round(float(proba[top4_idx[0]]) * 100, 2)
    
    print(f"  Final recommendation: {recommended} ({confidence}%)\n")
    
    area = float(data.get("area", 1.0))
    
    # Get filtered alternatives
    alternatives = suitable_crops[1:4] if len(suitable_crops) > 1 else []
    
    # Get seasonal advice for recommended crop
    seasonal_advice = CROP_SEASONAL_MAP.get(recommended.lower(), {"kharif": False, "rabi": False, "zaid": False})

    return jsonify({
        "success": True,
        "recommended_crop": recommended,
        "confidence": confidence,
        "suitability": get_suitability(confidence),
        "top_alternatives": [
            {"crop": c["crop"], "confidence": c["confidence"]}
            for c in alternatives
        ],
        "yield_estimate": estimate_yield(recommended, area),
        "seasonal_advice": seasonal_advice,
        "inputs": {f: data[f] for f in FEATURE_COLS},
        "region": region,
    }), 200