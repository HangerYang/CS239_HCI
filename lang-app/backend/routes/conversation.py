from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from services.llm_service import get_llm_response
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class Message(BaseModel):
    text: str
    sender: str  # 'user' or 'bot'

class ConversationRequest(BaseModel):
    messages: List[Message]

class ConversationResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ConversationResponse)
async def chat(request: ConversationRequest):
    try:
        logger.info(f"Received chat request with {len(request.messages)} messages")
        
        conversation_history = [{"role": msg.sender, "content": msg.text} for msg in request.messages]
    
        logger.info(f"Processed conversation history: {conversation_history}")
        
        response_text = await get_llm_response(conversation_history)
        
        logger.info(f"Returning response: {response_text[:50]}...") 
        
        return ConversationResponse(response=response_text)
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting response: {str(e)}")