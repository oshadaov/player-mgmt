// src/pages/PendingPlayerUpdates.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";

const PendingPlayerUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/api/players/updates/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpdates(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching updates:", err);
      setError("Failed to load pending updates.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve these changes? Original player data will be updated.")) return;
    try {
      const token = localStorage.getItem("token");
      await API.put(`/api/players/updates/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Update approved!");
      fetchUpdates();
    } catch (err) {
      alert("Failed to approve update.");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Rejection reason:");
    if (reason === null) return;
    try {
      const token = localStorage.getItem("token");
      await API.put(`/api/players/updates/${id}/reject`, { reason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Update rejected.");
      fetchUpdates();
    } catch (err) {
      alert("Failed to reject update.");
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-50"
      style={{
        backgroundImage: `linear-gradient(rgba(5,10,25,0.9), rgba(5,10,25,0.96)), url(${PitchBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Pending Player Updates</h1>
            <p className="text-slate-400 text-sm">Review changes requested by clubs.</p>
          </div>
          <Link to="/admin" className="text-emerald-400 text-sm">← Back to Dashboard</Link>
        </header>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : updates.length === 0 ? (
          <p className="text-slate-400">No pending updates found.</p>
        ) : (
          <div className="grid gap-6">
            {updates.map(upd => (
              <div key={upd.id} className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl backdrop-blur">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-emerald-300">Player ID: {upd.playerId}</h3>
                    <p className="text-xs text-slate-400">Requested by Club ID: {upd.clubId}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(upd.id)} className="bg-emerald-600 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-emerald-500">Approve</button>
                    <button onClick={() => handleReject(upd.id)} className="bg-red-900/40 border border-red-500/50 text-red-400 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-500/20">Reject</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {upd.fullName && <InfoItem label="Full Name" value={upd.fullName} />}
                  {upd.phone && <InfoItem label="Phone" value={upd.phone} />}
                  {upd.email && <InfoItem label="Email" value={upd.email} />}
                  {upd.position && <InfoItem label="Position" value={upd.position} />}
                  {upd.jerseyNumber && <InfoItem label="Jersey #" value={upd.jerseyNumber} />}
                  {upd.dominantFoot && <InfoItem label="Foot" value={upd.dominantFoot} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
    <p className="text-[10px] uppercase text-slate-500">{label}</p>
    <p className="font-medium text-slate-200">{value}</p>
  </div>
);

export default PendingPlayerUpdates;
