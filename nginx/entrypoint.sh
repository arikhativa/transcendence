#!/bin/bash

chown root:root /var/log/nginx/*
chmod 644 /var/log/nginx/*

exec "$@"
