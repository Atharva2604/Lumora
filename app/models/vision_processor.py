import cv2
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
from ultralytics import YOLO
import numpy as np

class VisionProcessor:
    def __init__(self, yolo_model_path, tesseract_path):
        self.yolo_model = YOLO(yolo_model_path)
        self.tesseract_path = tesseract_path
        pytesseract.pytesseract.tesseract_cmd = tesseract_path

    def process_frame(self, frame: np.ndarray):
        """Process a single frame for OCR and object detection."""
        # OCR
        text = pytesseract.image_to_string(frame)
        
        # Object Detection
        results = self.yolo_model(frame)
        objects = []
        for result in results:
            for box in result.boxes:
                label = result.names[int(box.cls)]
                confidence = float(box.conf)
                objects.append({"label": label, "confidence": confidence})

        return {"text": text.strip(), "objects": objects}

    def describe_scene(self, text: str, objects: list) -> str:
        """Generate a scene description."""
        description = f"Detected text: {text}\n" if text else "No text detected.\n"
        if objects:
            description += "Detected objects: " + ", ".join(
                [f"{obj['label']} ({obj['confidence']:.2f})" for obj in objects]
            )
        else:
            description += "No objects detected."
        return description
