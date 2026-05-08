// src/pages/CoachList.jsx
import React, { useEffect, useState } from "react";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";

const CoachList = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await API.get("/api/coaches");
        setCoaches(res.data || []);
      } catch (err) {
        console.error("Failed to fetch coaches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoaches();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8" style={{ backgroundImage: `url(${PitchBg})`, backgroundSize: "cover" }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-emerald-400">Association Coaches</h1>

        {loading ? (
          <div className="text-emerald-400 animate-pulse">Syncing Coaching Registry...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coaches.map(coach => (
              <div key={coach.id} className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-sm hover:border-emerald-500/50 transition shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{coach.fullName}</h2>
                    <p className="text-xs text-slate-400">{coach.specialization}</p>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">
                    {coach.licenseLevel}
                  </span>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="text-slate-500">📧</span> {coach.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="text-slate-500">📞</span> {coach.phone || "No phone"}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/50">
                   <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Member Since</p>
                   <p className="text-xs text-slate-300">{new Date(coach.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachList;
