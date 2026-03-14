import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv1D, MaxPooling1D, BatchNormalization

def build_model(input_shape, num_classes):
    model = Sequential([
        Conv1D(256, 5, padding='same', activation='relu', input_shape=input_shape),
        BatchNormalization(),
        MaxPooling1D(pool_size=5, strides=2, padding='same'),
        
        Conv1D(128, 5, padding='same', activation='relu'),
        BatchNormalization(),
        MaxPooling1D(pool_size=5, strides=2, padding='same'),
        Dropout(0.2),
        
        Conv1D(64, 5, padding='same', activation='relu'),
        BatchNormalization(),
        MaxPooling1D(pool_size=5, strides=2, padding='same'),
        
        Flatten(),
        Dense(units=32, activation='relu'),
        Dropout(0.3),
        Dense(units=num_classes, activation='softmax')
    ])
    
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    return model
