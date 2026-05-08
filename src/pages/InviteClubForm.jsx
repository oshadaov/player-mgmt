// src/pages/InviteClubForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";

const InviteClubForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clubName: "",
    licenseNumber: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/api/clubs/invite", formData);
      alert("✅ Invitation sent successfully!");
      navigate("/admin");
    } catch (err) {
      console.error("Invitation failed:", err);
      alert("❌ Failed to send invitation. Name or email might be taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8" style={{ backgroundImage: `url(${PitchBg})`, backgroundSize: "cover" }}>
      <div className="max-w-md mx-auto bg-slate-900/90 p-8 rounded-3xl backdrop-blur-xl border border-slate-800">
        <h1 className="text-3xl font-bold mb-2 text-emerald-400">Invite New Club</h1>
        <p className="text-xs text-slate-400 mb-8 font-medium">Issue an official registration invitation to a club.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Club Official Name" name="clubName" required onChange={handleChange} />
          <Input label="Club License Number" name="licenseNumber" required onChange={handleChange} />
          <Input label="Contact Email Address" name="email" type="email" required onChange={handleChange} />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-2xl hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? "Sending Invitation..." : "Send Official Invitation"}
          </button>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, name, type = "text", required, onChange }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">{label}</label>
    <input 
      name={name} 
      type={type} 
      required={required} 
      onChange={onChange} 
      className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-emerald-500 outline-none transition text-sm" 
    />
  </div>
);

export default InviteClubForm;
