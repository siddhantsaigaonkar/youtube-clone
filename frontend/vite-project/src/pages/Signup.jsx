import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";


function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await API.post("/auth/signup", formData);

      console.log("Signup response:", response.data);

      if (response.data.success) {
        // Store token
        const token = response.data.data?.token;

        if (token) {
          localStorage.setItem("token", token);
        }

        // Go to home page
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error);

      setError(
        error.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h1 className="text-center text-2xl font-semibold text-gray-900 dark:text-white">
          Create your account
        </h1>

        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          Sign up to continue to YouTube Clone
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                bg-white
                px-3
                py-2.5
                text-sm
                outline-none
                focus:border-black
                dark:border-gray-600
                dark:bg-gray-800
                dark:text-white
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>

            <input
              type="email"
              name="email"
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
                px-3
                py-2.5
                text-sm
                outline-none
                focus:border-black
                dark:border-gray-600
                dark:bg-gray-800
                dark:text-white
              "
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>

            <input
              type="password"
              name="password"
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
                px-3
                py-2.5
                text-sm
                outline-none
                focus:border-black
                dark:border-gray-600
                dark:bg-gray-800
                dark:text-white
              "
            />
          </div>

          {/* Signup button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-full
              bg-black
              py-2.5
              text-sm
              font-medium
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
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-black hover:underline dark:text-white"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
