
FROM python:3.9-slim-buster


WORKDIR /Projet-M1


COPY requirements.txt .


RUN pip install -r requirements.txt


COPY . .


EXPOSE 8050

CMD ["python3", "flask_api.py"]

