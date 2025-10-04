from fastapi import APIRouter, UploadFile
from ..models.audio_processor import AudioProcessor
from ..config import Config

router = APIRouter()
audio_processor = AudioProcessor(Config.WHISPER_MODEL)

@router.post("/process")
async def process_audio(file: UploadFile):
    audio_data = await file.read()
    audio_array = np.frombuffer(audio_data, dtype=np.float32)
    text = audio_processor.process_audio(audio_array)
    return {"text": text}