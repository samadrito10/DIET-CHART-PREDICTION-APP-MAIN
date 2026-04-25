import requests

url = "http://127.0.0.1:5001/predict"

tests = [
    {"bmi": 18, "goal": "weight_gain", "activity": "low"},
    {"bmi": 24, "goal": "weight_loss", "activity": "medium"},
    {"bmi": 28, "goal": "weight_loss", "activity": "high"},
    {"bmi": 23, "goal": "muscle_gain", "activity": "high"},
]

for t in tests:
    res = requests.post(url, json=t)
    print(t, "=>", res.json())