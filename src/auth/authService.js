// src/auth/authService.js
import api from "./api";

export const loginRequest = async (username, password) => {
  // Expecting backend endpoint: POST /auth/login { username, password } -> { token: "..." }
  const res = await api.post("/auth/login", { username, password });
  console.log(res.data)
  return res.data;
  
};
