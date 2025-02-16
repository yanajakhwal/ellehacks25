from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow requests from any origin (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello fro Saryus!"}




