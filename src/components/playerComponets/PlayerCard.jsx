// src/components/PlayerCard.jsx
import React from "react";
import Tag from "./Tag";
import StatBox from "./StatBox";
import InfoBox from "./InfoBox";
import playerData from "../../constants/PlayerData.js";
import hamzaImage from "../../assets/raveen.jpg";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";


const PlayerCard = () => {
  const { name, position, foot, value, stats, bio } = playerData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-900 text-white font-sans px-4 md:px-10 py-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

        {/* Column 1: Player Info */}
        <div className="space-y-6 bg-white/5 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/10">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight drop-shadow-md">
            {name.split(" ")[0]} <br /> {name.split(" ")[1]}
          </h1>

          <div className="flex flex-wrap gap-3">
            <Tag label={`⚽ ${position}`} />
            <Tag label={`🦶 ${foot}`} />
          </div>

          <div className="bg-white/10 px-5 py-4 rounded-2xl shadow-inner border border-white/10">
            <p className="text-yellow-300 text-sm font-medium">Player Value</p>
            <p className="text-3xl font-bold tracking-wide">{value}</p>
            <p className="text-xs mt-2 text-white/70">Is player value higher or lower?</p>
          </div>

          {/* <div className="flex gap-5 text-2xl mt-6 text-white/90">
            <FaFacebook className="hover:text-pink-300 cursor-pointer transition" />
            <FaInstagram className="hover:text-pink-300 cursor-pointer transition" />
            <FaYoutube className="hover:text-pink-300 cursor-pointer transition" />
            <FaTiktok className="hover:text-pink-300 cursor-pointer transition" />
          </div> */}
        </div>

        {/* Column 2: Centered Image */}
        <div className="flex justify-center items-center">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-lg">
            <img
              src={hamzaImage}
              alt={name}
              className="w-[90%] md:w-[100%] object-contain drop-shadow-2xl rounded-xl"
              style={{ filter: "contrast(1.1) saturate(1.2)" }}
            />
          </div>
        </div>

        {/* Column 3: Stats & Info */}
        <div className="flex flex-col gap-8">
          <InfoBox bio={bio} />
          

        </div>
        <StatBox stats={stats} />
      </div>
    </div>
  );
};

export default PlayerCard;
