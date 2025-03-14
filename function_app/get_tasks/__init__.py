import os
import json

import azure.functions as func
from azure.data.tables import TableServiceClient

connection_string = os.environ["TableStorageConnectionString"]
table_name = os.environ["TableName"]


def main(req: func.HttpRequest) -> func.HttpResponse:
    # Initialize Table Client
    table_service_client = TableServiceClient.from_connection_string(
        connection_string)
    table_client = table_service_client.get_table_client(table_name)

    # Fetch tasks
    tasks = table_client.list_entities()
    task_list = [
        {
            "id": t["RowKey"],
            "title": t.get("title", "Untitled Task"),
            "completed": t.get("completed", False),
            "description": t.get("description", "")
        }
        for t in tasks
    ]

    return func.HttpResponse(
        json.dumps(task_list),
        mimetype="application/json"
    )
