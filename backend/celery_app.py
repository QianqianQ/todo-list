import os
from celery import Celery

# Read Redis config from env variables
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = os.getenv("REDIS_PORT", "6379")

celery = Celery(
    "worker",
    broker=f"redis://{REDIS_HOST}:{REDIS_PORT}/0",
    backend=f"redis://{REDIS_HOST}:{REDIS_PORT}/0"
)


@celery.task
def send_notification(message: str):
    # Simulate sending notification
    print(f"📩 Sending notification: {message}")
    # Here you can send an email, push notification, or store in a database
    return f"Notification sent: {message}"
