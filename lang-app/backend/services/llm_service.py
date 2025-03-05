from openai import OpenAI
from config import OPENAI_API_KEY, DEFAULT_MODEL
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = OpenAI(api_key=OPENAI_API_KEY)

async def get_llm_response(conversation_history):
    try:
        logger.info(f"Processing conversation with {len(conversation_history)} messages")
        formatted_messages = []
        
        formatted_messages.append({
            "role": "system",
            "content": "You are a helpful conversation partner practicing language skills with the user. Respond naturally and helpfully, and add some emoji somtimes, and reponse the question concisely."
        })
        
        for msg in conversation_history:
            role = "assistant" if msg["role"] == "bot" else "user"
            formatted_messages.append({
                "role": role, 
                "content": msg["content"] 
            })
        
        logger.info(f"Sending formatted messages: {formatted_messages}")
        
        # Make API call to OpenAI
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", 
            messages=formatted_messages,
            max_tokens=500,
            temperature=0.7
        )
        
        result = response.choices[0].message.content
        logger.info(f"Got response from API: {result[:50]}...") 
        return result
        
    except Exception as e:
        logger.error(f"Error calling LLM API: {e}")
        return f"I'm sorry, I'm having trouble processing your request right now. Error: {str(e)}"