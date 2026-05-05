// src/components/public/PublicPlayerGallery.jsx
import React from "react";

const PublicPlayerGallery = ({ players }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {players.map((player) => (
        <div 
          key={player.id} 
          className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-col items-center text-center hover:bg-slate-900/90 transition-all"
        >
          <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-black text-emerald-500 mb-3 border-2 border-slate-700">
            {player.jerseyNumber || "—"}
          </div>
          <h4 className="font-bold text-sm text-white mb-1">{player.fullName}</h4>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{player.position}</p>
          
          <div className="mt-4 pt-4 border-t border-slate-800 w-full">
            <p className="text-[9px] text-slate-500 uppercase mb-1">Club Affiliation</p>
            <p className="text-[11px] text-slate-300">Member since {new Date(player.submittedAt).getFullYear()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PublicPlayerGallery;
