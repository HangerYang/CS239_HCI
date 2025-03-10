from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
import os
import sys

# Add the parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from utils import load_user_profile, save_user_profile, infer_ai_role
from prompts import DEFAULT_SCENARIOS, LANGUAGE_MAP

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
    description: Optional[str] = "Default description"

class ScenarioResponse(BaseModel):
    scenario: str
    ai_role: str

@router.post("/scenario/set", response_model=ScenarioResponse)
async def set_scenario(request: ScenarioRequest):
    global llm
    username = request.username
    scenario = request.scenario
    language = request.language
    scenario_description = request.description
    user_profile = load_user_profile(username)
    if language != "none":
        user_profile["language"] = language
    # Load user profile
    if scenario in DEFAULT_SCENARIOS.keys():
        user_profile["scenario"] = DEFAULT_SCENARIOS[scenario][language]["desc"]
        user_profile["ai_role"] = DEFAULT_SCENARIOS[scenario][language]["role"]
    else:
        # Update scenario
        user_profile["scenario"] = scenario_description
        # Infer AI role based on scenario
        user_profile["ai_role"] = infer_ai_role(scenario_description, llm)
    
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