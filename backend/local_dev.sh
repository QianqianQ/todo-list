export AZURE_STORAGE_CONNECTION_STRING=""
export AZURE_STORAGE_TABLE_NAME="tasks"
export AI_API_KEY=""
export SERVICEBUS_NAMESPACE_CONNECTION_STR=""
export SERVICEBUS_QUEUE_NAME="demo-queue"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload