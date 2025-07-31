def get_itinerary_from_gpt(user_inputs):
    prompt = f"""
You are a helpful and creative travel planner.

The user has shared the following preferences:
- Destination: {user_inputs.get('destination')}
- Travel Details: {user_inputs.get('travel_details')}
- Budget & Group: {user_inputs.get('budget_and_group')}
- Interests & Activities: {user_inputs.get('interests')}
- Food Preferences: {user_inputs.get('food_preferences')}

🔹 Based on these preferences:
1. Suggest 4–5 culturally or thematically related recommendations (like movies, cities, places, or experiences).
2. Then, create a detailed one-day travel itinerary (morning to night) that incorporates those recommendations. Be specific with locations, activities, and moods.

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

