// src/pages/EditClubForm.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PitchBg from "../assets/hero.jpg";
import API from "../auth/api";

const EditClubForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clubName: "",
    district: "",
    province: "",
    contactPersonName: "",
    contactPhone: "",
    foundingYear: "",
    homeGroundName: "",
    homeGroundLocation: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/api/clubs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data;
        setFormData({
          clubName: data.clubName || "",
          district: data.district || "",
          province: data.province || "",
          contactPersonName: data.contactPersonName || "",
          contactPhone: data.contactPhone || "",
          foundingYear: data.foundingYear || "",
          homeGroundName: data.homeGroundName || "",
          homeGroundLocation: data.homeGroundLocation || ""
        });
      } catch (err) {
        setError("Failed to load club details.");
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await API.put(`/api/clubs/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Club updated successfully!");
      navigate("/clubs");
    } catch (err) {
      alert("Failed to update club.");
    }
  };

  if (loading) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-50 p-8"
      style={{
        backgroundImage: `linear-gradient(rgba(5, 10, 25, 0.9), rgba(5, 10, 25, 0.96)), url(${PitchBg})`,
        backgroundSize: "cover",
      }}
    >
      <div className="max-w-2xl mx-auto bg-slate-900/80 border border-slate-800 p-8 rounded-3xl backdrop-blur shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-emerald-300">Edit Club</h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Club Name</label>
              <input name="clubName" value={formData.clubName} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">District</label>
              <input name="district" value={formData.district} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Province</label>
              <input name="province" value={formData.province} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Founding Year</label>
              <input type="number" name="foundingYear" value={formData.foundingYear} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5" />
            </div>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Contact Person</label>
            <input name="contactPersonName" value={formData.contactPersonName} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5" />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Contact Phone</label>
            <input name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Home Ground</label>
              <input name="homeGroundName" value={formData.homeGroundName} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Location</label>
              <input name="homeGroundLocation" value={formData.homeGroundLocation} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5" />
            </div>
          </div>
          <div className="pt-4 flex gap-4">
            <button type="submit" className="flex-1 bg-emerald-500 text-slate-950 font-bold py-3 rounded-xl hover:bg-emerald-400">Save Changes</button>
            <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClubForm;
