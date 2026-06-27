"""
CropSense — ML Model Training Script
"""

import pandas as pd
import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report

# ── Paths ─────────────────────────────────────────────────────────────────────
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
DATA_PATH   = os.path.join(BASE_DIR, "dataset", "crop_data.csv")
MODEL_PATH  = os.path.join(BASE_DIR, "crop_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")
LE_PATH     = os.path.join(BASE_DIR, "label_encoder.pkl")

# ── Load Data ─────────────────────────────────────────────────────────────────
print("=" * 60)
print("CropSense ML Training Pipeline")
print("=" * 60)

df = pd.read_csv(DATA_PATH)
print(f"\n✅ Dataset loaded: {df.shape[0]} rows × {df.shape[1]} columns")
print(f"   Crops: {sorted(df['label'].unique())}")

# ── Features & Labels ─────────────────────────────────────────────────────────
FEATURE_COLS = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
X     = df[FEATURE_COLS].values
le    = LabelEncoder()
y     = le.fit_transform(df["label"].values)

print(f"   Classes: {list(le.classes_)}")

# ── Train/Test Split ──────────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ── Scaling ───────────────────────────────────────────────────────────────────
scaler     = StandardScaler()
X_train_s  = scaler.fit_transform(X_train)
X_test_s   = scaler.transform(X_test)

# ── Train 3 Models ────────────────────────────────────────────────────────────
print("\nTraining models...")

models = {
    "Random Forest": RandomForestClassifier(
        n_estimators=200, random_state=42, n_jobs=-1
    ),
    "SVM": SVC(
        kernel="rbf", C=10, gamma="scale",
        probability=True, random_state=42
    ),
    "Naive Bayes": GaussianNB()
}

results = {}
for name, model in models.items():
    model.fit(X_train_s, y_train)
    acc = accuracy_score(y_test, model.predict(X_test_s))
    results[name] = {"model": model, "acc": acc}
    print(f"  {name:20s} → Test Accuracy: {acc*100:.2f}%")

# ── Save Best Model ───────────────────────────────────────────────────────────
best_name  = max(results, key=lambda k: results[k]["acc"])
best_model = results[best_name]["model"]
print(f"\n🏆 Best: {best_name} ({results[best_name]['acc']*100:.2f}%)")

joblib.dump(best_model, MODEL_PATH)
joblib.dump(scaler,     SCALER_PATH)
joblib.dump(le,         LE_PATH)
print(f"✅ Saved: crop_model.pkl, scaler.pkl, label_encoder.pkl")

# ── Sanity Check ──────────────────────────────────────────────────────────────
sample = np.array([[90, 42, 43, 21.0, 82.0, 6.5, 202.0]])
scaled = scaler.transform(sample)
pred   = le.inverse_transform(best_model.predict(scaled))[0]
proba  = best_model.predict_proba(scaled)[0]
top3   = np.argsort(proba)[::-1][:3]

print(f"\n🌾 Sample prediction: {pred} ({proba[top3[0]]*100:.1f}% confidence)")
print(f"   Top 3: {[(le.classes_[i], round(proba[i]*100,1)) for i in top3]}")
print("\n🎉 Training complete!")