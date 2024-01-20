
FROM python:3.11.7-slim-bullseye

# install Utils
RUN apt-get update
RUN apt-get install -y postgresql-client


# TODO Add this copy and remove the dc volume
# COPY src /home/

COPY conf /etc/django
RUN chmod +x /etc/django/run_basic_migrations.sh

# install python
RUN python3 -m venv /etc/django/.venv
# Enable venv
ENV PATH="/etc/django/.venv/bin:$PATH"
RUN python3 -m pip install -r /etc/django/requirements.txt

WORKDIR /home

EXPOSE 8000

ENTRYPOINT [ "/etc/django/run_basic_migrations.sh" ]

CMD python3 manage.py runserver 0.0.0.0:8000
