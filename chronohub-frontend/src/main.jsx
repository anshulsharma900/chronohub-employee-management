import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
if (!googleClientId && import.meta.env.PROD) {
  console.warn("VITE_GOOGLE_CLIENT_ID is not configured. Google Sign-In will be disabled.");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
            <Toaster position="top-right" />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);