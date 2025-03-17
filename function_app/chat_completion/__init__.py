import os
import json

import azure.functions as func
from openai import AzureOpenAI

endpoint = os.getenv("ENDPOINT_URL", "https://demo-ai-qianqian.cognitiveservices.azure.com/")
model_name = os.getenv("MODEL_NAME", "gpt-4o-mini")
deployment = os.getenv("AI_MODEL_DEPLOYMENT", "gpt-4o-mini")

subscription_key = os.getenv("AI_API_KEY", '')
api_version = os.getenv("AI_API_VERSION", "2024-12-01-preview")

client = AzureOpenAI(
    api_version=api_version,
    azure_endpoint=endpoint,
    api_key=subscription_key,
)


def main(req: func.HttpRequest) -> func.HttpResponse:
    # example request body: {"message": "Hello Word"}
    response = client.chat.completions.create(
        model=deployment,
        messages=[
            {"role": "user", "content": req.get_json().get("message", '')},
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

    return func.HttpResponse(
        json.dumps({"response": response_content}),
        mimetype="application/json"
    )
