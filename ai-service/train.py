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
    
    print(f"Scanning {DATASET_PATH}...")
    for root, dirs, files in os.walk(DATASET_PATH):
        for file in files:
            if file.endswith('.wav'):
                path = os.path.join(root, file)
                try:
                    # Robust parsing for different datasets
                    # 1. RAVDESS (03-01-01-01-01-01-01.wav -> index 2)
                    # 2. CREMA-D (1001_DFA_ANG_XX.wav -> index 2 as string)
                    part = file.split('-') if '-' in file else file.split('_')
                    
                    if len(part) >= 3:
                        emotion_label = str(part[2]).lower()
                        # Map strings to integers if necessary
                        mapping = {'ang': 0, 'dis': 1, 'fea': 2, 'hap': 3, 'neu': 4, 'sad': 5, 'sur': 6}
                        
                        try:
                            emotion = int(emotion_label)
                        except ValueError:
                            # Use slice of the string to match mapping keys
                            emotion = mapping.get(emotion_label[:3], 4) # Default to neutral
                        
                        data, sr = librosa.load(path, duration=2.5, offset=0.6)
                        feature = extract_features(data, sr)
                        features.append(feature)
                        labels.append(emotion)
                    
                except Exception as e:
                    print(f"Skipping {file} due to error: {e}")
                
    return np.array(features), np.array(labels)

def train():
    print("Loading data...")
    X, y = load_data()
    
    if len(X) == 0:
        print("\n" + "="*50)
        print("WARNING: No real data found! Entering MOCK TRAINING mode.")
        print("Generating synthetic data to create a valid model file...")
        print("="*50 + "\n")
        
        # Generate 100 samples of random noise features (162 length)
        X = np.random.rand(100, 162)
        y = np.random.randint(0, 7, 100)
        
        # We need a LabelEncoder that knows about all 7 classes
        lb = LabelEncoder()
        lb.fit(list(range(7)))
        y_encoded = to_categorical(y, num_classes=7)
    else:
        # Encode real labels
        lb = LabelEncoder()
        y_encoded = to_categorical(lb.fit_transform(y))
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)
    
    # Reshape for CNN
    X_train = np.expand_dims(X_train, axis=2)
    X_test = np.expand_dims(X_test, axis=2)
    
    # Build and train
    num_classes = y_encoded.shape[1]
    model = build_model(input_shape=(X_train.shape[1], 1), num_classes=num_classes)
    model.fit(X_train, y_train, batch_size=32, epochs=5, validation_data=(X_test, y_test))
    
    # Save
    model.save("emotion_model.h5")
    print("Model saved to emotion_model.h5")

if __name__ == "__main__":
    # If data exists, train. Otherwise skip.
    if os.path.exists(DATASET_PATH):
        train()
    else:
        print(f"Dataset path {DATASET_PATH} not found. Please provide RAVDESS/CREMA-D data.")
