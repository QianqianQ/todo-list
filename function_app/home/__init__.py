import azure.functions as func
import json


def main(req: func.HttpRequest) -> func.HttpResponse:
    response = {
        "message": "Welcome to the To-Do List API"
    }
    return func.HttpResponse(
        json.dumps(response),
        mimetype="application/json"
    )
