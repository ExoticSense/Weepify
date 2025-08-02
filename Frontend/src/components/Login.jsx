import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI, apiUtils } from "../services/api";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    if (apiUtils.isAuthenticated()) {
      navigate('/home');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login
        const result = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
        console.log('Login result:', result);
      } else {
        // Register
        await authAPI.register({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        });
        // After successful registration, log them in
        const result = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
        console.log('Post-registration login result:', result);
      }
      
      // Success! Navigate to home after a short delay to ensure auth state is set
      console.log('Authentication successful, navigating to /home...');
      setTimeout(() => {
        navigate('/home');
      }, 100);
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required={!isLogin}
              className="w-full mb-4 px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mb-4 px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full mb-6 px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all py-2 rounded-md font-semibold"
          >
            {loading ? "Please wait..." : (isLogin ? "Log In" : "Sign Up")}
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
