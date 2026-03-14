import os
import uvicorn
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil

# Optional heavy imports — handle missing packages gracefully so the service
# can run in mock mode when dependencies like tensorflow or librosa are
# not installed in the environment.
try:
    import tensorflow as tf
except Exception:
    tf = None

try:
    import librosa
except Exception:
    librosa = None

app = FastAPI(title="Mental Wellness AI Emotion Detection")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load pre-trained model (assuming it exists or will be trained)
MODEL_PATH = "emotion_model.h5"
model = None


@app.on_event("startup")
async def load_model():
    global model
    if tf is None:
        print("TensorFlow not available — running in MOCK mode.")
        return

    if os.path.exists(MODEL_PATH):
        try:
            model = tf.keras.models.load_model(MODEL_PATH)
            print("Model loaded successfully.")
        except Exception as e:
            print(f"Error loading model: {e}")
            print("System will run in MOCK mode for now.")
    else:
        print("Model file not found. System will run in MOCK mode for now.")

EMOTIONS = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"]


def compute_stress_score(features: dict) -> int:
    """Compute a simple stress score (0-100) from extracted audio features.
    Uses MFCC variance, pitch (f0), energy (rms), zero crossing rate and spectral contrast.
    This is a heuristic mapping for production-ready integration with a trained model later.
    """
    try:
        mfcc_var = float(features.get('mfcc_var', 0))
        pitch = float(features.get('pitch', 0))
        energy = float(features.get('energy', 0))
        zcr = float(features.get('zcr', 0))
        spec_contrast = float(features.get('spec_contrast', 0))

        # Normalize heuristically
        score = 0.0
        score += min(max((mfcc_var / 50.0) * 30.0, 0), 30)    # MFCC variance weight
        score += min(max(((pitch - 100) / 200.0) * 25.0, 0), 25) # higher pitch correlates sometimes
        score += min(max((energy / 0.1) * 20.0, 0), 20)        # energy weight
        score += min(max((zcr / 0.1) * 15.0, 0), 15)           # zcr weight
        score += min(max((spec_contrast / 20.0) * 10.0, 0), 10)

        final = int(min(max(score, 0), 100))
        return final
    except Exception:
        return 0


def extract_audio_features_file(path: str) -> dict:
    # If librosa is not available, return mock features
    if librosa is None:
        import random
        return {
            'mfcc_var': random.uniform(0, 10),
            'pitch': random.uniform(80, 220),
            'energy': random.uniform(0.01, 0.2),
            'zcr': random.uniform(0.01, 0.2),
            'spec_contrast': random.uniform(5, 30)
        }

    # Load short segment
    data, sr = librosa.load(path, duration=3.0, offset=0.5)

    # MFCC variance
    mfcc = librosa.feature.mfcc(y=data, sr=sr, n_mfcc=13)
    mfcc_var = float(np.var(mfcc))

    # Pitch estimate using piptrack
    pitches, magnitudes = librosa.piptrack(y=data, sr=sr)
    pitch_vals = pitches[magnitudes > np.median(magnitudes)]
    pitch = float(np.mean(pitch_vals)) if pitch_vals.size > 0 else 0.0

    # Energy (RMS)
    rms = float(np.mean(librosa.feature.rms(y=data)))

    # Zero crossing rate
    zcr = float(np.mean(librosa.feature.zero_crossing_rate(y=data)))

    # Spectral contrast
    spec_contrast = float(np.mean(librosa.feature.spectral_contrast(y=data, sr=sr)))

    return {
        'mfcc_var': mfcc_var,
        'pitch': pitch,
        'energy': rms,
        'zcr': zcr,
        'spec_contrast': spec_contrast
    }

@app.post("/predict-emotion")
async def predict_emotion(file: UploadFile = File(...)):
    # Save uploaded file temporarily
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # If the model isn't loaded or required audio libraries aren't
        # available, return a mock prediction so the service remains usable.
        if model is None or librosa is None:
            import random
            temp_features = extract_audio_features_file(temp_path)
            stressScore = compute_stress_score(temp_features)
            return {"emotion": random.choice(EMOTIONS), "confidence": 0.85, "mode": "mock", "stressScore": stressScore, "audioFeatures": temp_features}
        # Load audio and extract features
        from utils import extract_features
        data, sr = librosa.load(temp_path, duration=2.5, offset=0.6)
        features = extract_features(data, sr)
        # Compute additional audio feature summary for stress scoring
        audio_summary = extract_audio_features_file(temp_path)
        stressScore = compute_stress_score(audio_summary)
        
        # Predict
        predictions = model.predict(features)
        index = np.argmax(predictions)
        emotion = EMOTIONS[index]
        confidence = float(predictions[0][index])
        
        return {"emotion": emotion, "confidence": confidence, "mode": "ai", "stressScore": stressScore, "audioFeatures": audio_summary}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

if __name__ == "__main__":
    # Default to port 8000 to align with docker-compose and local dev tooling.
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
