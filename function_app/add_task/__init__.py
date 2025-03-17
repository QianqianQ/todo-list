import os
import json

import azure.functions as func
from azure.data.tables import TableServiceClient

from .message import send_service_bus_message

connection_string = os.environ["TableStorageConnectionString"]
table_name = os.environ["TableName"]


def main(req: func.HttpRequest) -> func.HttpResponse:
    # Initialize Table Client
    table_service_client = TableServiceClient.from_connection_string(
        connection_string)
    table_client = table_service_client.get_table_client(table_name)

    # Parse request body
    task = req.get_json()

    # Create task entity
    entity = {
        "PartitionKey": "task",
        "RowKey": task["id"],
        "title": task["title"],
        "completed": task["completed"],
        "description": task["description"]
    }
    table_client.upsert_entity(entity=entity)
    send_service_bus_message(json.dumps(entity))
    return func.HttpResponse(
        json.dumps(task),
        mimetype="application/json"
    )
