// src/pages/PublicRegistry.jsx
import React, { useEffect, useState } from "react";
import PitchBg from "../assets/hero.jpg";
import API from "../auth/api";
import PublicClubGallery from "../components/public/PublicClubGallery";
import PublicPlayerGallery from "../components/public/PublicPlayerGallery";

const PublicRegistry = () => {
  const [data, setData] = useState({ clubs: [], players: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("clubs");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/api/registry");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching registry:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
      <main className="mx-auto max-w-6xl px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-emerald-400">Official Registry</h1>
          <p className="text-slate-400 mt-2">Verified clubs and players of the Football Association.</p>
        </header>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setTab("clubs")}
            className={`px-8 py-2 rounded-full font-semibold transition ${tab === "clubs" ? "bg-emerald-500 text-slate-950" : "bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"}`}
          >
            Clubs
          </button>
          <button
            onClick={() => setTab("players")}
            className={`px-8 py-2 rounded-full font-semibold transition ${tab === "players" ? "bg-emerald-500 text-slate-950" : "bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"}`}
          >
            Players
          </button>
        </div>

        {loading ? (
          <p className="text-center text-slate-500">Retrieving official registry data...</p>
        ) : (
          <div className="relative z-10">
            {tab === "clubs" ? (
              <PublicClubGallery clubs={data.clubs} />
            ) : (
              <PublicPlayerGallery players={data.players} />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PublicRegistry;
