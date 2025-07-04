// src/components/PlayerStatsTable.jsx
import React from "react";
import statData from "../../constants/statData.js";

const PlayerStatsTable = () => {
  return (
    <div className="overflow-x-auto px-4">
      <table className="min-w-full border border-white/10 text-sm text-white bg-gradient-to-br from-blue-900 to-slate-900 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-800 text-white text-xs uppercase tracking-wider">
            <th className="px-4 py-3 text-left">Year</th>
            <th className="px-4 py-3 text-left">Games</th>
            <th className="px-4 py-3 text-left">Receptions</th>
            <th className="px-4 py-3 text-left">Receiving Yards</th>
            <th className="px-4 py-3 text-left">Target Share</th>
            <th className="px-4 py-3 text-left">Catch Rate</th>
            <th className="px-4 py-3 text-left">Receiving Touchdowns</th>
            <th className="px-4 py-3 text-left">Special Teams Yards</th>
            <th className="px-4 py-3 text-left">Age</th>
            <th className="px-4 py-3 text-left">School</th>
          </tr>
        </thead>
        <tbody>
          {statData.map((row, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-slate-800/60" : "bg-slate-700/50"
              } hover:bg-slate-600/40 transition`}
            >
              <td className="px-4 py-3">{row.year}</td>
              <td className="px-4 py-3">{row.games}</td>
              <td className="px-4 py-3">{row.receptions}</td>
              <td className="px-4 py-3">{row.receivingYards}</td>
              <td className="px-4 py-3">{row.targetShare}</td>
              <td className="px-4 py-3">{row.catchRate}</td>
              <td className="px-4 py-3">{row.receivingTDs}</td>
              <td className="px-4 py-3">{row.specialTeamsYards}</td>
              <td className="px-4 py-3">{row.age}</td>
              <td className="px-4 py-3">{row.school}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerStatsTable;
