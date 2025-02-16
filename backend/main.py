from fastapi import FastAPI
from pydantic import BaseModel
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
    return {"message": "Hello from Saryus!"}


class GeofenceStatus(BaseModel):
    inRange: bool
    location: dict

@app.post("/api/geofence")
async def receive_geofence_status(status: GeofenceStatus):
    if not status.inRange:
        message = client.messages.create(
            body="Patient is out of range",
            from_="+12893019431",
            to="+16476796931",
        )
        print(message.sid)
    return {"message": "Status received"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



