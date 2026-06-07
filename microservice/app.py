from flask import Flask, jsonify, request
import requests, os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

API_KEY = os.getenv("OPENWEATHER_API_KEY")

@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Microservice is running!", "api_key_set": bool(API_KEY)})

@app.route("/weather", methods=["GET"])
def get_weather():
    suburb = request.args.get("suburb", "Auckland")
    url = f"https://api.openweathermap.org/data/2.5/weather?q={suburb},NZ&appid={API_KEY}&units=metric"
    res = requests.get(url).json()

    if "weather" not in res:
        return jsonify({
            "suburb": suburb,
            "condition": "clear",
            "description": "sunny",
            "temp_c": 18,
            "note": f"API error: {res.get('message', 'unknown')}"
        })

    return jsonify({
        "suburb": suburb,
        "condition": res["weather"][0]["main"].lower(),
        "description": res["weather"][0]["description"],
        "temp_c": res["main"]["temp"],
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)