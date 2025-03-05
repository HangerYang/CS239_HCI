from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routes.conversation import router as conversation_router
from config import SERVER_PORT

app = FastAPI(title="Language App API")

# Setup CORS to allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(conversation_router, prefix="/api/conversation", tags=["conversation"])

@app.get("/")
def read_root():
    return {"status": "active", "message": "Language App API is running"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=SERVER_PORT, reload=True)