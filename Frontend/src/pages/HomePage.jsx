import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col items-center justify-center px-6 py-12">
      {/* Title */}
      <h1 className="text-5xl font-extrabold text-blue-400 tracking-wider">
        WEEPify
      </h1>

      {/* Tagline */}
      <p className="text-lg italic text-gray-400 mb-6 text-center">
        Embrace your tears. Record your release.
      </p>

      {/* GIF */}
      <div className="my-4">
        <img
          src="https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif"
          alt="crying gif"
          className="w-48 h-48 object-cover rounded-xl shadow-lg border border-gray-700"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4 mt-8 w-full max-w-xs">
        <button
          onClick={() => navigate("/log")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-md transition"
        >
          I Cried Today 😢 
        </button>

        <button
          onClick={() => navigate("/history")}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-800 rounded-lg font-semibold shadow-md transition"
        >
          View My Tear History 📜 
        </button>
      </div>
    </div>
  );
}
