
FROM debian:bookworm

RUN apt update -y
RUN apt install -y \
	npm \
	curl

# RUN  rm -rf /var/lib/apt/lists/*

RUN groupadd -r nestjs && useradd -r -g nestjs nestjs

RUN mkdir -p /home/nestjs/.npm-global
RUN npm config set prefix '/home/nestjs/.npm-global'
RUN echo "export PATH=/home/nestjs/.npm-global/bin:$PATH"  >> /home/nestjs/.bashrc 
RUN npm i -g @nestjs/cli

RUN mkdir -p /home/nestjs/app
WORKDIR /home/nestjs/app

RUN chown -R nestjs:nestjs /home/nestjs/.npm-global

USER nestjs

CMD npm run start:debug
