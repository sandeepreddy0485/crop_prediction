"""
CropSense — Auth routes
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
"""

from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import jwt, bcrypt, os, datetime
from functools import wraps

auth_bp = Blueprint("auth", __name__)

_client = None
def get_db():
    global _client
    if _client is None:
        _client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/cropsense"))
    return _client["cropsense"]

def generate_token(user_id):
    payload = {
        "sub": str(user_id),
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
    }
    return jwt.encode(payload, os.getenv("JWT_SECRET", "dev-secret"), algorithm="HS256")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"success": False, "error": "Token missing"}), 401
        try:
            payload = jwt.decode(
                auth_header.split(" ")[1],
                os.getenv("JWT_SECRET", "dev-secret"),
                algorithms=["HS256"]
            )
            request.user_id = payload["sub"]
        except jwt.ExpiredSignatureError:
            return jsonify({"success": False, "error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"success": False, "error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated

@auth_bp.route("/register", methods=["POST"])
def register():
    data     = request.get_json(silent=True) or {}
    name     = data.get("name", "").strip()
    phone    = data.get("phone", "").strip()
    password = data.get("password", "")

    if not name or not phone or not password:
        return jsonify({"success": False, "error": "name, phone, password required"}), 422

    db = get_db()
    if db.users.find_one({"phone": phone}):
        return jsonify({"success": False, "error": "Phone already registered"}), 409

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    result = db.users.insert_one({
        "name": name, "phone": phone, "password": hashed,
        "created_at": datetime.datetime.utcnow()
    })
    return jsonify({"success": True, "token": generate_token(result.inserted_id), "name": name}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data     = request.get_json(silent=True) or {}
    phone    = data.get("phone", "").strip()
    password = data.get("password", "")

    if not phone or not password:
        return jsonify({"success": False, "error": "phone and password required"}), 422

    db   = get_db()
    user = db.users.find_one({"phone": phone})
    if not user or not bcrypt.checkpw(password.encode(), user["password"]):
        return jsonify({"success": False, "error": "Invalid credentials"}), 401

    return jsonify({"success": True, "token": generate_token(user["_id"]), "name": user["name"]}), 200

@auth_bp.route("/me", methods=["GET"])
@token_required
def me():
    from bson import ObjectId
    db   = get_db()
    user = db.users.find_one({"_id": ObjectId(request.user_id)}, {"password": 0})
    if not user:
        return jsonify({"success": False, "error": "User not found"}), 404
    user["_id"]        = str(user["_id"])
    user["created_at"] = user["created_at"].isoformat()
    return jsonify({"success": True, "user": user}), 200