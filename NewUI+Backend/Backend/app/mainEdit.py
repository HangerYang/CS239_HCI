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
#from utils import talk_agent
from transformers import pipeline, AutoTokenizer,AutoModelForCausalLM
from transformers.generation.utils import GenerationConfig
import os
from prompts import SOUND_RESPONSE_DIR, PROFILE_DIR, LANGUAGE_MAP
dotenv.load_dotenv()

# Add the parent directory to path so we can import utils
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils import load_user_profile, save_user_profile, clean_text, infer_ai_role, get_lesson, get_suggestions
from prompts import PROFILE_DIR, DEFAULT_SCENARIOS, SOUND_RESPONSE_DIR

# Create directories if they don't exist
os.makedirs(PROFILE_DIR, exist_ok=True)
os.makedirs(SOUND_RESPONSE_DIR, exist_ok=True)

# Initialize FastAPI
app = FastAPI(title="Language Learning API", 
              description="API for language learning conversations with AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CLIENT_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for audio
app.mount("/audio", StaticFiles(directory=SOUND_RESPONSE_DIR), name="audio")

tokenizer = AutoTokenizer.from_pretrained("OrionStarAI/Orion-14B-Chat", use_fast=False, trust_remote_code=True, cache_dir="/home/aichi/CS2/.cache" )
model = AutoModelForCausalLM.from_pretrained(
    "OrionStarAI/Orion-14B-Chat",
    device_map="auto",
    torch_dtype=torch.bfloat16,
    trust_remote_code=True,
    cache_dir="/home/aichi/CS2/.cache"
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
    message: str
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
    print(llm)
    username = request.username
    message = request.message
    language = request.language
    # print("STATS")
    # print(username)
    # print(message)
    # print(language)
    # language = "zh-CN"
    # print(language)
    # Load user profile
    user_profile = load_user_profile(username)
    # if request.scenario in DEFAULT_SCENARIOS.keys():
    #     user_profile["scenario"] = DEFAULT_SCENARIOS[request.scenario]["desc"]
    #     user_profile["ai_role"] = DEFAULT_SCENARIOS[request.scenario]["role"]

    # Update scenario if provided
    # if request.scenario:
    #     user_profile["scenario"] = request.scenario
    
    # Update AI role if provided
    # if request.ai_role:
    #     user_profile["ai_role"] = request.ai_role
    
    # if request.language:
    #     user_profile["language"] = request.language
    # Make sure we have required fields
    if not user_profile.get("scenario"):
        raise HTTPException(status_code=400, detail="Scenario not set for this user")
    
    if not user_profile.get("ai_role"):
        user_profile["ai_role"] = infer_ai_role(user_profile["scenario"], llm)
    
    # Build conversation history
    formatted_history = ""
    for entry in user_profile.get("chat_history", []):
        if entry["user"] != "AI INITIATED":
            formatted_history += f"User: {entry['user']}\n"
        formatted_history += f"You: {entry['ai']}\n"
    
    # Add current user message
    if message == 'lesson':
        response_dict = get_lesson(username, llm)
        response = 'Critique: \n'+response_dict['critique'] + '\n' + ' Here\'s some suggestions: '
        lessonlist = response_dict['lessons']
        for i in range(1, len(lessonlist)+1):
            response += str(i)+'. ' + lessonlist[i-1]+ '\n'
    elif message == 'suggest line':
        suggest_dict = get_suggestions(username, llm)
        response = 'Here\'s some suggestions to keep the conversation going: \n'
        suggestlist = suggest_dict['suggestions']
        for i in range(1, len(suggestlist)+1):
            response += str(i)+'. ' + suggestlist[i-1]+ '\n'

    else:
        formatted_history += f"User: {message}\n"
        content = f"""You are playing the role of {user_profile['ai_role']} in the following scenario: {user_profile['scenario']}.
    Continue the conversation with you roleplaying as the {user_profile['ai_role']} using only {LANGUAGE_MAP[language]}. You are strictly prohibited from using any other language.
    No matter what language the user inputs, you must always respond exclusively in {LANGUAGE_MAP[language]}.
    The chat history is as follows: {formatted_history}"""
        formatted_prompt = [{"role": "user", "content": content}]
        response = llm(
            formatted_prompt,
            do_sample=True,
            top_k=50,
            top_p=0.7,
            num_return_sequences=1,
            repetition_penalty=1.1,
            max_new_tokens=100,
            )[0]['generated_text'][1]["content"]
        if response.startswith("You:"): #Fixes whenever response starts with 'You: ' which can be redundant
            response = response[4:].strip()            

    #Create Prompt
    #print("HISTORY")
    #print(formatted_history)
    #print(formatted_prompt)
    # Generate response

    
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
    if message != 'lesson' and message != 'suggest line':
        user_profile["chat_history"].append({
            "user": message,
            "ai": response,
            "timestamp": datetime.now().isoformat()
        })
        
        # Save the updated profile
        save_user_profile(user_profile)
    
    # Generate audio file
    audio_file = f"response-{uuid.uuid4()}.mp3"
    audio_path = os.path.join(SOUND_RESPONSE_DIR, audio_file)
    
    from gtts import gTTS
    voiced_response = clean_text(response)
    tts = gTTS(text=voiced_response, lang=language, slow=False)
    tts.save(audio_path)
    
    # Return response
    return {
        "response": response,
        "audio_url": f"/audio/{audio_file}"
    }

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


