import librosa
import sys

path = sys.argv[1]
try:
    print(f"Loading {path}...")
    data, sr = librosa.load(path, duration=2.5, offset=0.6)
    print("Success: shape:", data.shape)
except Exception as e:
    print("Error:", e)
