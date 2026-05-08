// src/auth/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8088";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  if (token && token !== "null" && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (user && user !== "null" && user !== "undefined") {
    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser) {
        config.headers["X-Username"] = parsedUser.username || parsedUser.email;
      }
    } catch (e) {
      config.headers["X-Username"] = user;
    }
  }

  if (role && role !== "null" && role !== "undefined") {
    config.headers["X-User-Role"] = role;
  }

  const entityId = localStorage.getItem("entityId");
  if (entityId && entityId !== "null" && entityId !== "undefined") {
    config.headers["X-Entity-Id"] = entityId;
  }

  return config;
});

export default api;
