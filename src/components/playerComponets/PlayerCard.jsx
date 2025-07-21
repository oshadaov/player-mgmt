import StatBox from "./StatBox";
import InfoBox from "./InfoBox";
import PlayerInfoBox from "./PlayerInfoBox";
import playerData from "../../constants/PlayerData.js";
import hamzaImage from "../../assets/raveen.jpg";

const PlayerCard = () => {
  const { name, position, foot, stats, bio } = playerData;

  return (
    <div className="bg-gradient-to-br from-blue-300 to-purple-900 text-white font-sans px-4 md:px-10 py-14 flex justify-center">
      <div className="w-full md:w-[50vw] grid gap-0 items-start"> {/* gap-0 removes vertical spacing */}
        
        {/* Player Info Box */}
        <PlayerInfoBox name={name} position={position} foot={foot} />

        {/* Image & Info Side-by-Side */}
        <div className="flex flex-col md:flex-row items-stretch w-full">
          {/* Image Box */}
          <div className="bg-white/5 p-4  border border-white/10 shadow-lg w-full md:w-1/2 flex justify-center items-center">
            <img
              src={hamzaImage}
              alt={name}
              className="w object-cover drop-shadow-xl rounded-xl"
              style={{ filter: "contrast(1.1) saturate(1.2)" }}
            />
          </div>

          {/* Bio InfoBox */}
          <InfoBox bio={bio} />
        </div>

        {/* Stats Section */}
        <StatBox stats={stats} />
      </div>
    </div>
  );
};

export default PlayerCard;
