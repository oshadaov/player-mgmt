// src/pages/AdminMatchManager.jsx
import React, { useState, useEffect } from "react";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";

const AdminMatchManager = () => {
  const [matches, setMatches] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [formData, setFormData] = useState({
    homeTeamName: "",
    awayTeamName: "",
    matchTime: "",
    venue: ""
  });

  useEffect(() => {
    fetchMatches();
    fetchClubs();
  }, []);

  const fetchMatches = async () => {
    const res = await API.get("/api/matches");
    setMatches(res.data || []);
  };

  const fetchClubs = async () => {
    const res = await API.get("/api/clubs?status=APPROVED");
    setClubs(res.data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/matches", formData);
      alert("Match scheduled!");
      setFormData({ homeTeamName: "", awayTeamName: "", matchTime: "", venue: "" });
      fetchMatches();
    } catch (err) {
      alert("Error scheduling match.");
    }
  };

  const handleUpdateScore = async (id) => {
    const homeScore = window.prompt("Enter Home Score:");
    const awayScore = window.prompt("Enter Away Score:");
    if (homeScore === null || awayScore === null) return;
    try {
      await API.put(`/api/matches/${id}/score`, { 
        homeScore: parseInt(homeScore), 
        awayScore: parseInt(awayScore) 
      });
      fetchMatches();
    } catch (err) {
      alert("Error updating score.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8" style={{ backgroundImage: `url(${PitchBg})`, backgroundSize: "cover" }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-emerald-400">Match Manager (Admin)</h1>
        
        <div className="bg-slate-900/80 p-6 rounded-2xl mb-8 border border-slate-800 backdrop-blur">
          <h2 className="text-lg font-bold mb-4">Schedule New Match</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-sm">
            <select name="homeTeamName" value={formData.homeTeamName} onChange={e => setFormData({...formData, homeTeamName: e.target.value})} className="bg-slate-950 p-2 rounded border border-slate-700">
              <option value="">Select Home Team</option>
              {clubs.map(c => <option key={c.id} value={c.clubName}>{c.clubName}</option>)}
            </select>
            <select name="awayTeamName" value={formData.awayTeamName} onChange={e => setFormData({...formData, awayTeamName: e.target.value})} className="bg-slate-950 p-2 rounded border border-slate-700">
              <option value="">Select Away Team</option>
              {clubs.map(c => <option key={c.id} value={c.clubName}>{c.clubName}</option>)}
            </select>
            <input type="datetime-local" name="matchTime" value={formData.matchTime} onChange={e => setFormData({...formData, matchTime: e.target.value})} className="bg-slate-950 p-2 rounded border border-slate-700" />
            <input placeholder="Venue" name="venue" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} className="bg-slate-950 p-2 rounded border border-slate-700" />
            <button type="submit" className="col-span-2 bg-emerald-500 text-slate-950 font-bold py-2 rounded">Schedule Match</button>
          </form>
        </div>

        <div className="space-y-4">
          {matches.map(m => (
            <div key={m.id} className="bg-slate-900/80 p-4 rounded-xl flex justify-between items-center border border-slate-800">
              <div>
                <p className="font-bold">{m.homeTeamName} vs {m.awayTeamName}</p>
                <p className="text-xs text-slate-400">{m.venue} • {new Date(m.matchTime).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                {m.status !== "FINISHED" && <button onClick={() => handleUpdateScore(m.id)} className="bg-emerald-600 px-3 py-1 rounded text-xs">Finish & Score</button>}
                <span className="text-xs font-bold text-emerald-400 uppercase">{m.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminMatchManager;
