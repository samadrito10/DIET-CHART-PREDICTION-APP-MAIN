from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# ✅ Load model and encoders
model = joblib.load("model.pkl")
le_goal = joblib.load("le_goal.pkl")
le_activity = joblib.load("le_activity.pkl")
le_plan = joblib.load("le_plan.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        bmi = float(data["bmi"])
        goal = le_goal.transform([data["goal"]])[0]
        activity = le_activity.transform([data["activity"]])[0]

        prediction = model.predict([[bmi, goal, activity]])[0]
        plan = le_plan.inverse_transform([prediction])[0]

        return jsonify({"plan": plan})

    except Exception as e:
        print("Error:", e)
        return jsonify({"plan": "error"})

# ✅ Run server
if __name__ == "__main__":
    app.run(port=5001)