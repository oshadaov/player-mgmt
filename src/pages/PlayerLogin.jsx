// src/pages/PlayerLogin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PitchBg from "../assets/hero.jpg"; 
import api from "../auth/api.js"
import { useAuth } from "../auth/AuthContext";

const PlayerLogin = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", credentials);

      login(res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("entityId", res.data.entityId);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("user", JSON.stringify({
        username: res.data.username,
        role: res.data.role,
        entityId: res.data.entityId
      }));

      if (res.data.role === "PLAYER") {
        navigate(`/players/${res.data.entityId}`);
      } else {
        setError("Unauthorized access. This login is for players only.");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${PitchBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
        <h1 className="text-2xl font-bold text-center mb-2">Player Login</h1>
        <p className="text-xs text-slate-400 text-center mb-8">Access your player profile and status.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-1 text-slate-300">Email Address</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm"
              placeholder="player@example.com"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 text-slate-300">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Not a player? <Link to="/clublogin" className="text-emerald-400 hover:underline">Club login here</Link>
        </div>
      </div>
    </div>
  );
};

export default PlayerLogin;
