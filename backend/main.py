from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import Task

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

tasks = []

@app.get("/")
def read_root():
    return {"message": "Welcome to the To-Do List API"}

@app.get("/tasks")
def get_tasks():
    print(tasks)
    return tasks

@app.post("/tasks")
def create_task(task: Task):
    tasks.append(task)
    print(tasks)
    return task

@app.put("/tasks/{task_id}")
def update_task(task_id: int, task: Task):
    tasks[task_id] = task
    print(tasks)
    return task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    global tasks
    print(tasks)
    if not any(task.id == task_id for task in tasks):
        raise HTTPException(status_code=404, detail="Task not found")
    
    tasks = [task for task in tasks if task.id != task_id]
    print(tasks)

    return {"message": "Task deleted successfully"}