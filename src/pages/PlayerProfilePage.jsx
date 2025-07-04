// src/pages/PlayerProfilePage.jsx
import React from "react";
import PlayerCard from "../components/playerComponets/PlayerCard";
import PlayerStatsTable from "../components/playerComponets/PlayerStatsTable";

const PlayerProfilePage = () => {
  return (
    <div className="bg-gradient-to-br from-pink-700 via-fuchsia-800 to-purple-900 text-white font-sans min-h-screen">
      {/* Hero / Profile Section */}
      <PlayerCard />

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <hr className="border-white/20 my-10" />
        <h2 className="text-3xl font-bold mb-6 text-center">📊 Career Season Stats</h2>

        {/* Stats Table Section */}
        <PlayerStatsTable />
      </div>
    </div>
  );
};

export default PlayerProfilePage;
