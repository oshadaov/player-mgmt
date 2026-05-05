// src/pages/PlayerProfileEdit.jsx
import React, { useEffect, useState } from "react";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";

const PlayerProfileEdit = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    homeAddress: "",
    position: "",
    dominantFoot: "",
    jerseyNumber: ""
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const playerId = localStorage.getItem("entityId");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/api/players/${playerId}`);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching player profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [playerId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.put(`/api/players/${playerId}/self-update`, formData);
      alert("Update request submitted! Your club manager will review and approve your changes.");
    } catch (err) {
      alert("Failed to submit update request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8" style={{ backgroundImage: `url(${PitchBg})`, backgroundSize: "cover" }}>
      <div className="max-w-2xl mx-auto bg-slate-900/90 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-emerald-400">Edit My Profile</h1>
        <p className="text-slate-400 mb-8 text-sm italic">
          * Note: All changes require approval from your Club Manager before becoming live.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
            <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none transition" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none transition" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email</label>
            <input name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none transition" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Home Address</label>
            <input name="homeAddress" value={formData.homeAddress} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none transition" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Position</label>
            <select name="position" value={formData.position} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none transition text-sm">
              <option value="GOALKEEPER">Goalkeeper</option>
              <option value="DEFENDER">Defender</option>
              <option value="MIDFIELDER">Midfielder</option>
              <option value="FORWARD">Forward</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Jersey Number</label>
            <input type="number" name="jerseyNumber" value={formData.jerseyNumber} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none transition" />
          </div>

          <div className="md:col-span-2 mt-4">
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-2xl transition disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {submitting ? "Submitting Request..." : "Request Profile Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerProfileEdit;
