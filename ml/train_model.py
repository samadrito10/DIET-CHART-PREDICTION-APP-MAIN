import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Load dataset
df = pd.read_csv("diet_data.csv")

# Encode text → numbers
le_goal = LabelEncoder()
le_activity = LabelEncoder()
le_plan = LabelEncoder()

df["goal"] = le_goal.fit_transform(df["goal"])
df["activity"] = le_activity.fit_transform(df["activity"])
df["plan"] = le_plan.fit_transform(df["plan"])

# Features & target
X = df[["bmi", "goal", "activity"]]
y = df["plan"]

# Train model
model = RandomForestClassifier()
model.fit(X, y)

# Save model
joblib.dump(model, "model.pkl")
joblib.dump(le_goal, "le_goal.pkl")
joblib.dump(le_activity, "le_activity.pkl")
joblib.dump(le_plan, "le_plan.pkl")

print("✅ Model trained successfully")