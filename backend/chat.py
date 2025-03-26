import os
import json
from fastapi import APIRouter
from pydantic import BaseModel
from openai import AzureOpenAI


endpoint = os.getenv("ENDPOINT_URL", "https://xxx.cognitiveservices.azure.com/")
model_name = os.getenv("MODEL_NAME", "gpt-4o-mini")
deployment = os.getenv("AI_MODEL_DEPLOYMENT", "gpt-4o-mini")

subscription_key = os.getenv("AI_API_KEY", '')
api_version = os.getenv("AI_API_VERSION", "2024-12-01-preview")

client = AzureOpenAI(
    api_version=api_version,
    azure_endpoint=endpoint,
    api_key=subscription_key,
)

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    response = client.chat.completions.create(
        model=deployment,
        messages=[
            {"role": "user", "content": request.message},
        ],
        max_tokens=800,
        temperature=0.7,
        top_p=0.95,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
        stream=False
    )

    response = json.loads(response.to_json())
    response_content = response["choices"][0]["message"]["content"]

    return ChatResponse(response=response_content)
