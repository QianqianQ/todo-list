from typing import Optional
from pydantic import BaseModel, ConfigDict


class TaskSchema(BaseModel):
    id: str
    title: str
    completed: bool
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
