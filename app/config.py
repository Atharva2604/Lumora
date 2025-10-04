import os

class Config:
    MODEL_WEIGHTS_PATH = os.getenv("MODEL_WEIGHTS_PATH", "/path/to/model/weights")
    LLAMA_MODEL_PATH = "distilgpt2"
    WHISPER_MODEL = "base"  # Whisper model size
    YOLO_MODEL = "/app/model_weights/yolov8n.pt"
    TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    WEBSOCKET_HOST = "0.0.0.0"
    WEBSOCKET_PORT = 8000
