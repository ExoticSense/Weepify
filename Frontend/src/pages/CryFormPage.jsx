import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cryLogsAPI } from "../services/api";

export default function CryFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    startTime: "", // Changed from 'time' to match backend
    duration: "",
    intensity: "moderate",
    moodAfter: "", // This matches backend
    reason: ""
  });


  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send data to backend API
      await cryLogsAPI.create({
        date: formData.date,
        startTime: formData.startTime,
        duration: parseInt(formData.duration), // Convert to number
        intensity: formData.intensity,
        moodAfter: formData.moodAfter,
        reason: formData.reason
      });
      
      // Success! Navigate to history
      navigate("/history");
    } catch (err) {
      console.error('Error saving cry log:', err);
      setError(err.response?.data?.message || "Failed to save crying session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center px-4 overflow-hidden">
      {/* 💧 Animated Tears */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-[-20px] w-3 h-3 bg-blue-400 rounded-full opacity-70 animate-tear"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        ></div>
      ))}

      <div className="flex flex-col md:flex-row items-center gap-10 w-full max-w-7xl bg-gray-850 rounded-2xl shadow-2xl p-10 relative backdrop-blur-md bg-opacity-80 z-10">
        {/* 📋 Left: Form */}
        <div className="w-full md:w-1/2">
          <h2
            className="text-5xl font-bold text-blue-400 text-center mb-4"
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            Cry Log
          </h2>

          <p className="text-center text-gray-400 italic mb-6">
            Even tears have stories.💧
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <input
                name="date"
                type="date"
                value={formData.date}
                className="w-1/2 p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />
              <input
                name="startTime"
                type="time"
                value={formData.startTime}
                className="w-1/2 p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />
            </div>
            
            <input
              type="number"
              name="duration"
              placeholder="Duration (in minutes)"
              value={formData.duration}
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              onChange={handleChange}
              required
            />

            <select
              name="intensity"
              value={formData.intensity}
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            >
              <option value="low">🟢 Low Intensity</option>
              <option value="moderate">🟡 Moderate Intensity</option>
              <option value="high">🔴 High Intensity</option>
            </select>

            <select
              name="moodAfter"
              value={formData.moodAfter}
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            >
              <option value="">Mood After Crying</option>
              <option value="Better">😊 Better</option>
              <option value="Same">😑 Same</option>
              <option value="Worse">😭 Worse</option>
            </select>

            <textarea
              name="reason"
              placeholder="Reason (optional)"
              value={formData.reason}
              className="w-full p-3 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-2 rounded-md font-semibold"
            >
              {loading ? "Saving..." : "Submit Cry Log"}
            </button>
          </form>
        </div>

        {/* 🎥 Right: Large GIF */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="https://media.giphy.com/media/L95W4wv8nnb9K/giphy.gif"
            alt="crying gif"
            className="w-full max-w-[550px] h-auto object-contain"
          />
        </div>
      </div>

      {/* 🌧️ CSS for Animated Tears */}
      <style>{`
        @keyframes tearFall {
          0% { transform: translateY(0); opacity: 0.7; }
          90% { opacity: 0.8; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .animate-tear {
          animation-name: tearFall;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in;
        }
      `}</style>
    </div>
  );
}
