from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("JWT_SECRET", "dev-secret-change-in-prod")

# Allow all origins in development
CORS(app)

# Register Blueprints
from routes.predict import predict_bp
from routes.auth    import auth_bp
from routes.history import history_bp

app.register_blueprint(predict_bp, url_prefix="/api")
app.register_blueprint(auth_bp,    url_prefix="/api/auth")
app.register_blueprint(history_bp, url_prefix="/api/history")

@app.route("/api/health")
def health():
    return {"status": "ok", "service": "CropSense API"}, 200

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV", "production") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)