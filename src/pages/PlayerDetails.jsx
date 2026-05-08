// src/pages/PlayerDetails.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import PitchBg from "../assets/hero.jpg";
import PlayerProfileView from "../components/player/PlayerProfileView";

const PlayerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="text-emerald-500">Athlete</span> Identification
            </h1>
            <p className="text-slate-400 text-sm mt-1">Official Registry Record & Verification</p>
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="px-6 py-2 bg-slate-900 border border-slate-800 rounded-full text-sm font-medium hover:bg-slate-800 hover:border-slate-700 transition flex items-center gap-2 self-start md:self-auto"
          >
            ← Back to Registry
          </button>
        </header>

        <PlayerProfileView playerId={id} />
        
        <div className="mt-8 p-8 bg-slate-900/40 border border-slate-800/60 rounded-3xl backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">🛡️</div>
            <div>
              <h3 className="font-bold text-slate-100 mb-1 text-lg">Registry Integrity Notice</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                This athletic identification profile is a direct extract from the National Football Registry. 
                Data presented here (including NIC and age category) is verified during the registration 
                and approval cycle. For official transfers or data corrections, please contact the 
                Federation Administration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetails;
