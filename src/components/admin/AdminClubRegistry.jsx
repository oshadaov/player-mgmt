// src/components/admin/AdminClubRegistry.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../auth/api";

const AdminClubRegistry = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await API.get("/api/clubs");
        setClubs(res.data || []);
      } catch (err) {
        console.error("Admin club retrieval failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  if (loading) return <div className="text-sky-400 animate-pulse">Syncing League Registry...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="text-xs uppercase bg-slate-900/50 text-slate-500 border-b border-slate-800">
          <tr>
            <th className="px-6 py-4">Club Entity</th>
            <th className="px-6 py-4">District</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {clubs.map(club => (
            <tr key={club.id} className="hover:bg-slate-900/30 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-100">{club.clubName}</td>
              <td className="px-6 py-4">{club.district}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  club.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                }`}>
                  {club.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <Link to={`/clubs/${club.id}/view`} className="text-emerald-400 hover:underline">View Profile</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminClubRegistry;
