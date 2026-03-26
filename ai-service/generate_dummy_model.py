import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Conv1D, MaxPooling1D, Flatten, Dropout

def generate_dummy_model():
    # Model architecture (matching what train.py and build_model expected)
    model = Sequential([
        Conv1D(128, 5, padding='same', activation='relu', input_shape=(162, 1)),
        MaxPooling1D(pool_size=8),
        Dropout(0.2),
        Flatten(),
        Dense(64, activation='relu'),
        Dense(7, activation='softmax')  # 7 emotions
    ])
    
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    
    # Save the untrained model
    model_path = "emotion_model.h5"
    model.save(model_path)
    print(f"Successfully created a dummy {model_path}!")
    print("This model is untrained and will provide random predictions, but it allows the AI service to run in its real code path.")

if __name__ == "__main__":
    generate_dummy_model()
