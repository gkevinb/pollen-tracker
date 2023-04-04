from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import json_util
import json


MONGO_URI = "mongodb://localhost:27017/"

app = Flask(__name__)
CORS(app)

client = MongoClient(MONGO_URI)
db = client['pollen-db']

@app.route('/')
def get_data():
    collection = db['pollen']
    data = list(collection.find())
    print(data)
    return json.dumps(data, default=json_util.default, ensure_ascii=False)

if __name__ == '__main__':
    app.run(debug=True)