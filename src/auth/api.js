// src/auth/api.js
import axios from "axios";

const API_BASE = import.meta.env.REACT_APP_API_BASE || "http://localhost:8022";

const api = axios.create({
  baseURL: API_BASE,
});

export default api;
