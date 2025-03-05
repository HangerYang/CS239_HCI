import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    print("WARNING: OPENAI_API_KEY not found in environment variables")

SERVER_PORT = int(os.getenv("SERVER_PORT", "8000"))

DEFAULT_MODEL = "gpt-3.5-turbo" 