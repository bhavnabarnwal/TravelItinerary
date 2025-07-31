import requests
import json

class QlooInsightFetcher:
    def __init__(self, api_key):
        self.api_key = api_key
        self.headers = {
            "X-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }

    def get_entity_id(self, query):
        search_url = "https://hackathon.api.qloo.com/search"
        params = {"query": query}
        response = requests.get(search_url, headers=self.headers, params=params)
        results = response.json().get("results", [])
        if results:
            return results[0]["entity_id"]
        else:
            print(f"No results found for {query}")
            return None

    def fetch_insights(self, preferences_list):
        
        person_query, place_query = preferences_list

        person_id = self.get_entity_id(person_query)
        place_id = self.get_entity_id(place_query)

        print(f"\n🎤 {person_query} ID: {person_id}")
        print(f"📍 {place_query} ID: {place_id}")

        if person_id and place_id:
            insights_url = (
                f"https://hackathon.api.qloo.com/v2/insights"
                f"?filter.type=urn:entity:place"
                f"&signal.interests.entities={place_id},{person_id}"
                f"&explain=true"
            )

            print(f"\nRequest URL: {insights_url}")
            response = requests.get(insights_url, headers=self.headers)

            if response.status_code == 200:
                try:
                    data = response.json()
                    insights = data.get('results', {}).get('entities', [])
                    
                    # Filter only those with popularity > 0.80
                    high_popularity_insights = []
                    for item in insights:
                        if item.get('popularity', 0) > 0.80:
                            high_popularity_insights.append({
                                "name": item.get("name"),
                                "type": item.get("type")
                            })

                    return high_popularity_insights
                except ValueError:
                    print("❌ Failed to parse JSON.")
                    return []
            else:
                print("❌ Error:", response.status_code)
                return []
