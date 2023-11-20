#!/bin/bash


# Wait for Postgres to start
while ! pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT; do
    echo "Waiting for Postgres to start..."
    sleep 1
done

# Install venv if needed
if [ ! -d "/home/.venv" ]; then
    echo "Installing venv..."
    python3 -m venv /home/.venv
fi
python3 -m pip install -r /home/requirements.txt


# Init Postgres
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py loaddata data.json

exec "$@"
