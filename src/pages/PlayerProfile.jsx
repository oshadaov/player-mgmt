// src/pages/PlayerProfile.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PitchBg from "../assets/hero.jpg";
import PlayerProfileView from "../components/player/PlayerProfileView";

const PlayerProfile = () => {
  const navigate = useNavigate();
  const entityId = localStorage.getItem("entityId");

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8" style={{ backgroundImage: `url(${PitchBg})`, backgroundSize: "cover" }}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Player Hub</h1>
            <p className="text-slate-400">View and manage your official player registration data.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate("/player/edit-profile")}
              className="bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl font-bold hover:bg-emerald-400 transition"
            >
              Edit My Profile
            </button>
            <button 
              onClick={() => navigate("/")}
              className="bg-slate-900/80 px-4 py-2 rounded-xl text-slate-300 hover:text-emerald-400 transition"
            >
              ← Home
            </button>
          </div>
        </header>

        <PlayerProfileView playerId={entityId} />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl">
            <h3 className="font-bold mb-2">Registration Status</h3>
            <p className="text-sm text-slate-400">Your profile is currently active in the national registry. All updates must be requested via your club manager.</p>
          </div>
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl">
            <h3 className="font-bold mb-2 text-emerald-400">Upcoming Matches</h3>
            <p className="text-sm text-slate-300">Check the match schedule for your next fixtures.</p>
            <button onClick={() => navigate("/matches")} className="mt-4 text-xs font-bold text-emerald-400 hover:underline">View Schedule &rsaquo;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
