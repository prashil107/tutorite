# messages/consumers.py

import json
from channels.generic.websocket import JsonWebsocketConsumer
from asgiref.sync import async_to_sync
# from django.contrib.auth import get_user_model
from .models import Message
from users_service.models import User


class ChatConsumer(JsonWebsocketConsumer):

    def connect(self):
        # --- TEMPORARILY COMMENT OUT FOR WEBSOCAT TESTING ---
        # Ensure the user is authenticated
        if not self.scope["user"].is_authenticated:
            print("WebSocket connection rejected: User not authenticated")
            self.close() # Close the connection if not authenticated
            return
        # --- END TEMPORARY CHANGE ---

        # IMPORTANT: When you remove the auth check, you won't have self.user available directly.
        # For testing the connection itself, you might hardcode a test user or skip saving messages for now.
        # A better temporary approach is to allow anonymous connections but print a warning:

        self.user = self.scope["user"] # Get the user (might be AnonymousUser)
        if not self.user.is_authenticated:
             print("WARNING: Anonymous user connected to WebSocket!")
             # If you want to block anonymous *messaging*, you'll need checks in receive_json too.
             # For now, let's just allow the connection for testing.
             # If you really need a user object for group name, you'll need the auth check enabled
             # and test via browser or authenticated client. Let's stick to testing auth bypass first.
             # For basic connection test, we can skip setting room_group_name here if user is anonymous.
             # Or, let's test with auth enabled, but using a browser.


        self.user = self.scope["user"] # The authenticated user is the sender
        self.other_user_identifier= self.scope['url_route']['kwargs']['username']

        try:
            self.other_user = User.objects.get(pk=self.other_user_identifier)
        except User.DoesNotExist:
            self.close() # Close if the recipient user doesn't exist
            return

        self.user = self.scope["user"] # The authenticated user is the sender

        # Determine the group name for this chat pair.
        # Use sorted IDs to ensure consistent group name regardless of who initiates.
        user_pks = sorted([str(self.user.pk), str(self.other_user.pk)]) # Ensure they are strings and sort
        self.room_group_name = f'chat_{user_pks[0]}_{user_pks[1]}'

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()
        print(f"WebSocket connected: {self.user.username} chatting with {self.other_user.username}")

    def disconnect(self, close_code):
        # Leave room group
        if hasattr(self, 'room_group_name'):
            async_to_sync(self.channel_layer.group_discard)(
                self.room_group_name,
                self.channel_name
            )
        print(f"WebSocket disconnected: {self.scope['user'].username if self.scope['user'].is_authenticated else 'Anonymous'}")


    # Receive message from WebSocket
    def receive_json(self, content):
        # Ensure the user is authenticated and the connection was properly established
        if not self.scope["user"].is_authenticated or not hasattr(self, 'other_user'):
            print("Received message from unauthenticated or improperly connected user.")
            # return temperaroy

        # Expected message format: {'type': 'chat_message', 'message': '...', 'receiver_id': ...}
        # We get receiver_id from the URL, so client just needs to send type and message
        message_type = content.get('type')
        message_text = content.get('message')

        if message_type == 'chat_message' and message_text is not None:
            sender = self.user
            receiver = self.other_user

            # Save the message to the database
            message = Message.objects.create(
                sender=sender,
                receiver=receiver,
                content=message_text
            )
            print(f"Message saved: {message.id}")

            # Send message to room group (including the sender's channel)
            # The `chat.message` type will be handled by the `chat_message` method below
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat.message', # Calls the chat_message method
                    'message': message.to_dict(), # Send the message data as a dictionary
                }
            )
        else:
            print(f"Received unknown message format: {content}")


    # Receive message from room group (called by channel layer)
    def chat_message(self, event):
        # Send message over the WebSocket to the client
        message_data = event['message']
        self.send_json(message_data)
        print(f"Message sent over WebSocket: {message_data.get('content')}")