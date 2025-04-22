import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    countryCode: "+91",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const validateForm = () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 6 characters long and contain both letters and numbers"
      );
      return false;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!phoneRegex.test(formData.phone)) {
      setError(
        "Please enter a valid phone number (only digits, 10 characters)"
      );
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { confirmPassword, phone, ...dataToSend } = formData;
      const combinedPhone = `${formData.countryCode}${formData.phone}`;

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/shop/register`,
        { ...dataToSend, phone: combinedPhone }
      );

      navigate(`/verify-otp/${formData.email}`, { state: { registrationSuccess: false } });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (fieldType) =>
    `w-full px-4 py-2 border ${
      error.toLowerCase().includes(fieldType)
        ? "border-red-500"
        : "border-gray-300 dark:border-gray-600"
    } rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400`;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 p-4">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Shop Registration
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Shop Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="Enter shop name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass("name")}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              className={inputClass("email")}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                className={inputClass("password") + " pr-10"}
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2 right-3 text-gray-500 dark:text-gray-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputClass("password") + " pr-10"}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-2 right-3 text-gray-500 dark:text-gray-300"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
              >
                <option value="+91">+91 (India)</option>
                <option value="+1">+1 (USA)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+61">+61 (Australia)</option>
                <option value="+81">+81 (Japan)</option>
              </select>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass("phone")}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Address
            </label>
            <input
              id="address"
              name="address"
              placeholder="Enter shop address"
              value={formData.address}
              onChange={handleChange}
              className={inputClass("address")}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-2 rounded-md transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
