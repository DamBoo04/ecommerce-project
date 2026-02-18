import { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    login: "", // Email or Phone
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect after reload if already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/profile");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => password.length >= 6;
  const validateConfirmPassword = () => form.password === form.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        if (!form.login) return alert("Email or Phone is required");
        if (!validatePassword(form.password))
          return alert("Password must be at least 6 characters");

        const payload = { login: form.login, password: form.password };
        const res = await API.post("/login", payload);

        // Save token and user
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Login Success ✅");

        // Reload page after login
        window.location.reload();
      } else {
        // Registration logic
        if (!form.name.trim()) return alert("Name is required");
        if (!form.phone.trim()) return alert("Phone is required");
        if (!form.email.trim()) return alert("Email is required");
        if (!validatePassword(form.password))
          return alert("Password must be at least 6 characters");
        if (!validateConfirmPassword()) return alert("Passwords do not match");

        const payload = {
          name: form.name,
          phone: form.phone,
          email: form.email,
          password: form.password,
        };

        await API.post("/register", payload);
        alert("Register Success ✅ Please login now");
        setIsLogin(true);
      }
    } catch (error) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 p-12 bg-gray-100 flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <i
                  className={`fas ${
                    isLogin ? "fa-sign-in-alt" : "fa-user-plus"
                  } text-red-600 fa-lg`}
                ></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {isLogin ? "Welcome Back!" : "Create Account"}
              </h2>
              <p className="text-gray-600 mt-2">
                {isLogin
                  ? "Please sign in to continue"
                  : "Get started with your account"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Name (Register only) */}
              {!isLogin && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                  />
                </div>
              )}

              {/* Phone (Register only) */}
              {!isLogin && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0123456789"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                  />
                </div>
              )}

              {/* Login (Email or Phone) */}
              {isLogin && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    name="login"
                    value={form.login}
                    onChange={handleChange}
                    placeholder="you@example.com or 0123456789"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                  />
                </div>
              )}

              {/* Email (Register only) */}
              {!isLogin && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                  />
                </div>
              )}

              {/* Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                />
                {form.password && !validatePassword(form.password) && (
                  <p className="mt-2 text-sm text-red-600">
                    Password must be at least 6 characters
                  </p>
                )}
              </div>

              {/* Confirm Password (Register only) */}
              {!isLogin && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors"
                  />
                  {form.confirmPassword && !validateConfirmPassword() && (
                    <p className="mt-2 text-sm text-red-600">
                      Passwords do not match
                    </p>
                  )}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 focus:ring-4 focus:ring-red-600 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
              </button>

              {/* Switch */}
              <p className="mt-6 text-center text-gray-600">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  className="ml-1 text-red-600 hover:text-red-700 font-semibold focus:outline-none"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/a50d54107315669.5fa41a499eeb0.png')",
        }}
      >
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-white px-12">
            <h2 className="text-4xl font-bold mb-6">Your Title</h2>
            <p className="text-xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis,
              expedita.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
