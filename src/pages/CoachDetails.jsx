// src/pages/CoachDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";

const CoachDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const res = await API.get(`/api/coaches/${id}`);
        setCoach(res.data);
      } catch (err) {
        console.error("Failed to fetch coach:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoach();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400">Loading Coach Profile...</div>;
  if (!coach) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400">Coach not found.</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8" style={{ backgroundImage: `url(${PitchBg})`, backgroundSize: "cover" }}>
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 text-slate-400 hover:text-white flex items-center gap-2">
          <span>←</span> Back
        </button>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-5xl font-black text-emerald-400">
              {coach.fullName.charAt(0)}
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">{coach.fullName}</h1>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="px-4 py-1 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-full text-xs font-bold uppercase">
                  {coach.licenseLevel} Certified
                </span>
                <span className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase">
                  {coach.specialization} Expert
                </span>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/admin/edit-coach/${coach.id}`)}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-xs font-bold transition"
            >
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 border-t border-slate-800 pt-8">
            <InfoBlock label="Email Address" value={coach.email} />
            <InfoBlock label="Phone Number" value={coach.phone || "N/A"} />
            <InfoBlock label="NIC / Identification" value={coach.nic || "N/A"} />
            <InfoBlock label="Status" value="Verified Technical Staff" />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBlock = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-medium text-slate-200">{value}</p>
  </div>
);

export default CoachDetails;
