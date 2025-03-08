
import torch
from utils import talk_agent
from transformers import AutoTokenizer, pipeline
import os
from prompts import SOUND_RESPONSE_DIR, PROFILE_DIR

model_name = "meta-llama/Llama-2-7b-chat-hf"
tokenizer = AutoTokenizer.from_pretrained(model_name, cache_dir="/home/hyang/CS239/.cache")
llm = pipeline(
    "text-generation",
    model=model_name,
    torch_dtype=torch.float16,
    device_map="auto",
)
os.makedirs(PROFILE_DIR, exist_ok=True)
os.makedirs(SOUND_RESPONSE_DIR, exist_ok=True)
# user input to the website 
username = input("Enter your username: ").strip()
talk_agent(username, llm)