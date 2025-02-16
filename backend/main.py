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
<<<<<<< HEAD
    return {"message": "Hello fro Saryus!"}




=======
    return {"message": "Hello "}
>>>>>>> 8c8f3694d4b98bf4a660d2936c96f674ffe71329
