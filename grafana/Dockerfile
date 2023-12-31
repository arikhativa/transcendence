FROM grafana/grafana:10.2.1

COPY dashboards /etc/grafana/custom-dashboards
COPY main.yaml /etc/grafana/provisioning/dashboards/main.yaml
COPY datasources.yml /etc/grafana/provisioning/datasources/datasources.yml

ENTRYPOINT /run.sh
