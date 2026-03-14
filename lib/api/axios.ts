import axios from "axios";

const api = axios.create({
  // Use Next.js rewrite proxy to avoid browser CORS issues.
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
