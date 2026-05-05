import React, { useEffect, useState } from "react";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";
import SuperAdminUserManagement from "../components/superadmin/SuperAdminUserManagement";
import SuperAdminStats from "../components/superadmin/SuperAdminStats";

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
      alert("Admin created! Default password: admin@123");
      setNewAdmin({ username: "" });
      fetchAdmins();
    } catch (err) {
      alert("Failed to create admin.");
    }
  };

  const handleRemoveAdmin = async (id) => {
    if (!window.confirm("Remove this admin?")) return;
    try {
      await API.delete(`/auth/users/${id}`);
      fetchAdmins();
    } catch (err) {
      alert("Failed to remove admin.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8" style={{ backgroundImage: `url(${PitchBg})`, backgroundSize: "cover" }}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-emerald-400">Super Admin Console</h1>
          <p className="text-slate-400 mt-2">Manage system administrators and oversee global settings.</p>
        </header>

        <section className="mb-12">
          <SuperAdminStats />
        </section>

        <section className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 mb-12 backdrop-blur-xl shadow-2xl">
          <h2 className="text-xl font-bold mb-6">Create New Administrator</h2>
          <form onSubmit={handleCreateAdmin} className="flex gap-4">
            <input 
              placeholder="Admin Username (Email)" 
              value={newAdmin.username} 
              onChange={e => setNewAdmin({username: e.target.value})}
              className="flex-1 bg-slate-950 border border-slate-700 p-3 rounded-xl outline-none focus:border-emerald-500 transition"
              required
            />
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-3 rounded-xl font-bold transition">
              Add Admin
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-6">System Administrators</h2>
          <SuperAdminUserManagement />
        </section>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
