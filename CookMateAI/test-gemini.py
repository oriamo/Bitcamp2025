# Python script to test Google Gemini API
import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv('GEMINI_API_KEY')
print(f"API Key available: {bool(api_key)}")
print(f"API Key length: {len(api_key) if api_key else 0}")

# Test direct API access
url = f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key={api_key}"
headers = {"Content-Type": "application/json"}
data = {
    "contents": [
        {
            "parts": [
                {"text": "Write a short greeting."}
            ]
        }
    ]
}

print("Making API request...")
try:
    response = requests.post(url, headers=headers, json=data)
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("API access successful!")
    else:
        print("API access failed.")
except Exception as e:
    print(f"Error: {e}")