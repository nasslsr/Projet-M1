from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    return 'Web app with Python Flask'

@app.route('/get_all_stations_position')
def station_position():
    print("")
    return [




    ]

app.run(host='0.0.0.0',port=81)