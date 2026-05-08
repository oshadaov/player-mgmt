// src/components/admin/AdminPlayerRegistry.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../auth/api";

const AdminPlayerRegistry = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await API.get("/api/players");
        setPlayers(res.data || []);
      } catch (err) {
        console.error("Admin player retrieval failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  if (loading) return <div className="text-emerald-400 animate-pulse">Syncing Player Registry...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="text-xs uppercase bg-slate-900/50 text-slate-500 border-b border-slate-800">
          <tr>
            <th className="px-6 py-4">Player Name</th>
            <th className="px-6 py-4">Position</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {players.map(player => (
            <tr key={player.id} className="hover:bg-slate-900/30 transition-colors">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-100">{player.fullName}</span>
                  <span className="text-[10px] text-slate-500">{player.nic}</span>
                </div>
              </td>
              <td className="px-6 py-4">{player.position}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  player.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400" : 
                  player.status === "MISMATCH" ? "bg-red-500/10 text-red-400" :
                  "bg-amber-500/10 text-amber-400"
                }`}>
                  {player.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <Link to={`/players/${player.id}/view`} className="text-emerald-400 hover:underline">View Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPlayerRegistry;
