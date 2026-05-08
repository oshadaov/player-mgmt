// src/pages/ClubDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";
import ClubOverviewCard from "../components/ClubOverviewCard";
import ClubSquadManager from "../components/club/ClubSquadManager";

const ClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await API.get(`/api/clubs/${id}`);
        setClub(res.data);
      } catch (err) {
        console.error("Error fetching club details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400">Loading Club Profile...</div>;
  if (!club) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400">Club not found.</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8" style={{ backgroundImage: `url(${PitchBg})`, backgroundSize: "cover" }}>
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white transition">← Back</button>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-emerald-400">Official Club Profile</h1>
          <div className="w-12"></div>
        </header>

        <ClubOverviewCard club={club} playerCount={club.players?.length || 0} />
        
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6 border-b border-slate-800 pb-2">Registered Squad</h2>
          <ClubSquadManager clubId={id} />
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;
