import tensorflow as tf
import numpy as np

def test_model():
    model_path = "emotion_model.h5"
    try:
        model = tf.keras.models.load_model(model_path)
        print(f"Model {model_path} loaded.")
        
        emotions = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"]
        counts = {e: 0 for e in emotions}
        
        # Test with 50 random inputs
        for _ in range(50):
            dummy_input = np.random.rand(1, 162, 1)
            prediction = model.predict(dummy_input, verbose=0)
            idx = np.argmax(prediction[0])
            counts[emotions[idx]] += 1
            
        print("\nPrediction distribution for 50 random inputs:")
        for e, count in counts.items():
            print(f"{e}: {count}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_model()
