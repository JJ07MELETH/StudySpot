from flask import Flask, jsonify, request
import requests, os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

API_KEY = os.getenv("OPENWEATHER_API_KEY")

@app.route("/weather", methods=["GET"])
def get_weather():
    suburb = request.args.get("suburb", "Auckland")
    url = f"https://api.openweathermap.org/data/2.5/weather?q={suburb},NZ&appid={API_KEY}&units=metric"
    res = requests.get(url).json()
    return jsonify({
        "suburb": suburb,
        "condition": res["weather"][0]["main"].lower(),
        "description": res["weather"][0]["description"],
        "temp_c": res["main"]["temp"],
    })

if __name__ == "__main__":
    app.run(port=5001, debug=True)