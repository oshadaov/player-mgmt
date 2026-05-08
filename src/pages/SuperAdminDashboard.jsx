import React, { useEffect, useState } from "react";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";
import SuperAdminUserManagement from "../components/superadmin/SuperAdminUserManagement";
import SuperAdminStats from "../components/superadmin/SuperAdminStats";
import ActivityLogList from "../components/superadmin/ActivityLogList";

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAdmin, setNewAdmin] = useState({ username: "" });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await API.get("/auth/admins");
      setAdmins(res.data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/admins", newAdmin);
      alert("Admin account created successfully! Credentials have been sent to their email.");
      setNewAdmin({ username: "" });
      fetchAdmins();
    } catch (err) {
      alert("Failed to create admin. " + (err.response?.data || ""));
    }
  };

  const handleRemoveAdmin = async (id) => {
    if (!window.confirm("Permanently revoke this admin's access?")) return;
    try {
      await API.delete(`/auth/admins/${id}`);
      fetchAdmins();
    } catch (err) {
      alert("Failed to remove admin. " + (err.response?.data || ""));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20">
                Nexus Control
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
              Super Admin Console
            </h1>
            <p className="text-slate-400 mt-3 text-lg font-medium">
              Oversee administrative personnel and system integrity.
            </p>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Authenticated As</p>
            <p className="text-emerald-400 font-bold">System SuperAdmin</p>
          </div>
        </header>

        <section className="mb-12">
          <SuperAdminStats />
        </section>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <section className="lg:col-span-1 space-y-8">
            <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                Add Administrator
              </h2>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 block">Admin Email Address</label>
                  <input 
                    type="email"
                    placeholder="e.g. admin@slfootball.lk" 
                    value={newAdmin.username} 
                    onChange={e => setNewAdmin({username: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition"
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-4 rounded-2xl font-black transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]">
                  Authorize New Admin
                </button>
                <p className="text-[10px] text-slate-500 text-center px-4 leading-relaxed">
                  The newly authorized administrator will receive a secure temporary password via their registered email.
                </p>
              </form>
            </div>

            <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl">
              <h2 className="text-xl font-bold mb-6">Active Administrators</h2>
              <SuperAdminUserManagement 
                admins={admins} 
                loading={loading} 
                onRemoveAdmin={handleRemoveAdmin} 
              />
            </div>
          </section>

          <section className="lg:col-span-2">
            <ActivityLogList />
          </section>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
