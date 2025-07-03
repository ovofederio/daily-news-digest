from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)

GNEWS_API_KEY = os.getenv("GNEWS_API_KEY")
BASE_URL = "https://gnews.io/api/v4/top-headlines"

@app.route("/api/news")
def get_news():
    topic = request.args.get("topic", "general")
    params = {
        "token": GNEWS_API_KEY,
        "lang": "en",
        "topic": topic,
        "max": 10
    }
    response = requests.get(BASE_URL, params=params)
    data = response.json()
    headlines = []
    for article in data.get("articles", []):
        headlines.append({
            "title": article["title"],
            "summary": article["description"],
            "url": article["url"]
        })
    return jsonify({"headlines": headlines})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
