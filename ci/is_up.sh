#$!/bin/bash

tries=0
while ! curl --insecure -o /dev/null https://localhost; do
    echo "Waiting for Django to start..."
    sleep 1
    tries=$((tries+1))
    if [ $tries -gt 30 ]; then
        echo "Django failed to start"
        exit 1
    fi
done
