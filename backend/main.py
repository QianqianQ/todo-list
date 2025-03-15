import os
import json
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from azure_storage_table import table_client

from models import Task
from schemas import TaskSchema
import chat
from message import send_service_bus_message

app = FastAPI()

app.include_router(chat.router)

# Load environment variables
allowed_origins = os.getenv(
    "ALLOW_ORIGINS",
    "http://localhost,http://127.0.0.1,http://localhost:3000,http://127.0.0.1:3000").split(",")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


@app.get("/")
def read_root():
    return {"message": "Welcome to the To-Do List API"}


@app.get("/tasks", response_model=list[TaskSchema])
def get_tasks():
    tasks = table_client.list_entities()
    return [{"id": t["RowKey"],
             "title": t.get("title", "Untitled Task"),
             "completed": t.get("completed", False),
             "description": t.get("description", '')}
            for t in tasks]


@app.post("/tasks", response_model=TaskSchema)
def create_task(task: TaskSchema, background_tasks: BackgroundTasks):
    model_dump = task.model_dump()
    entity = Task(**model_dump)
    table_client.upsert_entity(entity=entity.__dict__)
    background_tasks.add_task(send_service_bus_message, json.dumps(model_dump))
    return task


# @app.put("/tasks/{task_id}")
# def update_task(task_id: int, task: Task):
#     tasks[task_id] = task
#     print(tasks)
#     return task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    try:
        table_client.delete_entity(partition_key="task", row_key=task_id)
        return {"message": "Task deleted"}
    except:
        raise HTTPException(status_code=404, detail="Fail to delete the task")
