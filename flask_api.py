from flask import Flask, jsonify
from flask_pymongo import PyMongo
from collect_data import collect_and_merge_data

app = Flask(__name__)


app.config["MONGO_URI"] = "mongodb://localhost:27017/Velib"
mongo = PyMongo(app)


@app.route("/velib_api_data", methods=["GET"])
def get_data():
    dictionnary = collect_and_merge_data()
    for i in mongo.db.Data.find():
        i.pop("_id")  # Supprimez l'ID de MongoDB des données de sortie
        dictionnary.append(i)
    return jsonify(dictionnary)



if __name__ == "__main__":
    app.run(debug=True)

