// src/pages/PlayerProfilePage.jsx
import React from "react";
import PlayerCard from "../components/playerComponets/PlayerCard";
import PlayerStatsTable from "../components/playerComponets/PlayerStatsTable";

const PlayerProfilePage = () => {
  return (
    <div className="bg-gradient-to-br from-pink-700 via-fuchsia-800 to-purple-900 text-white font-sans min-h-screen">
      {/* Hero / Profile Section */}
      <PlayerCard />

    </div>
  );
};

export default PlayerProfilePage;
