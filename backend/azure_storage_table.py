import os
from azure.data.tables import TableServiceClient

# Load Azure Storage connection string and environment variables
AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
TABLE_NAME = os.getenv("AZURE_STORAGE_TABLE_NAME")

# Initialize Table Client
table_name = TABLE_NAME
table_service = TableServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION_STRING)
table_client = table_service.create_table_if_not_exists(table_name)
