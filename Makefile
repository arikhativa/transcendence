
DC_FILE_PROD := docker-compose-prod.yml
DC_FILE_DEV := docker-compose.yml

DC := docker compose -f $(DC_FILE_DEV)
DX := docker exec 

PY := python
PIP := pip
DJ := $(PY) manage.py 

DB_HOST := postgres-dev
DJANGO_HOST := django-dev

POSTGRES_VOLUME := .docker-volume-mnt/postgres_data
GRAFANA_VOLUME := .docker-volume-mnt/grafana_data
PROMETHEUS_VOLUME := .docker-volume-mnt/prometheus_data
CI_DIR := ci

.PHONY: all clear fclear re restart

all: $(GRAFANA_VOLUME) $(POSTGRES_VOLUME) $(PROMETHEUS_VOLUME)
	$(DC) up -d --build

clear:
	$(DC) down

fclear:
	$(DC) down --volumes --rmi local

re: clear all

restart: 
	$(DC) restart

# Volumes
$(POSTGRES_VOLUME): 
	mkdir -p $@ 
$(PROMETHEUS_VOLUME): 
	mkdir -p $@ 
$(GRAFANA_VOLUME): 
	mkdir -p $@ 

# Python
py/dep:
	$(DX) $(DJANGO_HOST) $(PIP) install -r requirements.txt

# Migration
db: db/gen db/migration

db/migration:
	$(DX) $(DJANGO_HOST) $(DJ) migrate  --noinput

db/gen:
	$(DX) $(DJANGO_HOST) $(DJ) makemigrations  --noinput

db/export:
	$(DX) $(DJANGO_HOST) $(DJ) dumpdata --output=data.json

db/import:
	$(DX) $(DJANGO_HOST) $(DJ) loaddata data.json

# Enter Container
dj/enter:
	$(DX) -it $(DJANGO_HOST) bash

db/enter:
	$(DX) -it $(DB_HOST) bash

# CI
ci/test:
	$(CI_DIR)/is_up.sh
