"""
ASGI config for backendtutorhub project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import message_service
import message_service.routing


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backendtutorhub.settings') 

# Get Django's ASGI application for handling HTTP requests
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    # Standard Django HTTP handling
    "http": django_asgi_app,

    # WebSocket handling
    "websocket": AuthMiddlewareStack( # Adds authenticated user to scope
        URLRouter(
            message_service.routing.websocket_urlpatterns # Point to your app's WS urls
        )
    ),
})