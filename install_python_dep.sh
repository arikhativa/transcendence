#!/bin/bash


# Wait for Postgres to start
while ! pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT; do
    echo "Waiting for Postgres to start..."
    sleep 1
done


# Install Python dependencies
stall oauthlib
pip install requests
pip install requests-oauthlib




# Init Postgres
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py loaddata data.json

exec "$@"
