from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import google.generativeai as genai
import os
from twilio.rest import Client

# Initialize the FastAPI app
app = FastAPI()

# Allow requests from any origin (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
genai.configure(api_key='AIzaSyA5s9-XHuEheYpgqY8hjjXI0pf6qIFJMvo')

# Twilio configuration
account_sid = 'AC24c974847f9bdcd9247c88ddf64df675'
auth_token = '5cda0eb1b7a3348d82935d941f3f0e32'
twilio_phone = '+12893019431'
caregiver_phone = '+16476796931'

# Define the data model for a single message in the conversation
class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str  # The actual message content

# Define the data model for the request payload
class ChatRequest(BaseModel):
    user_id: str  # Unique identifier for the user
    user_data: dict  # Additional user data (e.g., name, preferences)
    conversation_history: List[Message]  # List of previous messages
    user_question: str  # The current question from the user

# Define the data model for the response payload
class ChatResponse(BaseModel):
    response: str  # The response from the chatbot
    conversation_history: List[Message]  # Updated conversation history

# Define the data model for geofence status
class GeofenceStatus(BaseModel):
    inRange: bool
    location: dict

# System prompt to define the chatbot's personality and behavior
SYSTEM_PROMPT = """
NEVER EXCEED 50 WORDS:

You are Clara, a friendly and empathetic chatbot designed to assist Barbara, a dementia patient. 
Barbara is a remarkable woman who loves the show "I Love Lucy," is known for her famous peach cobbler, 
and her grandkids call her "Peachy Meemaw." She was one of the first computer scientists working for 
NASA during the Apollo mission. Barbara has class, sass, and loves jazz.

Your role is to:
1. Be patient, kind, and supportive in all interactions.
2. Help Barbara remember important things, such as appointments, family events, or recipes.
3. Engage her with topics she loves, like "I Love Lucy," jazz music, or her time at NASA.
4. Use simple and clear language to avoid confusion.
5. Provide gentle reminders and encouragement.
6. If Barbara seems confused, calmly guide her back to the topic or reassure her.

Always maintain a warm and cheerful tone, and make her feel valued and understood.

Never exceed the word count limit of 50, and avoid complex or technical language.
"""

# Function to call the Gemini API
def call_gemini_api(messages: List[dict]) -> str:
    """
    Calls the Gemini API with the conversation history and returns the response.
    """
    try:
        model = genai.GenerativeModel("gemini-pro")
        
        # Convert the messages to the format expected by Gemini
        formatted_messages = []
        for msg in messages:
            # Ensure the role is either "user" or "model"
            role = "user" if msg["role"] == "user" else "model"
            formatted_messages.append({
                "parts": [{"text": msg["content"]}],
                "role": role
            })
        
        # Call the Gemini API with the formatted messages
        response = model.generate_content(formatted_messages)
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling Gemini API: {str(e)}")

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Hello from Saryus!"}

@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Endpoint to handle chatbot conversations.
    """
    # Prepare the conversation history for Gemini
    messages = [
        {"role": "model", "content": SYSTEM_PROMPT}  # Add the system prompt at the start
    ]
    
    # Add the existing conversation history
    messages.extend([
        {"role": msg.role, "content": msg.content}
        for msg in request.conversation_history
    ])
    
    # Add the user's current question to the conversation history
    messages.append({"role": "user", "content": request.user_question})

    # Call the Gemini API
    try:
        bot_response = call_gemini_api(messages)
    except HTTPException as e:
        raise e

    # Update the conversation history with the bot's response
    updated_history = request.conversation_history + [
        Message(role="user", content=request.user_question),
        Message(role="model", content=bot_response),  # Use "model" instead of "assistant"
    ]

    # Return the response and updated conversation history
    return ChatResponse(
        response=bot_response,
        conversation_history=updated_history,
    )

@app.post("/geofence")
async def update_geofence_status(status: GeofenceStatus):
    """
    Endpoint to handle geofence status updates and send SMS when user is out of range
    """
    try:
        # If user is out of range, send SMS notification
        if not status.inRange:
            # Initialize Twilio client
            client = Client(account_sid, auth_token)
            
            # Create and send the message
            message = client.messages.create(
                body="Patient is out of range",
                from_=twilio_phone,
                to=caregiver_phone,
            )
            
            return {
                "status": "SMS sent successfully",
                "message_sid": message.sid,
                "geofence_status": "out of range"
            }
        
        return {
            "status": "User is in range",
            "geofence_status": "in range"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending SMS: {str(e)}")