import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl && import.meta.env.PROD) {
  console.error("VITE_API_URL is not configured. API calls will fail.");
}

const API = axios.create({
  baseURL: apiUrl || "http://localhost:5000/api",
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;