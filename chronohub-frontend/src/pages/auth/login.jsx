import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import GoogleAuthButton from "../../components/GoogleAuthButton";
import ThemeToggle from "../../components/ThemeToggle";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      login(
        {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role,
        },
        data.token
      );

      toast.success(`Welcome back, ${data.name}!`);

      if (data.role === "admin") navigate("/admin");
      else if (data.role === "manager") navigate("/manager");
      else navigate("/employee");

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col transition-colors duration-300">

      {/* Header */}
      <header className="bg-white dark:bg-slate-900 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-10 transition-colors">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">

          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="ChronoHub" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-md" />
            <span className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">
              Chrono<span className="text-blue-500">HUB</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <span className="text-blue-400 font-semibold text-sm sm:text-base">
              Login
            </span>

            <Link
              to="/register"
              className="px-4 sm:px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all text-sm sm:text-base"
            >
              Sign Up
            </Link>
          </div>

        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-8">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-300">
          <div className="h-1.5 bg-blue-600" />

          <div className="p-6 sm:p-8 md:p-10">

            <div className="text-center mb-8">
              <img src="/logo.png" alt="ChronoHub" className="w-16 h-16 rounded-2xl mb-4 shadow-lg mx-auto" />

              <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
                Welcome Back
              </h1>

              <p className="text-slate-500 dark:text-slate-400">
                Sign in to your account to continue
              </p>
            </div>

            <div className="mb-5">
              <GoogleAuthButton className="[&>div]:!w-full [&>div]:!flex [&>div]:!justify-center" />
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-medium">
                  OR CONTINUE WITH EMAIL
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 pr-12 border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <Link
                  to="/forgot-password"
                  className="text-blue-400 hover:text-blue-500 hover:underline font-medium transition-colors"
                >
                Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Login"}
              </button>

            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-400 font-semibold hover:underline">
                Sign up
              </Link>
            </p>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;