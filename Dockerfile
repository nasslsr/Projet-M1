# Image de base
FROM python:3.9-slim-buster

# Définit le répertoire de travail
WORKDIR /Projet-M1
#'Projet-M1' nom du fichier ou il ya tout les documents du projets réuni

# Copie le fichier requirements.txt dans l'image
COPY requirements.txt .

# Installe les dépendances
RUN pip install -r requirements.txt

# Copie tous les fichiers de l'application
COPY . .

# Expose le port 5000
EXPOSE 8080

# Commande pour exécuter l'application
CMD ["python3", "flask_api.py"]
#'flask_api.py' nom du fichier ou ya le flask
