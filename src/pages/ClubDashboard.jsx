// src/pages/ClubDashboard.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";

import ClubOverviewCard from "../components/ClubOverviewCard";
import ClubSquadManager from "../components/club/ClubSquadManager";
import ClubCoachList from "../components/club/ClubCoachList";

const ClubDashboard = () => {
  const { id: routeId } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 👇 Decide which club ID to use
  const clubId = routeId || localStorage.getItem("entityId");

  useEffect(() => {
    const fetchClub = async () => {
      try {
        // if (!token || role !== "CLUB") {
        //   setError("You must be logged in as a club to view this page.");
        //   setLoading(false);
        //   return;
        // }

        if (!clubId) {
          setError("Club ID not found. Please login again.");
          setLoading(false);
          return;
        }

        setLoading(true);
        const res = await API.get(`/api/clubs/${clubId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setClub(res.data || null);
      } catch (err) {
        console.error("❌ Error fetching club:", err);
        setError("Failed to load club details.");
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [clubId, token, role]);

  const players = club?.players || [];
  const playerCount = players.length;

  // 👉 Actions
  const handleAddPlayer = () => {
    // Adjust route to match where you mounted PlayerForm
    navigate("/players/register-player");
  };

  const handleEditPlayer = (playerId) => {
    navigate(`/players/edit/${playerId}`);
  };

  const handleRemovePlayer = async (playerId) => {
    const confirm = window.confirm(
      "Are you sure you want to remove this player from the system?"
    );
    if (!confirm) return;

    try {
      await API.delete(`/players/${playerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local state
      setClub((prev) =>
        prev
          ? {
              ...prev,
              players: (prev.players || []).filter(
                (p) => p.id !== playerId
              ),
            }
          : prev
      );
    } catch (err) {
      console.error("❌ Error removing player:", err);
      alert("Failed to remove player. Please try again.");
    }
  };

  // Loading / error states with same background
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300"
        style={{
          backgroundImage: `linear-gradient(rgba(5,10,25,0.9), rgba(5,10,25,0.96)), url(${PitchBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        Loading club dashboard...
      </div>
    );
  }

  if (error || !club) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(5,10,25,0.9), rgba(5,10,25,0.96)), url(${PitchBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-md w-full bg-slate-900/90 p-8 rounded-3xl border border-slate-800 text-center backdrop-blur-xl">
           <h2 className="text-2xl font-bold mb-4">No Club Profile Found</h2>
           <p className="text-sm text-slate-400 mb-8 font-medium">It looks like you haven't registered your football club yet. Start the registration process to access full management features.</p>
           <button 
             onClick={() => navigate("/create-club")}
             className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-2xl hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 uppercase tracking-widest"
           >
             Register Your Club
           </button>
        </div>
      </div>
    );
  }

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

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
              Club Dashboard
            </p>
            <h1 className="text-2xl font-semibold md:text-3xl">
              {club.clubName}
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Manage your club details and squad from one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-slate-300">
              Role: <span className="text-emerald-300">{role}</span>
            </span>
            <button
              type="button"
              onClick={() => navigate("/club/player-updates")}
              className="rounded-full bg-amber-500/10 border border-amber-500/40 px-4 py-1 text-amber-400 font-bold hover:bg-amber-500/20 transition"
            >
              Review Player Updates
            </button>
            <button
              type="button"
              onClick={() => navigate("/club/edit-profile")}
              className="rounded-full bg-emerald-500 px-4 py-1 text-slate-950 font-bold hover:bg-emerald-400 transition"
            >
              Edit Profile
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/register-coach")}
              className="rounded-full bg-sky-500 px-4 py-1 text-slate-950 font-bold hover:bg-sky-400 transition"
            >
              + Register Technical Staff
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-full bg-slate-900/80 px-3 py-1 text-slate-300 hover:text-emerald-300"
            >
              ← Back to Home
            </button>
          </div>
        </header>

        {/* Technical Integrity Notice */}
        <HeadCoachAlert clubId={club.id} />

        {/* Top layout: Club overview */}
        <section className="mb-8 grid gap-6 md:grid-cols-[2fr,1.5fr]">
          <ClubOverviewCard club={club} playerCount={playerCount} />
          {/* Simple stat card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-md backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
              Snapshot
            </p>
            <div className="space-y-2 text-sm">
              <StatRow label="Total Players" value={playerCount} />
              <StatRow
                label="Email"
                value={club.username || club.email || "Not provided"}
              />
              <StatRow
                label="Manager"
                value={
                  club.licenseManagerName ||
                  club.managerName ||
                  "Not set"
                }
              />
            </div>
          </div>
        </section>

        {/* Technical Staff Section */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Technical Staff</h2>
            <p className="text-[11px] text-slate-400 mt-1">Official coaching staff assigned to your club.</p>
          </div>
          <ClubCoachList clubId={club.id} />
        </section>

        {/* Specialized Squad Management */}
        <section className="mt-8">
           <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Squad Roster</h2>
              <button 
                onClick={handleAddPlayer}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl font-bold text-xs transition"
              >
                + Register New Player
              </button>
           </div>
           <ClubSquadManager clubId={club.id} />
        </section>
      </main>
    </div>
  );
};

const StatRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-xs sm:text-sm">
    <span className="text-slate-400">{label}</span>
    <span className="font-semibold text-slate-50 truncate max-w-[65%] text-right">
      {value}
    </span>
  </div>
);

const HeadCoachAlert = ({ clubId }) => {
  const [hasHeadCoach, setHasHeadCoach] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHeadCoach = async () => {
      try {
        const res = await API.get(`/api/coaches/club/${clubId}`);
        const list = res.data || [];
        const found = list.some(aff => aff.role === 'HEAD_COACH' && aff.active);
        setHasHeadCoach(found);
      } catch (err) {
        console.error("Failed to check head coach:", err);
      } finally {
        setLoading(false);
      }
    };
    if (clubId) checkHeadCoach();
  }, [clubId]);

  if (loading || hasHeadCoach) return null;

  return (
    <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-4 animate-pulse">
      <span className="text-2xl">⚠️</span>
      <div>
        <h4 className="text-sm font-bold text-amber-200 uppercase tracking-widest">Technical Vacancy Detected</h4>
        <p className="text-[10px] text-amber-100/70">Your club currently has no official Head Coach registered. Please register a Head Coach to ensure compliance with association regulations.</p>
      </div>
    </div>
  );
};

export default ClubDashboard;
