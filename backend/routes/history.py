"""
CropSense — Prediction History routes
POST   /api/history/save
GET    /api/history/
GET    /api/history/stats
DELETE /api/history/<id>
"""

from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
import os, datetime
from routes.auth import token_required

history_bp = Blueprint("history", __name__)

_client = None
def get_db():
    global _client
    if _client is None:
        _client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/cropsense"))
    return _client["cropsense"]

def serialize(doc):
    doc["_id"]        = str(doc["_id"])
    doc["created_at"] = doc["created_at"].isoformat()
    return doc

@history_bp.route("/save", methods=["POST"])
@token_required
def save_prediction():
    data    = request.get_json(silent=True) or {}
    missing = [f for f in ["recommended_crop", "confidence", "inputs"] if f not in data]
    if missing:
        return jsonify({"success": False, "error": f"Missing: {missing}"}), 422

    db  = get_db()
    doc = {
        "user_id":          request.user_id,
        "recommended_crop": data["recommended_crop"],
        "confidence":       data["confidence"],
        "suitability":      data.get("suitability", ""),
        "top_alternatives": data.get("top_alternatives", []),
        "yield_estimate":   data.get("yield_estimate", {}),
        "inputs":           data["inputs"],
        "region":           data.get("region", ""),
        "created_at":       datetime.datetime.utcnow(),
    }
    result = db.predictions.insert_one(doc)
    return jsonify({"success": True, "id": str(result.inserted_id)}), 201

@history_bp.route("/", methods=["GET"])
@token_required
def list_predictions():
    db    = get_db()
    query = {"user_id": request.user_id}
    if request.args.get("crop"):   query["recommended_crop"] = request.args["crop"]
    if request.args.get("region"): query["region"]           = request.args["region"]

    page  = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))
    docs  = db.predictions.find(query).sort("created_at", -1).skip((page-1)*limit).limit(limit)
    total = db.predictions.count_documents(query)

    return jsonify({
        "success":     True,
        "predictions": [serialize(d) for d in docs],
        "total":       total,
        "page":        page,
        "pages":       (total + limit - 1) // limit,
    }), 200

@history_bp.route("/stats", methods=["GET"])
@token_required
def stats():
    db       = get_db()
    pipeline = [
        {"$match":  {"user_id": request.user_id}},
        {"$group":  {"_id": "$recommended_crop", "count": {"$sum": 1}, "avg_confidence": {"$avg": "$confidence"}}},
        {"$sort":   {"count": -1}},
    ]
    results = list(db.predictions.aggregate(pipeline))
    total   = db.predictions.count_documents({"user_id": request.user_id})

    return jsonify({
        "success":           True,
        "total_predictions": total,
        "most_recommended":  results[0]["_id"] if results else None,
        "by_crop": [
            {"crop": r["_id"], "count": r["count"], "avg_confidence": round(r["avg_confidence"], 1)}
            for r in results
        ],
    }), 200

@history_bp.route("/<prediction_id>", methods=["DELETE"])
@token_required
def delete_prediction(prediction_id):
    db     = get_db()
    result = db.predictions.delete_one({
        "_id":     ObjectId(prediction_id),
        "user_id": request.user_id,
    })
    if result.deleted_count == 0:
        return jsonify({"success": False, "error": "Not found"}), 404
    return jsonify({"success": True}), 200