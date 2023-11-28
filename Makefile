
DC_FILE_PROD := docker-compose-prod.yml
DC_FILE_DEV := docker-compose.yml

DC := docker compose -f $(DC_FILE_DEV)
DX := docker exec 
UP := up -d --build

PY := python
PIP := pip
DJ := $(PY) manage.py 

DB_HOST := postgres-dev
DJANGO_HOST := django-dev

POSTGRES_VOLUME := .docker-volume-mnt/postgres_data
GRAFANA_VOLUME := .docker-volume-mnt/grafana_data
PROMETHEUS_VOLUME := .docker-volume-mnt/prometheus_data
CI_DIR := ci

ELK_CONTAINERS := elasticsearch logstash kibana elasticsearch-setup postgres django

.PHONY: all clear fclear re restart

all: $(GRAFANA_VOLUME) $(POSTGRES_VOLUME) $(PROMETHEUS_VOLUME)
	$(DC) $(UP)

basic: $(POSTGRES_VOLUME)
	$(DC) $(UP) postgres django
	
elk:
	$(DC) $(UP) $(ELK_CONTAINERS)

elk/basic:
	$(DC) $(UP) elasticsearch logstash kibana elasticsearch-setup

elk/re: 
	$(DC) down $(ELK_CONTAINERS)
	$(DC) $(UP) $(ELK_CONTAINERS)

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
	$(DX) $(DJANGO_HOST) $(DJ) migrate

db/gen:
	$(DX) $(DJANGO_HOST) $(DJ) makemigrations

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


# TODO Remove this!
kibana/export:
	curl -X POST "localhost:5601/api/saved_objects/_export" -u "elastic:pass123123asdasd" -H 'kbn-xsrf: true' -H 'Content-Type: application/json' -d '{"objects": [{"type": "dashboard","id": "f1901610-9351-11ee-8b2f-752b243e3e50"}],"includeReferencesDeep": true}'
