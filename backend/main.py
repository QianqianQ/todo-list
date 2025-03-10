from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from schemas import TaskSchema

import database
from models import Task
from celery_app import send_notification

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

database.Base.metadata.create_all(bind=database.engine)


# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Welcome to the To-Do List API"}


@app.get("/tasks", response_model=list[TaskSchema])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()


@app.post("/tasks", response_model=TaskSchema)
def create_task(task: TaskSchema, db: Session = Depends(get_db)):
    task = Task(**task.model_dump())  # Convert Pydantic model to SQLAlchemy model:
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


# @app.put("/tasks/{task_id}")
# def update_task(task_id: int, task: Task):
#     tasks[task_id] = task
#     print(tasks)
#     return task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: str, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)  # Remove from the database
    db.commit()  # Save changes
    return {"message": "Task deleted successfully"}


@app.post("/notify")
def notify_user(message: str):
    send_notification.delay(message)
    return {"message": "Notification is being processed"}
