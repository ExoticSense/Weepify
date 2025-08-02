import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Do any auth logic here
    // After successful login/signup, navigate to home
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-850 rounded-2xl shadow-2xl p-8 relative backdrop-blur-md bg-opacity-80">
        
        {/* Website Name */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-blue-400 tracking-wider">WEEPify</h1>
          <p className="text-sm text-gray-400 mt-2 italic">
            "Your crying partner"
          </p>
        </div>

        {/* Form Heading */}
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? "Log In to Your Account" : "Create a New Account"}
        </h2>

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full mb-4 px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-2 rounded-md font-semibold"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        {/* Toggle Link */}
        <p className="text-sm text-center mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-blue-400 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
}
