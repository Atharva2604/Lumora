from gtts import gTTS
import io
import base64

class TTSService:
    def text_to_speech(self, text: str) -> str:
        """Convert text to speech and return base64 encoded audio."""
        tts = gTTS(text=text, lang="en")
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        audio_data = base64.b64encode(audio_buffer.read()).decode("utf-8")
        return audio_data