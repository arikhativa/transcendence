
DC_FILE_PROD := docker-compose-prod.yml
DC_FILE_DEV := docker-compose.yml

DC := docker compose -f $(DC_FILE_DEV)

all:
	$(DC) up -d --build

clear:
	$(DC) down

fclear:
	$(DC) down --volumes --rmi local

re: clear all

restart: 
	$(DC) restart

.PHONY: all clear fclear re restart
