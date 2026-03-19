FROM python:3.10-slim

# Install system dependencies for librosa and audio processing
RUN apt-get update && apt-get install -y \
    libsndfile1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Suppress TensorFlow logging to reduce noise and speed up startup
ENV TF_CPP_MIN_LOG_LEVEL=3

# Expose the port FastAPI runs on
EXPOSE 8000

# Use 1 worker to fit in Render's memory and respect the $PORT env var
CMD ["sh", "-c", "gunicorn -w 1 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:${PORT:-8000}"]
