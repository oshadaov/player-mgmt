// src/auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import api from "./api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Sanitize localStorage on init to remove literal "null" or "undefined" strings
  useEffect(() => {
    ["token", "role", "entityId", "userId", "username"].forEach(key => {
      const val = localStorage.getItem(key);
      if (val === "null" || val === "undefined") {
        localStorage.removeItem(key);
      }
    });
  }, []);

  const [token, setToken] = useState(() => {
    const t = localStorage.getItem("token");
    return (t === "null" || t === "undefined") ? null : t;
  });

  const [user, setUser] = useState(() => {
    try {
      const t = localStorage.getItem("token");
      if (!t || t === "null" || t === "undefined") return null;
      const decoded = jwtDecode(t);
      // Ensure role/entityId are also available at top level for convenience
      return {
        ...decoded,
        role: decoded.role || localStorage.getItem("role"),
        entityId: decoded.entityId || localStorage.getItem("entityId")
      };
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
      try {
        setUser(jwtDecode(token));
      } catch {
        setUser(null);
      }
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  const login = (newToken) => setToken(newToken);
  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
