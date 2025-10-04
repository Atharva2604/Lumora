from fastapi import WebSocket
from ..models.vision_processor import VisionProcessor
from ..models.audio_processor import AudioProcessor
from ..models.llm_processor import LLMProcessor
from .tts_service import TTSService
import cv2
import numpy as np
import base64
import json

class WebSocketService:
    def __init__(self, vision_processor: VisionProcessor, audio_processor: AudioProcessor,
                 llm_processor: LLMProcessor, tts_service: TTSService):
        self.vision_processor = vision_processor
        self.audio_processor = audio_processor
        self.llm_processor = llm_processor
        self.tts_service = tts_service

    async def handle_websocket(self, websocket: WebSocket):
        await websocket.accept()
        try:
            while True:
                data = await websocket.receive_json()
                data_type = data.get("type")

                if data_type == "frame":
                    # Decode base64 frame
                    img_data = base64.b64decode(data["data"])
                    nparr = np.frombuffer(img_data, np.uint8)
                    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                    
                    # Process vision
                    vision_result = self.vision_processor.process_frame(frame)
                    description = self.vision_processor.describe_scene(
                        vision_result["text"], vision_result["objects"]
                    )
                    
                    # Generate LLM response
                    llm_response = self.llm_processor.generate_response(description)
                    
                    # Convert to speech
                    audio_data = self.tts_service.text_to_speech(llm_response)
                    
                    # Send response
                    await websocket.send_json({
                        "type": "narration",
                        "text": llm_response,
                        "audio": audio_data
                    })

                elif data_type == "audio":
                    # Process audio (assuming raw PCM data)
                    audio_data = np.frombuffer(base64.b64decode(data["data"]), dtype=np.float32)
                    text = self.audio_processor.process_audio(audio_data)
                    llm_response = self.llm_processor.generate_response(text)
                    audio_data = self.tts_service.text_to_speech(llm_response)
                    
                    await websocket.send_json({
                        "type": "narration",
                        "text": llm_response,
                        "audio": audio_data
                    })

        except Exception as e:
            await websocket.close()
            print(f"WebSocket error: {e}")