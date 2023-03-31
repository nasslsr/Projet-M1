from flask import Flask, jsonify
from flask_pymongo import PyMongo
from collect_data import collect_and_merge_data

app = Flask(__name__)

# Configuration de l'application Flask pour utiliser la base de données MongoDB
app.config["MONGO_URI"] = "mongodb://localhost:27017/azerty"
mongo = PyMongo(app)

# Définition d'une route pour récupérer toutes les données dans la collection MongoDB
@app.route("/velib_api_data", methods=["GET"])
def get_data():
    dictionnary = collect_and_merge_data()
    for i in mongo.db.bled.find():
        i.pop("_id")  # Supprimez l'ID de MongoDB des données de sortie
        dictionnary.append(i)
    return jsonify(dictionnary)

# Définition d'une route pour réinitialiser les données dans la collection MongoDB

if __name__ == "__main__":
    app.run(debug=True)

