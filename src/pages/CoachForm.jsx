// src/pages/CoachForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";

const CoachForm = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [hasHeadCoach, setHasHeadCoach] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nic: "",
    specialization: "Tactics",
    licenseLevel: "AFC C",
    clubId: "",
    role: "HEAD_COACH"
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    const entityId = localStorage.getItem("entityId");
    
    if (role === "CLUB" && entityId) {
      setFormData(prev => ({ ...prev, clubId: entityId }));
      checkHeadCoach(entityId);
    }

    const fetchClubs = async () => {
      try {
        const res = await API.get("/api/clubs?status=APPROVED");
        setClubs(res.data || []);
      } catch (err) {
        console.error("Failed to fetch clubs:", err);
      }
    };
    fetchClubs();
  }, []);

  const checkHeadCoach = async (clubId) => {
    if (!clubId) return;
    try {
      const res = await API.get(`/api/coaches/club/${clubId}`);
      const exists = (res.data || []).some(a => a.role === 'HEAD_COACH' && a.active);
      setHasHeadCoach(exists);
      if (exists && formData.role === 'HEAD_COACH') {
        setFormData(prev => ({ ...prev, role: 'ASSISTANT_COACH' }));
      }
    } catch (err) {
      console.error("Head coach check failed:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "clubId") checkHeadCoach(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/coaches", formData);
      alert("✅ Coach registered successfully!");
      navigate("/admin");
    } catch (err) {
      console.error("Coach registration failed:", err);
      alert("❌ Registration failed. Email might already exist.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8" style={{ backgroundImage: `url(${PitchBg})`, backgroundSize: "cover" }}>
      <div className="max-w-2xl mx-auto bg-slate-900/90 p-8 rounded-3xl backdrop-blur-xl border border-slate-800">
        <h1 className="text-3xl font-bold mb-6 text-emerald-400">Register New Coach</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <input name="fullName" required onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
              <input name="email" type="email" required onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
              <input name="phone" onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">NIC / ID</label>
              <input name="nic" onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Specialization</label>
              <select name="specialization" onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none">
                <option value="Tactics">Tactics</option>
                <option value="Goalkeeping">Goalkeeping</option>
                <option value="Fitness">Fitness</option>
                <option value="Youth Development">Youth Development</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">License Level</label>
              <input name="licenseLevel" placeholder="e.g. AFC A" onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-slate-400 mb-4">Club Affiliation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Primary Club</label>
                <select 
                  name="clubId" 
                  required 
                  value={formData.clubId}
                  disabled={localStorage.getItem("role") === "CLUB"}
                  onChange={handleChange} 
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none disabled:opacity-50"
                >
                  <option value="">Select a Club</option>
                  {clubs.map(c => (
                    <option key={c.id} value={c.id}>{c.clubName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Coaching Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl focus:border-emerald-500 outline-none">
                  <option value="HEAD_COACH" disabled={hasHeadCoach}>Head Coach {hasHeadCoach ? "(Already Assigned)" : ""}</option>
                  <option value="ASSISTANT_COACH">Assistant Coach</option>
                  <option value="GOALKEEPER_COACH">Goalkeeper Coach</option>
                  <option value="TECHNICAL_DIRECTOR">Technical Director</option>
                </select>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-2xl hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 uppercase tracking-widest mt-6">
            Register Coach
          </button>
        </form>
      </div>
    </div>
  );
};

export default CoachForm;
