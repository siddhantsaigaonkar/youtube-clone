import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { setUser, checkAuth } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle login
  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await API.post("/auth/signin", formData);

      console.log("Login response:", response.data);

      if (response.data.success) {
        const token = response.data.data.token;
        const loggedInUser = response.data.data.user;

        // Store JWT token
        localStorage.setItem("token", token);

        // Store the logged-in user in AuthContext
        setUser(loggedInUser);

        // Fetch the complete user data from the backend.
        // This includes the user's channel information.
        await checkAuth();

        // Go to home page
        navigate("/");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);

      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-900">
        {/* Heading */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign in
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sign in to continue to YouTube Clone
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-4
                py-3
                text-sm
                outline-none
                focus:border-black
                dark:border-gray-700
                dark:bg-gray-800
                dark:text-white
                dark:focus:border-white
              "
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-4
                py-3
                text-sm
                outline-none
                focus:border-black
                dark:border-gray-700
                dark:bg-gray-800
                dark:text-white
                dark:focus:border-white
              "
            />
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-full
              bg-black
              px-4
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-gray-800
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:bg-white
              dark:text-black
              dark:hover:bg-gray-200
            "
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Signup link */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
          </span>

          <Link
            to="/signup"
            className="font-semibold text-black hover:underline dark:text-white"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
