from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import os
import sys

# Add the parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from utils import load_user_profile, generate_suggestion

# Get llm from main
from app.main import llm

router = APIRouter(
    prefix="/api",
    tags=["suggestions"],
)

class SuggestionRequest(BaseModel):
    username: str

class SuggestionResponse(BaseModel):
    suggestions: List[str]

@router.post("/suggestions", response_model=SuggestionResponse)
async def get_suggestions(request: SuggestionRequest):
    # Get llm
    global llm
    
    username = request.username
    # user_profile = load_user_profile(username)
    
    # if not user_profile.get("chat_history") or len(user_profile["chat_history"]) == 0:
    #     return {"suggestions": ["Hello, how are you?", "Nice to meet you!", "What would you like to talk about?"]}
    return generate_suggestion(username, llm)
    # Build formatted history for the last few exchanges
    # formatted_history = ""
    # recent_history = user_profile["chat_history"][-5:] if len(user_profile["chat_history"]) > 5 else user_profile["chat_history"]
    # for entry in recent_history:
    #     if entry["user"] != "AI INITIATED":
    #         formatted_history += f"User: {entry['user']}\n"
    #     formatted_history += f"You: {entry['ai']}\n"
    
    # # Create prompt for suggestions
    # formatted_prompt = f"""
    # <s>[INST] <<SYS>>
    # You are playing the role of {user_profile['ai_role']} in the following scenario: {user_profile['scenario']}
    # The chat history is as followed: {formatted_history}
    # The user is in an ongoing conversation and needs help continuing it naturally.
    # Given the last ai response, generate three possible ways the user could reply next.
    # Each response should be a complete sentence that the user might actually say in the conversation.
    # Do NOT provide conversation suggestions—only full user replies. Format the responses as a numbered list, with each on a separate line."
    # <</SYS>>
    # [/INST]"""
    
    # # Generate suggestions
    # suggestion_text = llm(
    #     formatted_prompt,
    #     do_sample=True,
    #     top_k=50,
    #     top_p=0.7,
    #     num_return_sequences=1,
    #     repetition_penalty=1.1,
    #     max_new_tokens=256,
    # )[0]['generated_text'].split('[/INST]')[-1].strip()
    # print("identify")
    # # Parse suggestions
    # suggestions = []
    # for line in suggestion_text.split("\n"):
    #     line = line.strip()
    #     if line and (line.startswith("1.") or line.startswith("2.") or line.startswith("3.") or line.startswith("-")):
    #         for prefix in ["1.", "2.", "3.", "-", " "]:
    #             if line.startswith(prefix):
    #                 suggestion = line[len(prefix):].strip()
    #                 suggestions.append(suggestion)
    #                 break
    
    # Add fallbacks if needed
    # while len(suggestions) < 3:
    #     fallbacks = [
    #         "I understand what you're saying.",
    #         "That's interesting. Can you tell me more?",
    #         "I agree with your perspective.",
    #         "What do you think about this?",
    #         "Could you explain that differently?"
    #     ]
    #     for fallback in fallbacks:
    #         if fallback not in suggestions:
    #             suggestions.append(fallback)
    #             if len(suggestions) >= 3:
    #                 break
    
    # return {"suggestions": suggestions[:3]}