# messages/models.py

from django.db import models
from django.conf import settings # Using settings.AUTH_USER_MODEL is best practice
from users_service.models import User

class Message(models.Model):
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    receiver = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='received_messages'
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    # read_at = models.DateTimeField(null=True, blank=True) # Optional: for read receipts

    class Meta:
        ordering = ['timestamp'] # Order messages chronologically

    def __str__(self):
        return f"From {self.sender.username} to {self.receiver.username} at {self.timestamp.strftime('%Y-%m-%d %H:%M')}"

    def to_dict(self):
        """Converts message instance to dictionary for JSON serialization."""
        return {
            'sender': self.sender.username, # Or self.sender.id
            'receiver': self.receiver.username, # Or self.receiver.id
            'content': self.content,
            'timestamp': self.timestamp.isoformat(), # Use ISO format for easy parsing
        }