import { useEffect, useState, useRef } from "react";
import { cryLogsAPI } from "../services/api";
import { FaTint, FaSeedling, FaChartBar, FaFire } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function HistoryPage() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalTears: 0,
    plantsWatered: 0,
    cryingStreak: 0,
    dailyStats: [],
    weeklyStats: [],
    monthlyStats: []
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
        
        setLogs(logsData.data || []);
        
        // Handle backend stats structure (nested in data object)
        const backendStats = statsData.data || {};
        setStats({
          totalTears: (backendStats.lifetime_tears_ml || 0) / 1000, // Convert ML to L
          plantsWatered: backendStats.plants_watered || 0,
          cryingStreak: backendStats.highest_streak || 0,
          dailyStats: backendStats.daily_stats || [],
          weeklyStats: backendStats.weekly_stats || [],
          monthlyStats: backendStats.monthly_stats || []
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

  // Chart data generators
  const generateDailyChartData = () => {
    const data = stats.dailyStats || [];
    return {
      labels: data.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'Tears (ml)',
          data: data.map(item => item.tears_ml || 0),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
        },
        {
          label: 'Sessions',
          data: data.map(item => item.sessions || 0),
          backgroundColor: 'rgba(236, 72, 153, 0.6)',
          borderColor: 'rgba(236, 72, 153, 1)',
          borderWidth: 2,
        }
      ]
    };
  };

  const generateWeeklyChartData = () => {
    const data = stats.weeklyStats || [];
    return {
      labels: data.map((item, index) => `Week ${index + 1}`),
      datasets: [
        {
          label: 'Tears (ml)',
          data: data.map(item => item.tears_ml || 0),
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 2,
        },
        {
          label: 'Sessions',
          data: data.map(item => item.sessions || 0),
          backgroundColor: 'rgba(251, 146, 60, 0.6)',
          borderColor: 'rgba(251, 146, 60, 1)',
          borderWidth: 2,
        }
      ]
    };
  };

  const generateMonthlyChartData = () => {
    const data = stats.monthlyStats || [];
    return {
      labels: data.map(item => {
        const [year, month] = item.month.split('-');
        return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }),
      datasets: [
        {
          label: 'Tears (ml)',
          data: data.map(item => item.tears_ml || 0),
          backgroundColor: 'rgba(168, 85, 247, 0.6)',
          borderColor: 'rgba(168, 85, 247, 1)',
          borderWidth: 2,
        },
        {
          label: 'Sessions',
          data: data.map(item => item.sessions || 0),
          backgroundColor: 'rgba(239, 68, 68, 0.6)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 2,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white'
        }
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

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
          <p className="text-2xl">{(stats.totalTears || 0).toFixed(2)} L</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <FaSeedling className="text-green-400 mr-2" /> Plants Watered
          </h3>
          <p className="text-2xl">{stats.plantsWatered || 0}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-2 flex items-center">
            <FaFire className="text-orange-400 mr-2" /> Crying Streak
          </h3>
          <p className="text-2xl">{stats.cryingStreak || 0} day{(stats.cryingStreak || 0) !== 1 && "s"}</p>
        </div>
      </div>

      {/* Interactive Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Daily Chart */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h4 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
            <FaChartBar className="mr-2" /> Last 7 Days
          </h4>
          <div className="w-full h-48">
            {stats.dailyStats && stats.dailyStats.length > 0 ? (
              <Bar data={generateDailyChartData()} options={chartOptions} />
            ) : (
              <div className="w-full h-full bg-gray-700 rounded animate-pulse flex items-center justify-center text-gray-400">
                No daily data yet
              </div>
            )}
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
            <FaChartBar className="mr-2" /> Last 4 Weeks
          </h4>
          <div className="w-full h-48">
            {stats.weeklyStats && stats.weeklyStats.length > 0 ? (
              <Bar data={generateWeeklyChartData()} options={chartOptions} />
            ) : (
              <div className="w-full h-full bg-gray-700 rounded animate-pulse flex items-center justify-center text-gray-400">
                No weekly data yet
              </div>
            )}
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h4 className="text-lg font-semibold text-purple-400 mb-4 flex items-center">
            <FaChartBar className="mr-2" /> Last 6 Months
          </h4>
          <div className="w-full h-48">
            {stats.monthlyStats && stats.monthlyStats.length > 0 ? (
              <Line data={generateMonthlyChartData()} options={chartOptions} />
            ) : (
              <div className="w-full h-full bg-gray-700 rounded animate-pulse flex items-center justify-center text-gray-400">
                No monthly data yet
              </div>
            )}
          </div>
        </div>
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
