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
from app.main import init_llm

router = APIRouter(
    prefix="/api",
    tags=["scenarios"],
)

class ScenarioRequest(BaseModel):
    username: str
    scenario: str

class ScenarioResponse(BaseModel):
    scenario: str
    ai_role: str

@router.post("/scenario/set", response_model=ScenarioResponse)
async def set_scenario(request: ScenarioRequest):
    # Get llm
    llm = init_llm()
    
    username = request.username
    scenario = request.scenario
    
    # Load user profile
    user_profile = load_user_profile(username)
    
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
        "scenario": scenario,
        "ai_role": ai_role
    }

@router.get("/scenarios")
async def get_default_scenarios():
    return DEFAULT_SCENARIOS

@router.get("/profile/{username}")
async def get_profile(username: str):
    user_profile = load_user_profile(username)
    return user_profile