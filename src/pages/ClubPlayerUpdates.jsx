import React, { useEffect, useState } from "react";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";
import { useAuth } from "../auth/AuthContext";

const ClubPlayerUpdates = () => {
  const { user } = useAuth();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.entityId && user.entityId !== "null") {
      fetchUpdates();
    }
  }, [user]);

  const fetchUpdates = async () => {
    try {
      const res = await API.get(`/api/players/updates/club/${user.entityId}`);
      setUpdates(res.data || []);
    } catch (err) {
      console.error("Error fetching player updates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/api/players/updates/${id}/approve`);
      alert("Update approved and applied to player profile!");
      fetchUpdates();
    } catch (err) {
      alert("Failed to approve update.");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection:");
    if (!reason) return;
    try {
      await API.put(`/api/players/updates/${id}/reject`, { reason });
      alert("Update rejected.");
      fetchUpdates();
    } catch (err) {
      alert("Failed to reject update.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8" style={{ backgroundImage: `url(${PitchBg})`, backgroundSize: "cover" }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-emerald-400">Review Player Updates</h1>
        <p className="text-slate-400 mb-8">As a Club Manager, you are responsible for verifying and approving any profile changes requested by your players.</p>

        {loading ? (
          <p>Loading requests...</p>
        ) : updates.length === 0 ? (
          <div className="bg-slate-900/80 p-12 rounded-3xl border border-slate-800 text-center">
            <p className="text-slate-500">No pending player updates for your squad.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {updates.map(update => (
              <div key={update.id} className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">{update.fullName}</h2>
                    <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Player ID: {update.playerId}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleApprove(update.id)} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2 rounded-xl font-bold transition text-sm">Approve</button>
                    <button onClick={() => handleReject(update.id)} className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/50 px-6 py-2 rounded-xl font-bold transition text-sm">Reject</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Position</p>
                    <p>{update.position}</p>
                  </div>
                  <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Jersey</p>
                    <p>#{update.jerseyNumber}</p>
                  </div>
                  <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Phone</p>
                    <p>{update.phone}</p>
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

export default ClubPlayerUpdates;
