// src/pages/EditCoachForm.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";

const EditCoachForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    specialization: "",
    licenseLevel: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const res = await API.get(`/api/coaches/${id}`);
        setFormData({
          fullName: res.data.fullName,
          phone: res.data.phone || "",
          specialization: res.data.specialization || "Tactics",
          licenseLevel: res.data.licenseLevel || ""
        });
      } catch (err) {
        console.error("Failed to fetch coach:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoach();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/coaches/${id}`, formData);
      alert("✅ Profile updated successfully!");
      navigate(`/coaches/${id}/view`);
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to update profile.");
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8" style={{ backgroundImage: `url(${PitchBg})`, backgroundSize: "cover" }}>
      <div className="max-w-2xl mx-auto bg-slate-900/90 p-8 rounded-3xl backdrop-blur-xl border border-slate-800">
        <h1 className="text-3xl font-bold mb-6 text-sky-400">Edit Coach Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <input name="fullName" value={formData.fullName} required onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-sky-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-sky-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Specialization</label>
              <select name="specialization" value={formData.specialization} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-sky-500 outline-none">
                <option value="Tactics">Tactics</option>
                <option value="Goalkeeping">Goalkeeping</option>
                <option value="Fitness">Fitness</option>
                <option value="Youth Development">Youth Development</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">License Level</label>
              <input name="licenseLevel" value={formData.licenseLevel} placeholder="e.g. AFC A" onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-sky-500 outline-none" />
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button type="submit" className="flex-1 bg-sky-500 text-slate-950 font-black py-4 rounded-2xl hover:bg-sky-400 transition shadow-lg shadow-sky-500/20 uppercase tracking-widest">
              Save Changes
            </button>
            <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-slate-800 text-white font-black py-4 rounded-2xl hover:bg-slate-700 transition uppercase tracking-widest">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCoachForm;
