// src/pages/ClubProfileEdit.jsx
import React, { useEffect, useState } from "react";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";

const ClubProfileEdit = () => {
  const [formData, setFormData] = useState({
    clubName: "",
    district: "",
    province: "",
    foundingYear: "",
    homeGroundName: "",
    homeGroundLocation: "",
    contactPersonName: "",
    contactPhone: ""
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const clubId = localStorage.getItem("entityId");
        const res = await API.get(`/api/clubs/${clubId}`);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching club:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const clubId = localStorage.getItem("entityId");
      await API.put(`/api/clubs/${clubId}/propose-update`, formData);
      alert("Update request submitted! An administrator will review your changes.");
    } catch (err) {
      alert("Failed to submit update request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8" style={{ backgroundImage: `url(${PitchBg})`, backgroundSize: "cover" }}>
      <div className="max-w-2xl mx-auto bg-slate-900/90 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-emerald-400">Edit Club Profile</h1>
        <p className="text-slate-400 mb-8 text-sm italic">
          * Note: All changes require approval from the Football Association before becoming live.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Club Name</label>
            <input name="clubName" value={formData.clubName} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none transition" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">District</label>
            <input name="district" value={formData.district} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none transition" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Province</label>
            <input name="province" value={formData.province} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none transition" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Home Ground</label>
            <input name="homeGroundName" value={formData.homeGroundName} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none transition" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Contact Person</label>
            <input name="contactPersonName" value={formData.contactPersonName} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none transition" />
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

export default ClubProfileEdit;
