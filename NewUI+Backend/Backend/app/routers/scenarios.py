from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List
import os
import sys

# Add the parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from utils import load_user_profile, save_user_profile, infer_ai_role
from prompts import DEFAULT_SCENARIOS

# Get llm from main
from app.main import llm

router = APIRouter(
    prefix="/api",
    tags=["scenarios"],
)

class ScenarioRequest(BaseModel):
    username: str
    scenario: str
    language: str

class ScenarioResponse(BaseModel):
    scenario: str
    ai_role: str

@router.post("/scenario/set", response_model=ScenarioResponse)
async def set_scenario(request: ScenarioRequest):
    global llm
    username = request.username
    scenario = request.scenario
    language = request.language
    user_profile = load_user_profile(username)
    if language != "none":
        user_profile["language"] = language
    # Load user profile
    
    if request.scenario in DEFAULT_SCENARIOS.keys():
        user_profile["scenario"] = DEFAULT_SCENARIOS[request.scenario]["desc"]
        user_profile["ai_role"] = DEFAULT_SCENARIOS[request.scenario]["role"]
    else:
        # Update scenario
        user_profile["scenario"] = scenario
        # Infer AI role based on scenario
        ai_role = infer_ai_role(scenario, llm)
        user_profile["ai_role"] = ai_role
    
    # Reset chat history for new scenario
    user_profile["chat_history"] = []
    
    # Save user profile
    save_user_profile(user_profile)
    
    return {
        "scenario": user_profile["scenario"],
        "ai_role": user_profile["ai_role"]
    }

@router.get("/scenarios")
async def get_default_scenarios():
    return DEFAULT_SCENARIOS

@router.get("/profile/{username}")
async def get_profile(username: str):
    user_profile = load_user_profile(username)
    return user_profile