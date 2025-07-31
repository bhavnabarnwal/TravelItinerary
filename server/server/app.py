from dotenv import load_dotenv
import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from qloo import QlooInsightFetcher

# Load keys from .env
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
QLOO_API_KEY = os.getenv("QLOO_API_KEY")

app = Flask(__name__)
CORS(app)

# ---------------------- Qloo Recommendations ----------------------


# ---------------------- GPT Itinerary Generator ----------------------
def get_itinerary_from_gpt(user_inputs, qloo_recommendations):
    qloo_places = [item["name"] for item in qloo_recommendations]

    prompt = f"""
You are a travel expert and itinerary planner AI. A user has provided the following personality preferences:
{user_inputs}

Based on these preferences, Qloo API has recommended the following places in their travel destination:
{qloo_places}

Now, generate a one-day personalized travel itinerary for this user in a creative and user-friendly format, explaining why each place matches their personality.


Use friendly, engaging language, and format the output nicely.
"""

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "You are a helpful travel planner that gives cultural recommendations and personalized itineraries."},
            {"role": "user", "content": prompt}
        ]
    }

    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
        print("GPT Raw Response JSON:", response.json())
        result = response.json()
        return result['choices'][0]['message']['content']
    except Exception as e:
        print("GPT API Error:", e)
        return "Sorry, GPT could not generate the itinerary and recommendations."


# ---------------------- Flask Route ----------------------

@app.route('/get-itinerary', methods=['POST'])
def generate_itinerary():
    data = request.json.get("answers", {})
    #data = request.get_json()
    user_answers = data.get('answers')


    preferences = [user_answers.get('movie'), user_answers.get('genre'), user_answers.get('destination')]  # user inputs
    fetcher = QlooInsightFetcher("BBnY42HdsiHgkMPNbb4yFGhCmCR5bhfpshIbh-zEdBk")
    qloo_response = fetcher.fetch_insights(preferences)
    
    gpt_response = get_itinerary_from_gpt(user_answers, qloo_response)

    return jsonify({
        "itinerary": gpt_response,
        "qloo": qloo_response
    })
# ---------------------- Main ----------------------

if __name__ == "__main__":
    app.run(debug=True)
