import React from "react";
import Tag from "./Tag";
import InfoBox from "./InfoBox";
import playerData from "../../constants/PlayerData.js";
import hamzaImage from "../../assets/raveen.jpg";

const PlayerInfoBox = ({ name, position, foot }) => {
  const { bio } = playerData;

  return (
      <div className="flex flex-col gap-y-4 bg-white/10 backdrop-blur-lg p-6  shadow-xl border border-white/10 w-full">
        
        {/* Name and Image inline */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight drop-shadow-md">
            {name.split(" ")[0]} <br /> {name.split(" ")[1]}
          </h1>

          <img
            src={hamzaImage}
            alt={name}
            className="w-20 h-20 object-cover drop-shadow-xl rounded-full border border-white/10"
            style={{ filter: "contrast(1.1) saturate(1.2)" }}
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-3">
          <Tag label={`⚽ ${position}`} />
          <Tag label={`🦶 ${foot}`} />
        </div>

        
      </div>

  );
};

export default PlayerInfoBox;
