// src/components/StatBox.jsx
import React from "react";
import { FaFutbol, FaBullseye, FaHandsHelping, FaTrophy } from "react-icons/fa";

const StatBox = ({ stats }) => {
  const statItems = [
    { label: "Appearances", value: stats.appearances, icon: <FaFutbol /> },
    { label: "Goals", value: stats.goals, icon: <FaBullseye /> },
    { label: "Assists", value: stats.assists, icon: <FaHandsHelping /> },
    { label: "Wins", value: stats.wins, icon: <FaTrophy /> },
  ];

  return (
    <div className="bg-gradient-to-br from-purple-800 to-fuchsia-700/90 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-2xl">
      <h2 className="text-lg font-semibold mb-4 text-center">📊 Player Stats</h2>
      <div className="grid grid-cols-4 gap-4">
        {statItems.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white/10 p-3 rounded-xl shadow-md hover:bg-white/20 transition"
          >
            <div className="text-2xl text-yellow-300 mb-1">{item.icon}</div>
            <p className="text-xl font-bold">{item.value}</p>
            <p className="text-xs text-white/80 mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatBox;
