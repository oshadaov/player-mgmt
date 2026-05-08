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
    <div className="bg-slate-900/90 border border-slate-800 p-0 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden relative">
      {/* Hero Header Area */}
      <div className="bg-gradient-to-r from-emerald-600/20 to-sky-600/20 h-32 w-full relative">
        <div className="absolute inset-0 bg-slate-950/40" />
      </div>

      <div className="px-8 pb-8 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-end mb-8">
          {/* Photo/Avatar */}
          <div className="w-40 h-40 rounded-3xl bg-slate-800 border-4 border-slate-950 overflow-hidden shadow-2xl flex-shrink-0">
            {player.photoUrl ? (
              <img src={player.photoUrl} alt={player.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-slate-700 bg-slate-900">⚽</div>
            )}
          </div>
          
          <div className="flex-1 pb-2 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h2 className="text-3xl font-bold text-white">{player.fullName}</h2>
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mx-auto md:mx-0 ${
                player.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
              }`}>
                {player.status}
              </span>
            </div>
            <p className="text-slate-400 font-medium">#{player.jerseyNumber || "—"} • {player.position}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Personal Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">Personal Details</h3>
            <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/50 space-y-3">
              <DetailRow label="NIC / ID" value={player.nic} />
              <DetailRow label="Gender" value={player.gender} />
              <DetailRow label="DOB" value={player.dateOfBirth} />
              <DetailRow label="Age Category" value={player.ageCategory} />
              <DetailRow label="District" value={player.district} />
            </div>
          </div>

          {/* Middle Column: Athletic Profile */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">Athletic Profile</h3>
            <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/50 space-y-3">
              <DetailRow label="Dominant Foot" value={player.dominantFoot} />
              <DetailRow label="Preferred Position" value={player.position} />
              <DetailRow label="Jersey #" value={player.jerseyNumber} />
              <DetailRow label="Club ID" value={player.clubId} />
            </div>
          </div>

          {/* Right Column: Contact & Metadata */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">Contact & Registry</h3>
            <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/50 space-y-3">
              <DetailRow label="Phone" value={player.phone} />
              <DetailRow label="Email" value={player.email} />
              <div className="pt-2">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Home Address</p>
                <p className="text-xs text-slate-300 leading-relaxed">{player.homeAddress}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Audit Footer */}
        <div className="mt-10 pt-6 border-t border-slate-800/50 flex flex-col md:flex-row justify-between gap-4 text-[10px] text-slate-500 uppercase tracking-widest">
          <div>
            <p className="mb-1">Record Created</p>
            <p className="text-slate-300 normal-case tracking-normal text-xs">
              {player.createdAt ? new Date(player.createdAt).toLocaleString() : "N/A"}
            </p>
            <p className="mt-1 text-[9px] lowercase italic text-slate-600">by {player.createdBy || "system"}</p>
          </div>
          <div className="md:text-right">
            <p className="mb-1">Last Modified</p>
            <p className="text-slate-300 normal-case tracking-normal text-xs">
              {player.updatedAt ? new Date(player.updatedAt).toLocaleString() : "N/A"}
            </p>
            <p className="mt-1 text-[9px] lowercase italic text-slate-600">by {player.updatedBy || "system"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-slate-800/40 pb-2 last:border-none last:pb-0">
    <span className="text-[10px] text-slate-500 uppercase font-bold">{label}</span>
    <span className="text-sm font-semibold text-slate-200">{value || "—"}</span>
  </div>
);

export default PlayerProfileView;
