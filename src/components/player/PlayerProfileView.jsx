// src/components/player/PlayerProfileView.jsx
import React, { useEffect, useState } from "react";
import API from "../../auth/api";

const PlayerProfileView = ({ playerId }) => {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/api/players/${playerId}`);
        setPlayer(res.data);
      } catch (err) {
        console.error("Player profile retrieval failed:", err);
      } finally {
        setLoading(false);
      }
    };
    if (playerId) fetchProfile();
  }, [playerId]);

  if (loading) return <div className="text-emerald-500 animate-pulse">Loading Athletic Profile...</div>;
  if (!player) return <div className="text-red-400">Profile data inaccessible.</div>;

  return (
    <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-8 -mt-8 blur-2xl" />
      
      <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
        <div className="w-32 h-32 rounded-3xl bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-5xl font-black text-emerald-500 shadow-inner">
          {player.jerseyNumber || "—"}
        </div>
        
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white mb-2">{player.fullName}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6">
            <span className="px-3 py-1 bg-slate-950 rounded-full border border-slate-800 text-emerald-400 font-bold">{player.position}</span>
            <span className="px-3 py-1 bg-slate-950 rounded-full border border-slate-800">{player.ageCategory}</span>
            <span className="px-3 py-1 bg-slate-950 rounded-full border border-slate-800">{player.status}</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Height</p>
              <p className="text-xl font-bold">{player.height} cm</p>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Weight</p>
              <p className="text-xl font-bold">{player.weight} kg</p>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">NIC/ID</p>
              <p className="text-xl font-bold">{player.nic}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfileView;
