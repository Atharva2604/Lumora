from fastapi import APIRouter, UploadFile
from ..models.vision_processor import VisionProcessor
from ..config import Config

router = APIRouter()
vision_processor = VisionProcessor(Config.YOLO_MODEL, Config.TESSERACT_PATH)

@router.post("/process")
async def process_image(file: UploadFile):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    result = vision_processor.process_frame(frame)
    return result