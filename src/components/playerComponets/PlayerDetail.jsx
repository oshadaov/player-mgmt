import React from 'react';
import playerImage from '../../assets/raveen.jpg';


const PlayerDetail = () => {
  return (
    <>
    
    <div className="min-h-screen bg-[#0d1b2a] text-white font-sans px-4 md:px-10 py-12  justify-center">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left: Player Metrics */}
        <div className="bg-[#1b263b] rounded-2xl p-8 shadow-xl border border-[#324a5f]">
          <h2 className="text-blue-300 text-lg uppercase mb-6 tracking-wide font-semibold">Player Metrics</h2>
          <div className="space-y-6 text-base">
            <div className="flex justify-between">
              <span className="text-gray-400">Height</span>
              <span className="font-semibold text-white">6' 3"</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Weight</span>
              <span className="font-semibold text-white">240 lbs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Position</span>
              <span className="font-semibold text-white">QB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">College</span>
              <span className="font-semibold text-white">South Carolina</span>
            </div>
          </div>
        </div>

        {/* Center: Player Info */}
        <div className="flex flex-col items-center text-center bg-[#1b263b] rounded-2xl p-8 shadow-xl border border-[#324a5f]">
          <img
            src={playerImage}
            alt="LaNorris Sellers"
            className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <h1 className="text-3xl md:text-4xl font-bold mt-6">LaNorris Sellers</h1>
          <p className="text-blue-400 mt-2 text-lg">Quarterback • South Carolina</p>
          <div className="flex gap-4 mt-6 flex-wrap justify-center text-base text-gray-300">
            <span className="bg-[#415a77] px-5 py-2 rounded-full">Age: 20.2</span>
            <span className="bg-[#415a77] px-5 py-2 rounded-full">Draft: 2026</span>
            <span className="bg-[#415a77] px-5 py-2 rounded-full">BMI: --</span>
          </div>
        </div>

        {/* Right: Clubs and Leagues */}
        <div className="bg-[#1b263b] rounded-2xl p-8 shadow-xl border border-[#324a5f] space-y-8">
          <div>
            <h2 className="text-blue-300 text-lg uppercase mb-4 tracking-wide font-semibold">Clubs</h2>
            <div className="grid grid-cols-2 gap-6 text-base">
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Current</h4>
                <ul className="list-disc list-inside text-white">
                  <li>Gamecocks</li>
                </ul>
              </div>
              <div>
                <h4 className="text-gray-400 text-sm mb-2">Former</h4>
                <ul className="list-disc list-inside text-white">
                  <li>Columbia HS</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-blue-300 text-lg uppercase mb-4 tracking-wide font-semibold">Leagues</h2>
            <div className="flex gap-4 flex-wrap">
              <span className="bg-[#415a77] px-5 py-2 rounded-full text-base">NCAA</span>
              {/* More leagues can go here */}
            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  );
};

export default PlayerDetail;
