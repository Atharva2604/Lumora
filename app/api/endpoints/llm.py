from fastapi import APIRouter
from pydantic import BaseModel
from ..models.llm_processor import LLMProcessor
from ..config import Config

router = APIRouter()
llm_processor = LLMProcessor(Config.LLAMA_MODEL_PATH)

class TextInput(BaseModel):
    prompt: str

@router.post("/generate")
async def generate_text(input: TextInput):
    response = llm_processor.generate_response(input.prompt)
    return {"response": response}