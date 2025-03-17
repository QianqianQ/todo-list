import os
import datetime
from azure.servicebus.aio import ServiceBusClient
from azure.servicebus import ServiceBusMessage

NAMESPACE_CONNECTION_STR = os.environ["SERVICEBUS_NAMESPACE_CONNECTION_STR"]
QUEUE_NAME = os.environ["SERVICEBUS_QUEUE_NAME"]


async def send_single_message(sender, message):
    # Create a Service Bus message and send it to the queue
    message = ServiceBusMessage(message)
    await sender.send_messages(message)


async def schedule_single_message(sender, message):
    message = ServiceBusMessage(message)
    scheduled_time_utc = datetime.datetime.utcnow() + datetime.timedelta(seconds=60)
    sequence_number = await sender.schedule_messages(message, scheduled_time_utc)
    return sequence_number


async def send_service_bus_message(message):
    servicebus_client = ServiceBusClient.from_connection_string(
        conn_str=NAMESPACE_CONNECTION_STR, logging_enable=True)
    async with servicebus_client:
        sender = servicebus_client.get_queue_sender(queue_name=QUEUE_NAME)
        async with sender:
            sequence_number = await schedule_single_message(sender, message)
            print("Single message is scheduled and sequence number is {}".format(
                sequence_number))
