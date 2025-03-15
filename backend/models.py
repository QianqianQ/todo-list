class Task:
    def __init__(self, id, title, completed=False, description=""):
        self.PartitionKey = "task"  # All tasks in the same partition
        self.RowKey = id  # Unique ID
        self.title = title
        self.completed = completed
        self.description = description
