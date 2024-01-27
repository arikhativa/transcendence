

DC_FILE_DEV := docker-compose.yml
DC := docker compose -f $(DC_FILE_DEV)

# Mac does not use docker compose (only docker-compose)
unameOut := $(shell uname -s)
ifeq ($(unameOut), Darwin)
	DC := docker-compose -f $(DC_FILE_DEV)
endif

COMMON_VOLUME := .docker-volume-mnt/commonlog_data
ELASTIC_VOLUME := .docker-volume-mnt/elastic_data
POSTGRES_VOLUME := .docker-volume-mnt/postgres_data
GRAFANA_VOLUME := .docker-volume-mnt/grafana_data
PROMETHEUS_VOLUME := .docker-volume-mnt/prometheus_data
NGINX_VOLUME := .docker-volume-mnt/nginx-logs-data
VOLUMES := $(COMMON_VOLUME) $(ELASTIC_VOLUME) $(POSTGRES_VOLUME) $(GRAFANA_VOLUME) $(PROMETHEUS_VOLUME) $(NGINX_VOLUME)

.PHONY: all clean fclean re restart

all: $(VOLUMES) 
	$(DC) up -d --build

basic: $(VOLUMES) 
	$(DC) up -d --build nginx django postgres

elk: $(VOLUMES) 
	$(DC) up -d --build nginx django postgres elasticsearch logstash kibana setup

elk/re: $(VOLUMES) 
	$(DC) stop elasticsearch logstash kibana setup 
	$(DC) rm -f elasticsearch logstash kibana setup 
	rm -rf .docker-volume-mnt/elastic_data
	mkdir -p .docker-volume-mnt/elastic_data
	docker volume rm transcendence_elastic-data
	$(DC) up -d --build elasticsearch logstash setup kibana

clean:
	$(DC) down

fclean:
	$(DC) down --volumes --rmi local

re: clean all

restart: 
	$(DC) restart

# CI
ci/test:
	ci/is_up.sh

# Volumes
$(POSTGRES_VOLUME): 
	mkdir -p $@ 
$(PROMETHEUS_VOLUME): 
	mkdir -p $@ 
$(GRAFANA_VOLUME): 
	mkdir -p $@ 
$(COMMON_VOLUME): 
	mkdir -p $@ 
$(ELASTIC_VOLUME): 
	mkdir -p $@ 
$(NGINX_VOLUME): 
	mkdir -p $@ 

# TODO remove this
kibana/export/django:
	curl --insecure -X POST "https://localhost:5601/api/saved_objects/_export" -u "elastic:pass123123asdasd" -H 'kbn-xsrf: true' -H 'Content-Type: application/json' -d '{"objects": [{"type": "dashboard","id": "f1901610-9351-11ee-8b2f-752b243e3e50"}],"includeReferencesDeep": true}'
