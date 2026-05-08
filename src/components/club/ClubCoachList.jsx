// src/components/club/ClubCoachList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../auth/api";

const ClubCoachList = ({ clubId }) => {
  const [affiliations, setAffiliations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await API.get(`/api/coaches/club/${clubId}`);
        setAffiliations(res.data || []);
      } catch (err) {
        console.error("Failed to fetch club coaches:", err);
      } finally {
        setLoading(false);
      }
    };
    if (clubId) fetchCoaches();
  }, [clubId]);

  if (loading) return <div className="text-emerald-400 animate-pulse text-xs">Retrieving staff data...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {affiliations.length === 0 ? (
        <p className="text-slate-500 text-xs italic">No professional coaching staff assigned.</p>
      ) : (
        affiliations.map(aff => (
          <CoachAffiliationCard key={aff.id} affiliation={aff} />
        ))
      )}
    </div>
  );
};

const CoachAffiliationCard = ({ affiliation }) => {
  const [coach, setCoach] = useState(null);

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const res = await API.get(`/api/coaches/${affiliation.coachId}`);
        setCoach(res.data);
      } catch (err) {
        console.error("Failed to fetch coach details:", err);
      }
    };
    fetchCoach();
  }, [affiliation.coachId]);

  if (!coach) return <div className="h-24 bg-slate-900 animate-pulse rounded-2xl"></div>;

  return (
    <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-xl">
        {coach.fullName.charAt(0)}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-white text-sm">{coach.fullName}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full ${
            affiliation.role === 'HEAD_COACH' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'
          }`}>
            {affiliation.role.replace('_', ' ')}
          </span>
          <span className="text-[9px] text-slate-500 font-bold">{coach.licenseLevel}</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <Link to={`/coaches/${coach.id}/view`} className="text-[10px] text-slate-400 hover:text-emerald-400 font-bold uppercase transition">View</Link>
        <Link to={`/admin/edit-coach/${coach.id}`} className="text-[10px] text-slate-400 hover:text-sky-400 font-bold uppercase transition">Edit</Link>
      </div>
    </div>
  );
};

export default ClubCoachList;
