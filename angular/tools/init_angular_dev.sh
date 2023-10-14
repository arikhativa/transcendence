#!/bin/bash

# Run Angular dev server
npm run start &

exec "$@"
 