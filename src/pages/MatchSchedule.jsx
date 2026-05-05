// src/pages/MatchSchedule.jsx
import React, { useEffect, useState } from "react";
import PitchBg from "../assets/hero.jpg";
import API from "../auth/api";

const MatchSchedule = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await API.get("/api/matches");
        setMatches(res.data || []);
      } catch (err) {
        console.error("Error fetching matches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-50"
      style={{
        backgroundImage: `linear-gradient(rgba(5,10,25,0.9), rgba(5,10,25,0.96)), url(${PitchBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <main className="mx-auto max-w-5xl px-4 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-emerald-400">Match Schedule</h1>
          <p className="text-slate-400">Upcoming and recent matches in the league.</p>
        </header>

        {loading ? (
          <p>Loading schedule...</p>
        ) : matches.length === 0 ? (
          <p className="text-slate-500">No matches scheduled yet.</p>
        ) : (
          <div className="space-y-4">
            {matches.map(match => (
              <div key={match.id} className="bg-slate-900/70 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur">
                <div className="flex-1 text-right">
                  <h3 className="text-xl font-bold">{match.homeTeamName}</h3>
                  <p className="text-xs text-slate-500">Home</p>
                </div>
                
                <div className="flex flex-col items-center px-8 border-x border-slate-800">
                  <div className="text-2xl font-black text-emerald-300">
                    {match.status === "FINISHED" ? `${match.homeScore} - ${match.awayScore}` : "VS"}
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-2">{match.status}</p>
                </div>

                <div className="flex-1 text-left">
                  <h3 className="text-xl font-bold">{match.awayTeamName}</h3>
                  <p className="text-xs text-slate-500">Away</p>
                </div>

                <div className="w-full md:w-auto pt-4 md:pt-0 text-center md:text-right">
                  <p className="text-sm font-medium">{new Date(match.matchTime).toLocaleDateString()}</p>
                  <p className="text-xs text-slate-400">{match.venue}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MatchSchedule;
