
FROM python:3.11.7-slim-bullseye

# install python
RUN apt-get update
RUN apt-get install -y postgresql-client
# RUN apt-get install -y python3.11
# RUN apt-get install -y python3.11-venv
RUN apt-get install -y python3-pip

# Utils
RUN apt-get install -y vim
RUN apt-get install -y curl
RUN apt-get install -y gettext

# Enable venv
ENV PATH="/home/.venv/bin:$PATH"

WORKDIR /home

EXPOSE 8000

COPY install_python_dep.sh /tmp/install_python_dep.sh
RUN chmod +x /tmp/install_python_dep.sh
ENTRYPOINT [ "/tmp/install_python_dep.sh" ]

CMD python3 manage.py runserver 0.0.0.0:8000
