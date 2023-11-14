#$!/bin/bash

tries=0
# Wait for Postgres to start
while ! pg_isready -h localhost -p 5432; do
    echo "Waiting for Postgres to start..."
    sleep 1
    tries=$((tries+1))
    if [ $tries -gt 30 ]; then
        echo "Postgres failed to start"
        exit 1
    fi
done

tries=0
while ! curl --insecure -o /dev/null https://localhost:8000; do
    echo "Waiting for Django to start..."
    sleep 1
    tries=$((tries+1))
    if [ $tries -gt 30 ]; then
        echo "Django failed to start"
        exit 1
    fi
done
