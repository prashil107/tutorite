Installing django 
pip install Django
pip install psycopg2-binary
psycopg2, which is the PostgreSQL adapter for Python

creating django porject 
django-admin startproject backendtutorhub


Configure Database Connection

before that installing postgresql
sudo apt update
sudo apt install postgresql postgresql-contrib

access the postgresql 

sudo -u postgres psql

creating database and user for django

postgres=# CREATE DATABASE mytutoringhubdb;
postgres-# CREATE USER gautam WITH PASSWORD '0penmypsql';
postgres-# GRANT ALL PRIVILEGES ON DATABASE mytutoringhubdb TO  gautam;
postgres-# \q

```

setting up the db

# backendtutorhub/settings.py

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mytutoringdb',       # Replace with your PostgreSQL database name
        'USER': 'gautam',   # Replace with your PostgreSQL username
        'PASSWORD': '0penmypsql',   # Replace with your PostgreSQL password
        'HOST': 'localhost',        # Or the hostname/IP of your PostgreSQL server
        'PORT': '',                 # Leave empty for default port (5432)
    }
}

```



Created a admin user 
user - admin_user
pass - 0pendhruv
email- dhruvastro67@gmail.com


Setup 
users_service
install drf

setup course
setup course reg  table M2m

setup  authentication for users get a token
install pip install djangorestframework-simplejwt


Creating message service

using django channels, redis, daphane as asgi server


Implemented CORS (Cross-Origin Resource Sharing)

# Install django-cors-headers
pip install django-cors-headers

# Add to INSTALLED_APPS in settings.py
INSTALLED_APPS = [
    ...
    'corsheaders',
]

# Add middleware in settings.py
MIDDLEWARE = [
    ...
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

# Configure CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React frontend
]

CORS_ALLOW_CREDENTIALS = True

filtering
pip install django-filter


INSTALLED_APPS = [
    ...
    'django_filters',
]

REST_FRAMEWORK = {
    ...
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
}


