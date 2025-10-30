from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
import logging

app = FastAPI()
logger = logging.getLogger(__name__)

# Configuration
MODEL_NAME = "aetherial/llm-base"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Initialize model and tokenizer
try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME).to(DEVICE)
    logger.info(f"Loaded model {MODEL_NAME} on {DEVICE}")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")
    raise

class GenerationRequest(BaseModel):
    prompt: str
    max_length: int = 100
    temperature: float = 0.7
    top_p: float = 0.9
    num_return_sequences: int = 1

class GenerationResponse(BaseModel):
    generated_text: str
    model: str
    tokens_generated: int

@app.post("/generate", response_model=GenerationResponse)
async def generate_text(request: GenerationRequest):
    try:
        inputs = tokenizer(request.prompt, return_tensors="pt").to(DEVICE)
        
        outputs = model.generate(
            inputs.input_ids,
            max_length=request.max_length,
            temperature=request.temperature,
            top_p=request.top_p,
            num_return_sequences=request.num_return_sequences,
            pad_token_id=tokenizer.eos_token_id
        )
        
        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        return {
            "generated_text": generated_text,
            "model": MODEL_NAME,
            "tokens_generated": len(outputs[0])
        }
        
    except Exception as e:
        logger.error(f"Generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model": MODEL_NAME, "device": DEVICE}
