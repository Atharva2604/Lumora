import sounddevice as sd
import numpy as np
from transformers import pipeline

class AudioProcessor:
    def __init__(self, model_name="base"):
        self.asr = pipeline("automatic-speech-recognition", model=f"openai/whisper-{model_name}")

    def process_audio(self, audio_data: np.ndarray, sample_rate: int = 16000) -> str:
        """Process audio data for speech recognition."""
        result = self.asr(audio_data, sampling_rate=sample_rate)
        return result["text"]