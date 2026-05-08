// src/components/superadmin/SuperAdminUserManagement.jsx
import React, { useEffect, useState } from "react";
import API from "../../auth/api";

const SuperAdminUserManagement = ({ admins, loading, onRemoveAdmin }) => {

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
          <div className="flex items-center gap-4">
            <div className="text-right">
               <p className="text-[10px] text-slate-500">Registered</p>
               <p className="text-xs text-slate-300">{new Date(admin.createdAt).toLocaleDateString()}</p>
            </div>
            <button 
              onClick={() => onRemoveAdmin(admin.id)}
              className="p-2 text-slate-500 hover:text-red-500 transition-colors"
              title="Revoke Admin Access"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuperAdminUserManagement;
