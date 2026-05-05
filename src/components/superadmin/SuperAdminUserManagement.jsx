// src/components/superadmin/SuperAdminUserManagement.jsx
import React, { useEffect, useState } from "react";
import API from "../../auth/api";

const SuperAdminUserManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await API.get("/auth/admins");
        setAdmins(res.data || []);
      } catch (err) {
        console.error("Super Admin retrieval failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  if (loading) return <div className="text-emerald-400 animate-pulse">Retrieving Admin Ledger...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Global Administrator Ledger</h3>
      {admins.map(admin => (
        <div key={admin.id} className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800 rounded-2xl group hover:border-emerald-500/50 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 font-bold">
              {admin.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">{admin.username}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Access Level: Full Admin</p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-slate-500">Registered</p>
             <p className="text-xs text-slate-300">{new Date(admin.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuperAdminUserManagement;
