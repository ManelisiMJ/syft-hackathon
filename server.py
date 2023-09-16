import json
import os
import requests
from flask import Flask, jsonify, render_template, request, send_from_directory
from flask_cors import CORS, cross_origin

if __name__ == "__main__":
    app = Flask(__name__)
    cors = CORS(app, resources={r"/*": {"origins": "*"}})
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 8080)))

@app.route('/', methods=['GET'])
def login():
    return render_template('login.html')