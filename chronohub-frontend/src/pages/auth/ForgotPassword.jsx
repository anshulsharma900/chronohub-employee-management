import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post("/auth/forgot-password", { email });
      toast.success("Reset link generated!");
      setResetLink(data.resetUrl);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-white">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Enter your email
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:opacity-95 transition-all disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Reset Link"}
          </button>
        </form>

        {resetLink && (
          <div className="mt-6 p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm">
            <p className="text-slate-600 dark:text-slate-300 font-medium mb-1">Reset Link:</p>
            <a
              href={resetLink}
              className="text-blue-400 underline break-all"
            >
              {resetLink}
            </a>
          </div>
        )}

        <p className="text-center text-sm mt-6">
          <Link to="/login" className="text-blue-400 font-medium hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;