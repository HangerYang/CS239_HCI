from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List
import os
import sys
import uuid
from datetime import datetime
import dotenv
import torch
from transformers import pipeline, AutoTokenizer,AutoModelForCausalLM
from transformers.generation.utils import GenerationConfig
import os
from prompts import SOUND_RESPONSE_DIR, PROFILE_DIR, LANGUAGE_MAP
dotenv.load_dotenv()

# Add the parent directory to path so we can import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils import load_user_profile, save_user_profile, clean_text, infer_ai_role
from prompts import PROFILE_DIR, DEFAULT_SCENARIOS, SOUND_RESPONSE_DIR

# Create directories if they don't exist
os.makedirs(PROFILE_DIR, exist_ok=True)
os.makedirs(SOUND_RESPONSE_DIR, exist_ok=True)

# Initialize FastAPI
app = FastAPI(title="Language Learning API", 
              description="API for language learning conversations with Chatty")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CLIENT_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for audio
app.mount("/audio", StaticFiles(directory=SOUND_RESPONSE_DIR), name="audio")

tokenizer = AutoTokenizer.from_pretrained("OrionStarAI/Orion-14B-Chat", use_fast=False, trust_remote_code=True, cache_dir="/home/hyang/CS239_new/.cache" )
model = AutoModelForCausalLM.from_pretrained(
    "OrionStarAI/Orion-14B-Chat",
    device_map="auto",
    torch_dtype=torch.bfloat16,
    trust_remote_code=True,
    cache_dir="/home/hyang/CS239_new/.cache"
)

# Load generation configuration from pretrained model
generation_config = GenerationConfig.from_pretrained("OrionStarAI/Orion-14B-Chat")
llm = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    device_map="auto",
    torch_dtype=torch.bfloat16,
    config=generation_config
)

# API models
class ChatRequest(BaseModel):
    username: str
    message: Optional[str] = None
    scenario: Optional[str] = None
    ai_role: Optional[str] = None
    language: str = "en"

class ChatResponse(BaseModel):
    response: str
    audio_url: Optional[str] = None

class SuggestionRequest(BaseModel):
    username: str

class SuggestionResponse(BaseModel):
    suggestions: List[str]

class LessonRequest(BaseModel):
    username: str

class LessonResponse(BaseModel):
    critique: str
    lessons: List[str]

class ScenarioRequest(BaseModel):
    username: str
    scenario: str
    language: str

class ScenarioResponse(BaseModel):
    scenario: str
    ai_role: str

# Initialize LLM on demand
def init_llm():
    global llm
    if llm is not None:
        return llm
    
    try:
        from llama_cpp import Llama
        model_path = os.getenv("MODEL_PATH")
        print(f"Loading model from {model_path}...")
        
        llm = Llama(
            model_path=model_path,
            n_ctx=int(os.getenv("MODEL_N_CTX", "2048")),
            n_gpu_layers=int(os.getenv("MODEL_N_GPU_LAYERS", "-1"))
        )
        print("Model loaded successfully!")
        return llm
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        raise e



@app.get("/")
async def root():
    return {"message": "Language Learning API is running"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # this is only called when the user start inputing
    global llm
    if llm is None:
        llm = init_llm()
    username = request.username
    message = request.message
    user_profile = load_user_profile(username)
    if not user_profile.get("scenario"):
        raise HTTPException(status_code=400, detail="Scenario not set for this user")
    
    if not user_profile.get("ai_role"):
        user_profile["ai_role"] = infer_ai_role(user_profile["scenario"], llm)
    language = user_profile['language']
    
    # Build conversation history
    formatted_history = ""
    for entry in user_profile.get("chat_history", []):
        if entry["user"] != "Chatty INITIATED":
            formatted_history += f"User: {entry['user']}\n"
        formatted_history += f"You: {entry['Chatty']}\n"
    
    # Add current user message
    formatted_history += f"User: {message}\n"
    
    # Create the prompt
    content = f"""Your name is Chatty, and you are playing the role of {user_profile['ai_role']} in the following scenario: {user_profile['scenario']}.
    Continue the conversation with you roleplaying as the {user_profile['ai_role']} using only {language}. You are strictly prohibited from using any other language.
    No matter what language the user inputs, you must always respond exclusively in {language}.
    The chat history is as follows: {formatted_history}
    Have fun with the user!"""

    formatted_prompt = [{"role": "user", "content": content}]
    # print(formatted_prompt)
    # Generate response
    response = llm(
    formatted_prompt,
    do_sample=True,
    top_k=50,
    top_p=0.7,
    num_return_sequences=1,
    repetition_penalty=1.1,
    max_new_tokens=100,
)[0]['generated_text'][1]["content"]
    # Define possible colon variations
    colon_variants = [":", "："]  # English `:` and full-width `：`

    # Find the first matching colon and split the response
    for colon in colon_variants:
        if colon in response:
            response = response.split(colon, 1)[-1].strip()
            break  # Stop after the first successful split

    if not response:
        if language == 'en':
            response = "I'm thinking about what to say. Could you please repeat your question?"
        elif language in ('zh', 'zh-CN', 'zh-TW'):
            response = "我正在思考该怎么回答。请您再问一次好吗？"
        elif language == 'ja':
            response = "何を言うべきか考えています。もう一度質問していただけますか？"
        else:
            response = "I'm thinking about what to say. Could you please repeat your question?" 
    
    # Update conversation history
    user_profile["chat_history"].append({
        "user": message,
        "Chatty": response,
        "timestamp": datetime.now().isoformat()
    })
    
    # Save the updated profile
    save_user_profile(user_profile)
    
    # Generate audio file
    audio_file = f"response-{uuid.uuid4()}.mp3"
    audio_path = os.path.join(SOUND_RESPONSE_DIR, audio_file)
    
    from gtts import gTTS
    voiced_response = clean_text(response)
    tts = gTTS(text=voiced_response, lang=LANGUAGE_MAP[language], slow=False)
    tts.save(audio_path)
    
    # Return response
    return {
        "response": response,
        "audio_url": f"/audio/{audio_file}"
    }
@app.post("/api/get_scenario_response", response_model=ChatResponse)
async def get_scenario_response(request: ChatRequest):
    global llm
    if llm is None:
        llm = init_llm()

    username = request.username
    
    # Load user profile
    user_profile = load_user_profile(username)
    if not user_profile:
        raise HTTPException(status_code=400, detail="User profile not found")

    # Retrieve scenario and language from the backend
    scenario = user_profile.get("scenario")
    language = user_profile.get("language", "en")  # Default to English if not set

    if not scenario:
        raise HTTPException(status_code=400, detail="Scenario not set for this user")

    # Get Chatty role and description from predefined scenarios
    ai_role = DEFAULT_SCENARIOS.get(scenario, {}).get(language, {}).get("role", "A conversation partner")
    scenario_desc = DEFAULT_SCENARIOS.get(scenario, {}).get(language, {}).get("desc", scenario)

    # Create prompt for LLM
    prompt = f"""You are {ai_role} in the following scenario: {scenario_desc}.
    Respond in {language} only. You are strictly prohibited from using any other language.
    How would you respond to start a natural conversation in this scenario?"""

    formatted_prompt = [{"role": "user", "content": prompt}]
    
    # Generate response from LLM
    try:
        response = llm(
            formatted_prompt,
            do_sample=True,
            top_k=50,
            top_p=0.7,
            num_return_sequences=1,
            repetition_penalty=1.1,
            max_new_tokens=100,
        )[0]['generated_text'][1]["content"]
    except Exception as e:
        print(f"Error generating response: {e}")
        response = "I'm having trouble thinking of a response. Can you try again?"

    # Generate audio file (optional)
    audio_file = f"response-{uuid.uuid4()}.mp3"
    audio_path = os.path.join(SOUND_RESPONSE_DIR, audio_file)
    
    try:
        from gtts import gTTS
        voiced_response = clean_text(response)
        tts = gTTS(text=voiced_response, lang=LANGUAGE_MAP.get(language, "en"), slow=False)
        tts.save(audio_path)
    except Exception as e:
        print(f"Error generating audio: {e}")
        audio_path = None

    return {
        "response": response,
        "audio_url": f"/audio/{audio_file}" if audio_path else None
    }
  
@app.get("/api/user_profile")
async def get_user_profile(username: str):
    try:
        profile_path = os.path.join(os.path.dirname(__file__), "..", "user_profiles", f"{username}.json")
        
        # Check if profile exists
        if not os.path.exists(profile_path):
            return {"username": username, "custom_scenarios": []}
        
        # Load profile
        with open(profile_path, "r") as f:
            profile = json.load(f)
            
        return profile
    except Exception as e:
        print(f"Error loading user profile: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to load user profile: {str(e)}")
      
# Import routers from separate files
# This structure allows you to split your API endpoints into multiple files
from app.routers import suggestions, lessons, scenarios

# Include routers
app.include_router(suggestions.router)
app.include_router(lessons.router)
app.include_router(scenarios.router)

# For direct execution of this file
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
