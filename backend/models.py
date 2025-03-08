from pydantic import BaseModel


class Task(BaseModel):
    id: str
    title: str
    completed: bool = False
