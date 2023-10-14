
FROM debian:bookworm

RUN apt update -y
RUN apt install -y \
	npm \
	nginx \
	openssl \
	curl

# Remove redandent files
# RUN apt-get clean && \
#     rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Set Logs
RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log

# Create angular user
RUN groupadd -r angular && useradd -r -g angular angular

# Setup angular home dir with npm global
RUN mkdir -p /home/angular/.npm-global
RUN npm config set prefix '/home/angular/.npm-global'
RUN echo "export PATH=/home/angular/.npm-global/bin:$PATH" >> /home/angular/.bashrc 

# Install angular cli
RUN npm i -g @angular/cli

# Give angular user ownership of home dir
RUN chown -R angular:angular /home/angular/.npm-global

WORKDIR /home/angular/app
EXPOSE 80

# Script that will start ng server with watch for dev
COPY ./tools/init_angular_dev.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/init_angular_dev.sh
RUN chown -R angular:angular /usr/local/bin/init_angular_dev.sh

ENTRYPOINT [ "/usr/local/bin/init_angular_dev.sh" ]

# TODO this will not work in dev, only in prod
# USER angular

CMD ["nginx", "-c", "/home/angular/app/conf/nginx.conf", "-g", "daemon off;"]
