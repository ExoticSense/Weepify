import { useEffect, useState, useRef } from "react";
import { cryLogsAPI } from "../services/api";
import { FaTint, FaSeedling, FaChartBar, FaFire } from "react-icons/fa";

export default function HistoryPage() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalTears: 0,
    plantsWatered: 0,
    cryingStreak: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch cry logs and stats from backend
        const [logsData, statsData] = await Promise.all([
          cryLogsAPI.getAll(),
          cryLogsAPI.getStats()
        ]);
        
        setLogs(logsData.cryLogs || []);
        setStats(statsData || {
          totalTears: 0,
          plantsWatered: 0,
          cryingStreak: 0
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError("Failed to load crying history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter logs by selected date
  const filteredLogs = selectedDate
    ? logs.filter((log) => log.date === selectedDate)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl text-blue-400">Loading your crying history... 💧</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-red-400 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 font-sans">
      <h2
        className="text-5xl font-bold text-blue-400 text-center mb-6"
        style={{ fontFamily: "'Pacifico', cursive" }}
      >
        Cry History
      </h2>
    
      {/* Lifetime Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2 flex items-center"> 
            <FaTint className="text-blue-400 mr-2" /> Total Tears Shed 
          </h3>
          <p className="text-2xl">{stats.totalTears.toFixed(2)} L</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <FaSeedling className="text-green-400 mr-2" /> Plants Watered
          </h3>
          <p className="text-2xl">{stats.plantsWatered}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <FaFire className="text-orange-400 mr-2" /> Crying Streak
          </h3>
          <p className="text-2xl">{stats.cryingStreak} day{stats.cryingStreak !== 1 && "s"}</p>
        </div>
      </div>

      {/* Graph Placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {["Daily", "Weekly", "Monthly"].map((period, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center"
          >
            <h4 className="text-lg font-semibold text-pink-400 mb-4 flex items-center">
              <FaChartBar className="mr-2" /> {period} Cry Graph
            </h4>
            <div className="w-full h-48 bg-gray-700 rounded animate-pulse flex items-center justify-center text-gray-400">
              [{period} Graph Placeholder]
            </div>
          </div>
        ))}
      </div>
      
      {/* Date Filter Input */}
      <div className="mb-6 text-center">
        <label htmlFor="dateFilter" className="block text-lg mb-2 text-gray-300">
          Select a Date to View Logs:
        </label>
        <input
          id="dateFilter"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 rounded bg-gray-700 text-white border border-gray-500"
        />
      </div>

      {/* Conditional Logs Display */}
      <div className="space-y-6">
        {selectedDate === "" ? (
          <p className="text-center text-gray-400">
            Select a date above to view logs.
          </p>
        ) : filteredLogs.length === 0 ? (
          <p className="text-center text-gray-400">
            No logs found for {selectedDate}.
          </p>
        ) : (
          filteredLogs.map((log, index) => (
            <div
              key={index}
              className="bg-gray-800 p-5 rounded-xl shadow-md border-l-4 border-blue-500 hover:border-pink-500 transition duration-300"
            >
              <p><strong>Date:</strong> {log.date || "—"}</p>
              <p><strong>Start Time:</strong> {log.startTime || log.time}</p>
              <p><strong>Duration:</strong> {log.duration} minutes</p>
              <p><strong>Intensity:</strong> {log.intensity}</p>
              <p><strong>Mood After:</strong> {log.moodAfter}</p>
              <p><strong>Reason:</strong> {log.reason || "Not specified"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
