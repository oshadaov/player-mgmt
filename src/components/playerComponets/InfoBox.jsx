// src/components/InfoBox.jsx
import React from "react";

const InfoBox = ({ bio }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg w-full text-white">
      <h2 className="text-lg font-semibold mb-4 text-center text-white">📋 Player Info</h2>
      <ul className="space-y-2 text-sm">
        {Object.entries(bio).map(([key, val], idx) => (
          <li key={idx} className="flex justify-between border-b border-white/10 pb-1">
            <span className="uppercase font-medium text-white/80">{key}:</span>
            <span className="text-white">{val}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InfoBox;
