from database import Base
from sqlalchemy import Column, String, Boolean


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    completed = Column(Boolean, default=False, index=True)
    description = Column(String, nullable=True, index=True)
