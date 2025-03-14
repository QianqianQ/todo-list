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

    # Get task_id from route parameters
    task_id = req.route_params.get("task_id")

    try:
        table_client.delete_entity(partition_key="task", row_key=task_id)
        return func.HttpResponse(
            json.dumps({"message": "Task deleted"}),
            mimetype="application/json"
        )
    except Exception as e:
        return func.HttpResponse(
            json.dumps({"error": "Failed to delete the task"}),
            status_code=404,
            mimetype="application/json"
        )
