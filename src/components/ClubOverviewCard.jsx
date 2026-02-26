// src/components/club/ClubOverviewCard.jsx
import React from "react";
import fallbackLogo from "../assets/placeholder.jpg"; // adjust path if needed

const FALLBACK_LOGO = fallbackLogo;

const ClubOverviewCard = ({ club, playerCount }) => {
  if (!club) return null;

  const manager =
    club.licenseManagerName || club.managerName || "Manager not set";
  const email = club.username || club.email || "Not provided";

  // ✅ Cloudinary URL (or whatever your backend returns)
  const logoUrl = club.logoUrl || null;

  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Logo */}
        <div className="flex justify-center sm:justify-start">
          {logoUrl ? (
            <div className="h-20 w-20 overflow-hidden rounded-2xl border border-emerald-400/50 bg-slate-950 shadow-lg">
              <img
                src={logoUrl}
                alt={`${club.clubName} Logo`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_LOGO;
                }}
              />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-xl font-semibold text-slate-100">
              {club.clubName?.charAt(0) || "C"}
            </div>
          )}
        </div>

        {/* Basic info */}
        <div className="flex-1 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Club Profile
          </p>
          <h2 className="text-xl font-semibold text-slate-50">
            {club.clubName}
          </h2>
          <p className="text-xs text-slate-300">
            Manager: <span className="text-slate-100">{manager}</span>
          </p>
          <p className="text-xs text-slate-400 break-all">
            Email: <span className="text-slate-100">{email}</span>
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
        <MiniStat label="Players" value={playerCount} />
        <MiniStat label="Category" value="Football" />
        <MiniStat label="Status" value="Active" />
      </div>
    </article>
  );
};

const MiniStat = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-left">
    <p className="text-[11px] uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold text-slate-50">{value}</p>
  </div>
);

export default ClubOverviewCard;
