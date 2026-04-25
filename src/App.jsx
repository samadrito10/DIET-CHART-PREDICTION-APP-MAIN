import { useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    goal: "",
    activity: "",
  });

  const [bmi, setBmi] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

const proteinValue = result?.dietPlan?.protein
  ? Number(result.dietPlan.protein.replace(/\D/g, ""))
  : 0;

const calorieValue = result?.dietPlan?.calories
  ? Number(result.dietPlan.calories.replace(/\D/g, ""))
  : 0;

const proteinPercent = Math.min((proteinValue / 150) * 100, 100);
const caloriePercent = Math.min((calorieValue / 3000) * 100, 100);

console.log("Protein %:", proteinPercent);
console.log("Calorie %:", caloriePercent);



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateBMI = () => {
    const h = formData.height / 100;
    if (!h || !formData.weight) return null;

    const bmiValue = parseFloat(
      (formData.weight / (h * h)).toFixed(2)
    );

    setBmi(bmiValue);
    return bmiValue;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Validation
  if (
    !formData.name ||
    !formData.age ||
    !formData.height ||
    !formData.weight ||
    !formData.goal ||
    !formData.activity
  ) {
    alert("Please fill all fields");
    return;
  }

  const bmiValue = calculateBMI();
  if (!bmiValue) {
    alert("Please enter valid height & weight");
    return;
  }

  try {
    setLoading(true);
    setResult(null); // ✅ CLEAR OLD RESULT (IMPORTANT)

    const res = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, bmi: bmiValue }),
    });

    // ✅ Check response status
    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();

    console.log("API Response:", data); // ✅ DEBUG (see what's coming)

    // ✅ Validate response structure
    if (data && data.dietPlan) {
      setResult(data);
    } else {
      alert("Invalid response from server ❌");
    }

  } catch (error) {
    console.error(error);
    alert("Backend not connected ❌");
  } finally {
    setLoading(false);
  }
};
// console.log("Result:", result); // ✅ DEBUG

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden text-white px-4">

      {/* Glow Background */}
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-30 top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-30 bottom-10 right-10"></div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] p-8"
      >

        <h1 className="text-3xl font-bold text-center mb-6">
           Diet Chart Predictor
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          {/* Name */}
          <input
            name="name"
            value={formData.name}
            placeholder="Enter your name"
            onChange={handleChange}
            className="col-span-2 input"
          />

          {/* Age */}
          <input
            name="age"
            value={formData.age}
            placeholder="Age"
            onChange={handleChange}
            className="input"
          />

          {/* Height */}
          <input
            name="height"
            value={formData.height}
            placeholder="Height (cm)"
            onChange={handleChange}
            className="input"
          />

          {/* Weight */}
          <input
            name="weight"
            value={formData.weight}
            placeholder="Weight (kg)"
            onChange={handleChange}
            className="input"
          />

          {/* Goal */}
          <select
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className="input"
          >
            <option value="" className="text-black">Select Goal</option>
            <option value="weight_loss" className="text-black">Weight Loss</option>
            <option value="muscle_gain" className="text-black">Muscle Gain</option>
          </select>

          {/* Activity */}
          <select
            name="activity"
            value={formData.activity}
            onChange={handleChange}
            className="col-span-2 input"
          >
            <option value="" className="text-black">Activity Level</option>
            <option value="low" className="text-black">Low</option>
            <option value="medium" className="text-black">Medium</option>
            <option value="high" className="text-black">High</option>
          </select>

          {/* Button */}
          <button className="col-span-2 bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-semibold transition">
            {loading ? "Generating..." : "Generate Diet Plan"}
          </button>
        </form>

        {/* BMI */}
        {bmi && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
          >
            <p className="text-lg">
              Your BMI: <span className="font-bold text-blue-400">{bmi}</span>
            </p>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <p className="text-center mt-4 text-blue-400 animate-pulse">
            Generating your AI diet plan...
          </p>
        )}

        {/* Result */}
        {result && (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-6 bg-white/10 border border-white/20 p-6 rounded-xl"
  >
    <h2 className="text-2xl font-bold mb-4 text-green-400 text-center">
      Your AI Diet Plan
    </h2>

    {/* Category */}
    <p className="text-center mb-4">
      Category:{" "}
      <span className="text-blue-400 font-semibold">
        {result.category}
      </span>
    </p>

    {/* Calories + Protein */}
    <div className="flex justify-around mb-6 text-center">
      <div>
        <p className="text-yellow-400 font-bold text-lg">
          {result?.dietPlan?.calories}
        </p>
        <p className="text-sm text-gray-300">Calories</p>
      </div>

      <div>
        <p className="text-green-400 font-bold text-lg">
          {result?.dietPlan?.protein}
        </p>
        <p className="text-sm text-gray-300">Protein</p>
      </div>
    </div>

{/* Progress Bars */}
{result && (
  <div className="mb-6 space-y-4">
    {/* Protein */}
    <div>
      <p className="text-sm mb-1">Protein Intake</p>
      <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${proteinPercent}%` }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="bg-green-400 h-3 rounded-full"
        />
      </div>
    </div>

    {/* Calories */}
    <div>
      <p className="text-sm mt-4 mb-1">Calorie Level</p>
      <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${caloriePercent}%` }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="bg-yellow-400 h-3 rounded-full"
        />
      </div>
    </div>
  </div>
)}
    

    {/* Meal Cards */}
    <div className="grid grid-cols-2 gap-4">

      <div className="diet-card">
        <h3>🍳 Breakfast</h3>
        <p>{result?.dietPlan?.breakfast}</p>
      </div>

      <div className="diet-card">
        <h3>🍛 Lunch</h3>
        <p>{result?.dietPlan?.lunch}</p>
      </div>

      <div className="diet-card">
        <h3>🍲 Dinner</h3>
        <p>{result?.dietPlan?.dinner}</p>
      </div>

      <div className="diet-card">
        <h3>🍎 Snacks</h3>
        <p>{result?.dietPlan?.snacks}</p>
      </div>

    </div>
  </motion.div>
)}

      </motion.div>
    </div>
  );
}
