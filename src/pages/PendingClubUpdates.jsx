// src/pages/PendingClubUpdates.jsx
import React, { useEffect, useState } from "react";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";

const PendingClubUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const res = await API.get("/api/clubs/updates/pending");
      setUpdates(res.data);
    } catch (err) {
      console.error("Error fetching updates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/api/clubs/updates/${id}/approve`);
      alert("Update approved!");
      fetchUpdates();
    } catch (err) {
      alert("Failed to approve update.");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection:");
    if (!reason) return;
    try {
      await API.put(`/api/clubs/updates/${id}/reject`, { reason });
      alert("Update rejected.");
      fetchUpdates();
    } catch (err) {
      alert("Failed to reject update.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8" style={{ backgroundImage: `url(${PitchBg})`, backgroundSize: "cover" }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-emerald-400">Pending Club Profile Updates</h1>

        {loading ? (
          <p>Loading requests...</p>
        ) : updates.length === 0 ? (
          <div className="bg-slate-900/80 p-12 rounded-3xl border border-slate-800 text-center">
            <p className="text-slate-500">No pending club updates at this time.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {updates.map(update => (
              <div key={update.id} className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">{update.clubName}</h2>
                    <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Club ID: {update.clubId}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleApprove(update.id)} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2 rounded-xl font-bold transition text-sm">Approve</button>
                    <button onClick={() => handleReject(update.id)} className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/50 px-6 py-2 rounded-xl font-bold transition text-sm">Reject</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">District</p>
                    <p>{update.district}</p>
                  </div>
                  <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Province</p>
                    <p>{update.province}</p>
                  </div>
                  <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Home Ground</p>
                    <p>{update.homeGroundName}</p>
                  </div>
                  <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Requested</p>
                    <p>{new Date(update.requestedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingClubUpdates;
