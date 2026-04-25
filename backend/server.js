const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();


app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working ✅");
});

app.post("/predict", async (req, res) => {
  try {
    const { bmi, goal, activity } = req.body;

    let category = "";

    // ✅ FIX: Proper BMI category
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    let dietPlan = {
      breakfast: "Loading...",
      lunch: "Loading...",
      dinner: "Loading...",
      snacks: "Loading...",
      calories: "2000 kcal",
      protein: "60g"
    };

    // CALL ML API
    const mlRes = await axios.post("http://127.0.0.1:5001/predict", {
      bmi,
      goal,
      activity,
    });

    const planType = mlRes?.data?.plan;

    // 
    //  DIET LOGIC
    // 

    if (planType === "protein_rich") {
      dietPlan = {
        breakfast: "Eggs + Milk + Banana",
        lunch: "Chicken + Rice + Veggies",
        dinner: "Paneer + Chapati",
        snacks: "Protein shake + Nuts",
        calories: "2500 kcal",
        protein: "120g"
      };
    } 
    else if (planType === "low_calorie") {
      dietPlan = {
        breakfast: "Oats + Fruits",
        lunch: "Brown Rice + Veggies",
        dinner: "Soup + Salad",
        snacks: "Nuts",
        calories: "1500 kcal",
        protein: "50g"
      };
    } 
    else if (planType === "high_calorie") {
      dietPlan = {
        breakfast: "Peanut Butter Toast + Shake",
        lunch: "Rice + Dal + Paneer",
        dinner: "Chapati + Sabzi",
        snacks: "Dry Fruits",
        calories: "2800 kcal",
        protein: "90g"
      };
    } 
    else {
      dietPlan = {
        breakfast: "Balanced Breakfast",
        lunch: "Balanced Lunch",
        dinner: "Light Dinner",
        snacks: "Fruits",
        calories: "2000 kcal",
        protein: "60g"
      };
    }

    // 
    // ACTIVITY ADJUSTMENT
    // 

    if (activity === "high") {
      dietPlan.snacks += " + Extra Protein";
      dietPlan.calories =
        (parseInt(dietPlan.calories) + 300) + " kcal";
    } 
    else if (activity === "low") {
      dietPlan.dinner += " (Light Meal)";
      dietPlan.calories =
        (parseInt(dietPlan.calories) - 200) + " kcal";
    }

    // 🔍 DEBUG (optional)
    console.log("FINAL RESPONSE:", { category, dietPlan });

    //
    // ✅ FINAL RESPONSE
    // 

    res.json({
      category,
      dietPlan
    });

  } catch (err) {
    console.error("ML Error:", err.message);

    res.json({
      category: "Error",
      dietPlan: {
        breakfast: "Unavailable",
        lunch: "Unavailable",
        dinner: "Unavailable",
        snacks: "Unavailable",
        calories: "0 kcal",
        protein: "0g"
      }
    });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});