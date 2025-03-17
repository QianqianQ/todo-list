import os
import datetime
from azure.servicebus import ServiceBusClient, ServiceBusMessage

NAMESPACE_CONNECTION_STR = os.environ["SERVICEBUS_NAMESPACE_CONNECTION_STR"]
QUEUE_NAME = os.environ["SERVICEBUS_QUEUE_NAME"]


def schedule_single_message(sender, message):
    message = ServiceBusMessage(message)
    scheduled_time_utc = datetime.datetime.utcnow() + datetime.timedelta(seconds=60)
    sequence_number = sender.schedule_messages(message, scheduled_time_utc)
    return sequence_number


def send_service_bus_message(message):
    servicebus_client = ServiceBusClient.from_connection_string(
        conn_str=NAMESPACE_CONNECTION_STR, logging_enable=True)
    with servicebus_client:
        sender = servicebus_client.get_queue_sender(queue_name=QUEUE_NAME)
        with sender:
            sequence_number = schedule_single_message(sender, message)
            print("Single message is scheduled and sequence number is {}".format(
                sequence_number))
