

DC_FILE_DEV := docker-compose.yml
DC := docker compose -f $(DC_FILE_DEV)

# Mac does not use docker compose (only docker-compose)
unameOut := $(shell uname -s)
ifeq ($(unameOut), Darwin)
	DC := docker-compose -f $(DC_FILE_DEV)
endif

COMMON_VOLUME := ${HOME}/data/commonlog_data
ELASTIC_VOLUME := ${HOME}/data/elastic_data
POSTGRES_VOLUME := ${HOME}/data/postgres_data
GRAFANA_VOLUME := ${HOME}/data/grafana_data
PROMETHEUS_VOLUME := ${HOME}/data/prometheus_data
NGINX_VOLUME := ${HOME}/data/nginx-logs-data
VOLUMES := $(COMMON_VOLUME) $(ELASTIC_VOLUME) $(POSTGRES_VOLUME) $(GRAFANA_VOLUME) $(PROMETHEUS_VOLUME) $(NGINX_VOLUME)

.PHONY: all clean fclean re restart

all: $(VOLUMES) 
	$(DC) up -d --build

basic: $(VOLUMES) 
	$(DC) up -d --build nginx django postgres


volumes: $(VOLUMES)

elk: $(VOLUMES) 
	$(DC) up -d --build nginx django postgres elasticsearch logstash kibana setup

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
