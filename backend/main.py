from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

#twilio API integration - from site
import os
from twilio.rest import Client

#twilio API key and token - from site
account_sid = 'AC24c974847f9bdcd9247c88ddf64df675'
auth_token = '5cda0eb1b7a3348d82935d941f3f0e32'
client = Client(account_sid, auth_token)


# range - this based off boolean variable name = isInRange 
message = client.messages.create(
    body="Patient is out of range",
    from_="+12893019431",
    to="+16476796931",
)
print(message.body)


#make this based off of the user input - when they click login button
verification = client.verify \
    .v2 \
    .services('VAea5cf22f2a59e8d369b782f3557f8789') \
    .verifications \
    .create(to='+16476796931', channel='sms')
print(verification.sid)
verification_check = client.verify.v2.services(
    "VAea5cf22f2a59e8d369b782f3557f8789"
).verification_checks.create(to="+16476796931", code="123456")
print(verification_check.status)

#verifiying user input codes 
verification_check = client.verify.services('VAea5cf22f2a59e8d369b782f3557f8789').verification_checks.create(to='+16476796931', code=newCode)
print(verification_check.status)


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
    uvicorn.run(app, host="0.0.0.0", port=8082)

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











