import { useEffect, useState, useRef } from "react";

import { FaTint, FaSeedling, FaChartBar, FaFire } from "react-icons/fa";

export default function HistoryPage() {
  const [logs, setLogs] = useState([]);
  const [streak, setStreak] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem("cryLogs") || "[]");

    const sortedLogs = savedLogs.sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );
    setLogs(sortedLogs);

    // Cry streak calculation
    const dates = new Set(savedLogs.map((log) => log.date));
    let currentStreak = 0;
    let date = new Date();

    while (true) {
      const dateStr = date.toISOString().split("T")[0];
      if (dates.has(dateStr)) {
        currentStreak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }

    setStreak(currentStreak);
  }, []);

  const totalCries = logs.length;
  const totalWater = (totalCries * 0.1).toFixed(2);
  const totalPlants = Math.floor(totalCries * 0.5);

  // Filter logs by selected date
  const filteredLogs = selectedDate
    ? logs.filter((log) => log.date === selectedDate)
    : [];

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
            <FaTint className="text-blue-400 mr-2" /> Total Cry Estimate 
          </h3>
          <p className="text-2xl">{totalWater} L</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <FaSeedling className="text-green-400 mr-2" /> Thirsty greens
          </h3>
          <p className="text-2xl">{totalPlants}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <FaFire className="text-orange-400 mr-2" /> Cry Streak
          </h3>
          <p className="text-2xl">{streak} day{streak !== 1 && "s"}</p>
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
              <p><strong>Time:</strong> {log.time}</p>
              <p><strong>Duration:</strong> {log.duration || "—"}</p>
              <p><strong>Intensity:</strong> {log.intensity}</p>
              <p><strong>Mood Before:</strong> {log.moodBefore}</p>
              <p><strong>Mood After:</strong> {log.moodAfter}</p>
              <p><strong>Reason:</strong> {log.reason || "Not specified"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
