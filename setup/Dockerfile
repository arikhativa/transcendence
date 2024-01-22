FROM debian:bullseye-slim

RUN apt-get update 
RUN apt-get install -y curl

COPY conf/kibana /kibana
COPY conf/templates /templates
COPY conf/policies /policies
COPY conf/roles /roles

COPY tools/entrypoint.sh /entrypoint.sh
COPY tools/lib.sh /lib.sh

RUN chmod +x /entrypoint.sh
RUN chmod +x /lib.sh

ENTRYPOINT ["/entrypoint.sh"]
