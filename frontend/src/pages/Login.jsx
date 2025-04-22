import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ShopContext from "../context/ShopContext";

const Login = () => {
  const { loginShop } = useContext(ShopContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/shop/login`,
        { email, password }
      );
      loginShop(response.data.shop, response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 shadow-md rounded w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Shop Login</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 pr-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-2.5 right-3 text-gray-500 dark:text-gray-300 cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white p-2 rounded mb-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center">
          New here?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:underline dark:text-blue-400"
          >
            Register
          </Link>
        </p>
        <p className="text-sm text-center">
          <Link
            to="/forgot-password"
            className="text-blue-500 hover:underline dark:text-blue-400"
          >
            Forgot Password
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
