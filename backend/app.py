from flask import Flask, jsonify, request
from flask_cors import CORS
import requests, os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

MICROSERVICE_URL = os.getenv("MICROSERVICE_URL", "http://localhost:5001")

@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Backend is running!", "microservice": MICROSERVICE_URL})

@app.route("/api/spots", methods=["GET"])
def get_spots():
    suburb = request.args.get("suburb", "Auckland")
    spots = [
        {"name": "Auckland Central Library", "type": "library", "address": f"{suburb} CBD"},
        {"name": "Starbucks Study Corner", "type": "cafe", "address": f"{suburb} High St"},
        {"name": "Victoria Park", "type": "park", "address": f"{suburb}"},
    ]
    return jsonify(spots)

@app.route("/api/recommend", methods=["GET"])
def recommend():
    suburb = request.args.get("suburb", "Auckland")
    weather = requests.get(f"{MICROSERVICE_URL}/weather?suburb={suburb}").json()
    condition = weather.get("condition", "clear")
    if condition in ["rain", "drizzle", "thunderstorm"]:
        spot_type = "library"
        reason = "It's raining — best to stay indoors!"
    elif condition == "clear":
        spot_type = "park"
        reason = "Beautiful day — grab a spot outside!"
    else:
        spot_type = "cafe"
        reason = "Cloudy but fine — a café is perfect."
    return jsonify({"suburb": suburb, "recommended_type": spot_type, "reason": reason, "weather": weather})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)