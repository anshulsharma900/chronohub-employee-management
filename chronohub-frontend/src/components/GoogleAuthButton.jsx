import { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

/**
 * Google sign-in/sign-up button. Uses credential (JWT) for backend verification.
 * @param {string} [role] - For sign-up only: "employee" | "manager". Omit for login.
 * @param {string} [label] - Button text override
 * @param {string} [className] - Extra CSS classes for the wrapper
 */
export default function GoogleAuthButton({ role, label, className = "" }) {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const isSignUp = Boolean(role);

  const handleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      toast.error("Could not get Google sign-in credential");
      return;
    }

    try {
      const { data } = await API.post("/auth/google", {
        idToken,
        ...(isSignUp && { role }),
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

      toast.success(isSignUp ? "Account created with Google!" : `Welcome back, ${data.name}!`);

      if (data.role === "admin") navigate("/admin");
      else if (data.role === "manager") navigate("/manager");
      else navigate("/employee");
    } catch (err) {
      const msg = err.response?.data?.message || (isSignUp ? "Google sign-up failed" : "Google sign-in failed");
      toast.error(msg);
    }
  };

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return (
      <div className={`text-center py-2 text-sm text-gray-400 ${className}`}>
        Add VITE_GOOGLE_CLIENT_ID to enable Google sign-in
      </div>
    );
  }

  return (
    <div className={className}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google sign-in was cancelled or failed")}
        useOneTap={false}
        theme="outline"
        size="large"
        type="standard"
        shape="rectangular"
        text={label ? "custom" : (isSignUp ? "signup_with" : "signin_with")}
        width="100%"
      />
    </div>
  );
}
