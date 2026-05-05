// src/pages/PlayerDetails.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PitchBg from "../assets/hero.jpg";
import PlayerProfileView from "../components/player/PlayerProfileView";

const PlayerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8" style={{ backgroundImage: `url(${PitchBg})`, backgroundSize: "cover" }}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white transition">← Back</button>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-emerald-400">Athlete Identification</h1>
          <div className="w-12"></div>
        </header>

        <PlayerProfileView playerId={id} />
        
        <div className="mt-8 p-6 bg-slate-900/60 border border-slate-800 rounded-3xl">
          <h3 className="font-bold mb-2">Registry Information</h3>
          <p className="text-sm text-slate-400">This data is retrieved from the official national football registry. Any discrepancies should be reported to the respective club administration.</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetails;
