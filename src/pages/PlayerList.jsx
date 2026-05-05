// src/pages/PlayerList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PitchBg from "../assets/hero.jpg";
import PlaceHolder from "../assets/placeholder.jpg";
import API from "../auth/api";

const PLACEHOLDER = PlaceHolder;

const PlayerList = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const res = await API.get("/api/players", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPlayers(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching players:", err);
        setError("Failed to load players");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const handleResendActivation = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.post(`/api/players/${id}/resend-activation`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Activation email resent!");
    } catch (err) {
      alert("Failed to resend activation.");
    }
  };

  // Stats
  const totalPlayers = players.length;
  const ages = players.map((p) => p.age).filter((a) => typeof a === "number");
  const bmis = players
    .map((p) => p.bmi)
    .filter((b) => typeof b === "number" && !isNaN(b));

  const avgAge =
    ages.length > 0
      ? (ages.reduce((sum, a) => sum + a, 0) / ages.length).toFixed(1)
      : "—";

  const avgBmi =
    bmis.length > 0
      ? (bmis.reduce((sum, b) => sum + b, 0) / bmis.length).toFixed(1)
      : "—";

  // Search
  const filteredPlayers = players.filter((player) => {
    const term = search.toLowerCase();
    return (
      player.name?.toLowerCase().includes(term) ||
      player.email?.toLowerCase().includes(term) ||
      player.role?.toLowerCase().includes(term)
    );
  });

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-50"
      style={{
        backgroundImage: `linear-gradient(rgba(5,10,25,0.9), rgba(5,10,25,0.96)), url(${PitchBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* background accents */}
      <div className="pointer-events-none absolute -left-40 top-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
              Admin Dashboard
            </p>
            <h1 className="text-2xl font-semibold md:text-3xl">
              Players Overview
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              View and manage all players registered in the system.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <Link
              to="/admin-dashboard"
              className="rounded-full bg-slate-900/80 px-3 py-1 text-slate-300 hover:text-emerald-300"
            >
              ← Back to Admin
            </Link>
            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-slate-300">
              Role: <span className="text-emerald-300">Admin</span>
            </span>
          </div>
        </header>

        {/* Top row: stats + search */}
        <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="grid grid-cols-3 gap-3 md:w-auto md:min-w-[320px]">
            <StatCard label="Total Players" value={totalPlayers} />
            <StatCard label="Average Age" value={avgAge} />
            <StatCard label="Average BMI" value={avgBmi} />
          </div>

          <div className="md:w-72">
            <label className="mb-1 block text-xs text-slate-300">
              Search players
            </label>
            <input
              type="text"
              placeholder="Search by name, email, role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </div>
        </section>

        {/* Content states */}
        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-400">
            Loading players...
          </div>
        ) : error ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-400">
            No players match your search.
          </div>
        ) : (
          <section>
            <div className="mb-3 text-xs text-slate-400">
              Showing{" "}
              <span className="text-emerald-300">
                {filteredPlayers.length}
              </span>{" "}
              of{" "}
              <span className="text-emerald-300">
                {players.length}
              </span>{" "}
              players
            </div>

            {/* Grid of Player Cards */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPlayers.map((player) => (
                <article
                  key={player.id}
                  className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-lg hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-emerald-500/20 transition"
                >
                  {/* Player Image */}
                  <div className="flex justify-center mb-4">
                    <img
                      src={`http://localhost:8088/api/players/${player.id}/playerImage`}
                      alt={player.name}
                      className="w-24 h-24 object-cover rounded-full border-2 border-emerald-400/50 shadow-md"
                      onError={(e) => {
                        e.currentTarget.src ={PLACEHOLDER}
                         
                      }}
                    />
                  </div>

                  {/* Player Info */}
                  <h2 className="text-lg font-semibold text-center">
                    {player.name}
                  </h2>
                  <p className="text-center text-xs text-emerald-300">
                    {player.role || "Player"}
                    {player.status === "APPROVED" && (
                      <button 
                        onClick={() => handleResendActivation(player.id)}
                        className="ml-2 text-[10px] text-emerald-400 hover:underline"
                      >
                        (Resend Mail)
                      </button>
                    )}
                  </p>
                  <p className="text-center text-[11px] text-slate-400 mt-1 break-all">
                    {player.email}
                  </p>

                  {/* Quick Stats */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-center">
                    <Stat label="Age" value={player.age} />
                    <Stat
                      label="BMI"
                      value={
                        typeof player.bmi === "number"
                          ? player.bmi.toFixed(1)
                          : "—"
                      }
                    />
                    <Stat
                      label="Height"
                      value={player.height ? `${player.height} cm` : "—"}
                    />
                    <Stat
                      label="Weight"
                      value={player.weight ? `${player.weight} kg` : "—"}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 flex justify-center gap-3 text-sm">
                    <Link
                      to={`/players/${player.id}`}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-medium shadow-md hover:bg-emerald-400 transition"
                    >
                      View Profile
                    </Link>
                    <Link
                      to={`/players/edit/${player.id}`}
                      className="px-4 py-2 rounded-xl border border-slate-600 bg-slate-950/70 text-slate-100 font-medium shadow-md hover:border-emerald-400 hover:text-emerald-200 transition"
                    >
                      Edit
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

// Small stat card (top row)
const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-left shadow-sm backdrop-blur">
    <p className="text-[11px] uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="text-base font-semibold text-slate-50">{value}</p>
  </div>
);

// Reusable stat (inside player card)
const Stat = ({ label, value }) => (
  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
    <p className="text-[11px] text-slate-400">{label}</p>
    <p className="text-sm font-semibold text-slate-50">{value ?? "—"}</p>
  </div>
);

export default PlayerList;
