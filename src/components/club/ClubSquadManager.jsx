// src/components/club/ClubSquadManager.jsx
import React, { useEffect, useState } from "react";
import API from "../../auth/api";
import { useNavigate } from "react-router-dom";

const ClubSquadManager = ({ clubId }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchSquad = async () => {
      try {
        const res = await API.get(`/api/players/club/${clubId}`);
        setPlayers(res.data || []);
      } catch (err) {
        console.error("Squad retrieval failed:", err);
      } finally {
        setLoading(false);
      }
    };
    if (clubId) fetchSquad();
  }, [clubId]);

  if (loading) return <div className="p-4 bg-slate-900 rounded-2xl animate-pulse">Scanning Roster...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {players.length === 0 ? (
        <div className="col-span-full p-8 text-center bg-slate-900/50 rounded-3xl border border-dashed border-slate-700">
          <p className="text-slate-500">No players registered in the squad.</p>
        </div>
      ) : (
        players.map(player => (
          <div key={player.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center gap-4 hover:border-emerald-500/40 transition shadow-lg cursor-pointer" onClick={() => navigate(`/players/${player.id}/view`) }>
            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 font-bold border border-slate-700">
              #{player.jerseyNumber}
            </div>
            <div>
              <p className="font-semibold text-slate-100">{player.fullName}</p>
              <p className="text-[11px] text-slate-500 uppercase">{player.position} • {player.ageCategory}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ClubSquadManager;
