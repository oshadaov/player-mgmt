// src/pages/ClubLogin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoginBg from "../assets/login.jpg"; // make sure this exists
import api from "../auth/api.js";
import { useAuth } from "../auth/AuthContext";

const ClubLogin = () => {
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
      localStorage.setItem("entityId", res.data.entityId || "");
      localStorage.setItem("username", res.data.username);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: res.data.username,
          role: res.data.role,
          entityId: res.data.entityId,
        }),
      );

      if (res.data.role === "CLUB") {
        // Navigate to ClubDashboard which handles PENDING/REJECTED/APPROVED statuses
        navigate("/club-dashboard");
      } else if (res.data.role === "ADMIN") {
        navigate("/admindashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-72 w-72 rounded-full bg-emerald-500/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />

      {/* Right-side image strip */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-40 md:block">
        <img
          src={LoginBg}
          alt="Football stadium"
          className="h-full w-full object-cover mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6">
        {/* Top bar */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-bold text-slate-950">
              SP
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-200">
                Sports Portal
              </p>
              <p className="text-[11px] text-slate-400">
                Club & Player Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="rounded-full bg-slate-900/70 px-3 py-1 text-slate-300">
              Environment: <span className="text-emerald-300">Production</span>
            </span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Status: Online
            </span>
          </div>
        </header>

        {/* Main grid */}
        <div className="flex flex-1 items-center">
          <div className="grid w-full gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            {/* Left – info panel */}
            <div className="space-y-5">
              <h1 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
                Club dashboard access
              </h1>
              <p className="text-sm text-slate-300">
                Secure login for club officials to manage squads, fixtures,
                trials, and communication with players – all in one central
                place.
              </p>

              <ul className="mt-3 grid gap-2 text-xs text-slate-200 sm:grid-cols-2">
                <li className="flex items-start gap-2">
                  <span className="mt-[2px] text-emerald-400">✔</span>
                  <span>Update club details, staff, and branding.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[2px] text-emerald-400">✔</span>
                  <span>Monitor player availability and fitness status.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[2px] text-emerald-400">✔</span>
                  <span>Manage fixtures, trials, and announcements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[2px] text-emerald-400">✔</span>
                  <span>View insights from your club’s activity.</span>
                </li>
              </ul>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-slate-300">
                <div className="flex -space-x-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/90 text-[10px] font-semibold text-slate-950">
                    CL
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/90 text-[10px] font-semibold text-slate-950">
                    FC
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/90 text-[10px] font-semibold text-slate-950">
                    TR
                  </div>
                </div>
                <span>Trusted by university teams and local clubs.</span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                <Link
                  to="/"
                  className="hover:text-emerald-300 underline-offset-4 hover:underline"
                >
                  ← Back to Home
                </Link>
                <span className="hidden text-slate-600 md:inline">•</span>
                <Link
                  to="/login-player"
                  className="hover:text-emerald-300 underline-offset-4 hover:underline"
                >
                  Player login instead
                </Link>
              </div>
            </div>

            {/* Right – login card */}
            <div className="flex items-center">
              <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
                <h2 className="text-lg font-semibold text-slate-50">
                  Club Login
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Use the username and password provided by the system
                  administrator.
                </p>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  {/* Username */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-200">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={credentials.username}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      placeholder="club.username"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-200">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      placeholder="••••••••"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-center text-xs font-medium text-red-400">
                      {error}
                    </p>
                  )}

                  {/* Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-1 w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>

                {/* Helper / demo credentials box (optional) */}
                <div className="mt-4 rounded-2xl bg-slate-950/70 p-3 text-[11px] text-slate-300 border border-slate-800">
                  <p className="font-medium text-slate-100 mb-1">
                    Need access?
                  </p>
                  <p>
                    Contact your{" "}
                    <span className="text-emerald-300">
                      portal administrator
                    </span>{" "}
                    to get a club account. Demo credentials can also be provided
                    for testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small footer */}
        <footer className="mt-6 flex items-center justify-between text-[11px] text-slate-500">
          <span>
            © {new Date().getFullYear()} Sports Portal. All rights reserved.
          </span>
          <div className="flex gap-4">
            <button className="hover:text-emerald-300">Terms</button>
            <button className="hover:text-emerald-300">Privacy</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ClubLogin;
