import tensorflow as tf

def convert_to_tflite():
    print("Loading Keras model...")
    model = tf.keras.models.load_model('emotion_model.h5')
    
    print("Converting to TFLite...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    tflite_model = converter.convert()
    
    with open('emotion_model.tflite', 'wb') as f:
        f.write(tflite_model)
        
    print("Successfully saved emotion_model.tflite!")

if __name__ == "__main__":
    convert_to_tflite()
