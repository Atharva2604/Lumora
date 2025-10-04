from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints.router import router
from .config import Config
from .models.vision_processor import VisionProcessor
from .models.audio_processor import AudioProcessor
from .models.llm_processor import LLMProcessor
from .services.tts_service import TTSService
from .services.websocket_service import WebSocketService
from fastapi import WebSocket

app = FastAPI(title="AI Accessibility Companion")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize processors
vision_processor = VisionProcessor(Config.YOLO_MODEL, Config.TESSERACT_PATH)
audio_processor = AudioProcessor(Config.WHISPER_MODEL)
llm_processor = LLMProcessor(Config.LLAMA_MODEL_PATH)
tts_service = TTSService()
websocket_service = WebSocketService(vision_processor, audio_processor, llm_processor, tts_service)

app.include_router(router)

# Added test HTTP endpoint
@app.get("/test")
async def test_endpoint():
    return {"message": "Test endpoint is working"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket_service.handle_websocket(websocket)