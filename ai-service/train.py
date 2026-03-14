import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.utils import to_categorical
from model import build_model
from utils import extract_features
import librosa

# Placeholder for dataset path
DATASET_PATH = "data/"

def load_data():
    features = []
    labels = []
    
    # This logic expects a folder structure where subdirectories are labels
    # or file names contain label codes (like RAVDESS)
    for root, dirs, files in os.walk(DATASET_PATH):
        for file in files:
            if file.endswith('.wav'):
                path = os.path.join(root, file)
                # Example RAVDESS parsing: 03-01-01-01-01-01-01.wav
                # Third part is the emotion
                part = file.split('-')
                emotion = int(part[2])
                
                data, sr = librosa.load(path, duration=2.5, offset=0.6)
                feature = extract_features(data, sr)
                features.append(feature)
                labels.append(emotion)
                
    return np.array(features), np.array(labels)

def train():
    print("Loading data...")
    X, y = load_data()
    
    # Encode labels
    lb = LabelEncoder()
    y = to_categorical(lb.fit_transform(y))
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Reshape for CNN
    X_train = np.expand_dims(X_train, axis=2)
    X_test = np.expand_dims(X_test, axis=2)
    
    # Build and train
    model = build_model(input_shape=(X_train.shape[1], 1), num_classes=len(lb.classes_))
    model.fit(X_train, y_train, batch_size=32, epochs=50, validation_data=(X_test, y_test))
    
    # Save
    model.save("emotion_model.h5")
    print("Model saved to emotion_model.h5")

if __name__ == "__main__":
    # If data exists, train. Otherwise skip.
    if os.path.exists(DATASET_PATH):
        train()
    else:
        print(f"Dataset path {DATASET_PATH} not found. Please provide RAVDESS/CREMA-D data.")
