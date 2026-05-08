// src/components/admin/AdminClubApprovalList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../auth/api";

const AdminClubApprovalList = () => {
  const [pendingClubs, setPendingClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="text-amber-400 text-xs animate-pulse">
        Checking for new applications…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pendingClubs.length === 0 ? (
        <p className="text-xs text-slate-500 italic">No new club applications to review.</p>
      ) : (
        pendingClubs.map((club) => (
          <div
            key={club.id}
            className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-2xl flex flex-col gap-2"
          >
            <div>
              <p className="font-bold text-slate-200 text-sm truncate">{club.clubName}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {club.district} · {club.contactPersonName}
              </p>
              {club.submittedAt && (
                <p className="text-[10px] text-slate-600 mt-0.5">
                  Submitted: {new Date(club.submittedAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <button
              onClick={() => navigate(`/admin/clubs/${club.id}/review`)}
              className="w-full rounded-xl bg-amber-500/20 border border-amber-500/40 py-1.5 text-[11px] font-bold text-amber-300 hover:bg-amber-500/30 transition"
            >
              Review Application →
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminClubApprovalList;
