// src/components/superadmin/SuperAdminStats.jsx
import React, { useEffect, useState } from "react";
import API from "../../auth/api";

const SuperAdminStats = () => {
  const [stats, setStats] = useState({ admins: 0, clubs: 0, players: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [admins, clubs, players] = await Promise.all([
          API.get("/auth/admins"),
          API.get("/api/clubs"),
          API.get("/api/players")
        ]);
        setStats({
          admins: admins.data.length,
          clubs: clubs.data.length,
          players: players.data.length
        });
      } catch (err) {
        console.error("Global stats retrieval failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="h-20 bg-slate-900/50 rounded-2xl animate-pulse" />;

  return (
    <div className="grid grid-cols-3 gap-6">
      <StatBox label="Administrators" value={stats.admins} color="emerald" />
      <StatBox label="Active Clubs" value={stats.clubs} color="sky" />
      <StatBox label="Total Players" value={stats.players} color="purple" />
    </div>
  );
};

const StatBox = ({ label, value, color }) => (
  <div className={`bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl`}>
    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 mb-2">{label}</p>
    <p className={`text-4xl font-black text-${color}-500`}>{value}</p>
  </div>
);

export default SuperAdminStats;
