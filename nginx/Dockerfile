FROM debian:buster

# Install nginx
RUN apt update 
RUN apt install nginx -y openssl
RUN apt update --fix-missing
RUN apt install curl -y

# Copy nginx config
COPY ./nginx.conf /etc/nginx/

# Create SSL pair
RUN mkdir -p /etc/nginx/ssl
RUN openssl req -newkey rsa:4096 -x509 -sha256 -days 365 -nodes \
       -out /etc/nginx/ssl/yrabby.crt \
       -keyout /etc/nginx/ssl/yrabby.key \
       -subj "/C=IL/ST=NORTH/L=haifa/O=42/OU=42madrid/CN=yrabby" 2>/dev/null

RUN chmod 600 /etc/nginx/ssl/yrabby.key /etc/nginx/ssl/yrabby.crt

WORKDIR /var/www/html

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]
