// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../auth/authService";
import { useAuth } from "../auth/AuthContext";
import PitchBg from "../assets/hero.jpg";

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginRequest(form.username, form.password);
      if (!data?.token) throw new Error("No token returned");

      login(data.token);

      const role = data.role;
      const entityId = data.entityId;
      const username = data.username;

      localStorage.setItem("role", role);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", username);

      if (entityId) {
        localStorage.setItem("entityId", entityId);
      } else {
        localStorage.removeItem("entityId");
      }

      localStorage.setItem("user", JSON.stringify({ username, role, entityId }));

      // Role-based redirection
      if (role === "SUPER_ADMIN") {
        navigate("/superadmindashboard");
      } else if (role === "ADMIN") {
        navigate("/admindashboard");
      } else if (role === "CLUB") {
        if (!entityId || entityId === "null" || entityId === "0") {
          // New representative — hasn't created a club yet → redirect to create club
          navigate("/create-club");
        } else {
          navigate(`/clubs/${entityId}`);
        }
      } else if (role === "PLAYER") {
        navigate("/players/profile");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-950 text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(5,10,25,0.85), rgba(5,10,25,0.96)), url(${PitchBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md bg-slate-900/90 p-10 rounded-3xl backdrop-blur-xl border border-slate-800 shadow-2xl">
        <header className="mb-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-2xl font-black text-slate-950 mb-4">⚽</div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">SL Football</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Management Portal</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/40 rounded-2xl text-red-400 text-xs text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Email Address</label>
            <input
              type="email"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-emerald-500 outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-emerald-500 outline-none transition text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-2xl hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 uppercase tracking-widest mt-2 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500">
          New representative?{" "}
          <Link to="/signup" className="text-emerald-400 font-bold hover:underline">
            Create an Account
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-slate-600">
          <Link to="/" className="hover:text-slate-400">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
