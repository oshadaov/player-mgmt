// src/components/public/PublicClubGallery.jsx
import React from "react";

const PublicClubGallery = ({ clubs }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {clubs.map((club) => (
        <div 
          key={club.id} 
          className="group relative bg-slate-900/40 border border-slate-800 p-6 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -mr-6 -mt-6 blur-xl group-hover:bg-emerald-500/10 transition-colors" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-slate-950 flex items-center justify-center text-emerald-400 font-black border border-slate-800 group-hover:scale-110 transition-transform">
                {club.clubName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{club.clubName}</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{club.district}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6 text-[11px]">
              <span className="text-slate-400 font-medium">Official Member</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">VERIFIED</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PublicClubGallery;
