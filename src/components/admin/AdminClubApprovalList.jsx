// src/components/admin/AdminClubApprovalList.jsx
import React, { useEffect, useState } from "react";
import API from "../../auth/api";

const AdminClubApprovalList = () => {
  const [pendingClubs, setPendingClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await API.get("/api/clubs?status=PENDING");
        setPendingClubs(res.data || []);
      } catch (err) {
        console.error("Failed to fetch pending clubs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === "approve") {
        await API.put(`/api/clubs/${id}/approve`);
      } else {
        const reason = window.prompt("Reason for rejection:");
        if (!reason) return;
        await API.put(`/api/clubs/${id}/reject`, { reason });
      }
      setPendingClubs(prev => prev.filter(c => c.id !== id));
      alert(`Club ${action}d successfully.`);
    } catch (err) {
      alert(`Action failed: ${err.message}`);
    }
  };

  if (loading) return <div className="text-amber-400 text-xs animate-pulse">Checking for new applications...</div>;

  return (
    <div className="space-y-4">
      {pendingClubs.length === 0 ? (
        <p className="text-xs text-slate-500 italic">No new club applications to review.</p>
      ) : (
        pendingClubs.map(club => (
          <div key={club.id} className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-200">{club.clubName}</p>
              <p className="text-[10px] text-slate-500">{club.district} • Manager: {club.contactPersonName}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleAction(club.id, "approve")} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1 rounded-lg text-xs font-bold transition">Approve</button>
              <button onClick={() => handleAction(club.id, "reject")} className="bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1 rounded-lg text-xs font-bold transition">Reject</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminClubApprovalList;
