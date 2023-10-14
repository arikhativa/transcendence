
DC_FILE_PROD := docker-compose-prod.yml
DC_FILE_DEV := docker-compose.yml

DE := docker exec
DC := docker compose -f $(DC_FILE_DEV)

NEST := nestjs-dev
PRISMA := npx prisma

all:
	$(DC) up -d --build

clear:
	$(DC) down

fclear:
	$(DC) down --volumes --rmi local

re: clear all

restart: 
	$(DC) restart

db/migration:
	$(DE) $(NEST) $(PRISMA) migrate dev

db/gen:
	$(DE) $(NEST) $(PRISMA) generate

db/site:
	$(DE) $(NEST) $(PRISMA) studio

.PHONY: all clear fclear re restart
