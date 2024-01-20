
FROM python:3.11.7-slim-bullseye

# install Utils
RUN apt-get update
RUN apt-get install -y postgresql-client

# install python
RUN python3 -m venv /home/.venv
# Enable venv
ENV PATH="/home/.venv/bin:$PATH"
COPY requirements.txt /home/requirements.txt
RUN python3 -m pip install -r /home/requirements.txt

WORKDIR /home

EXPOSE 8000

COPY run_basic_migrations.sh /tmp/run_basic_migrations.sh
RUN chmod +x /tmp/run_basic_migrations.sh
ENTRYPOINT [ "/tmp/run_basic_migrations.sh" ]

CMD python3 manage.py runserver 0.0.0.0:8000
