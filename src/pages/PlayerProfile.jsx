// src/pages/PlayerProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../auth/api.js";
import PitchBg from "../assets/hero.jpg";
import PlaceHolder from "../assets/placeholder.jpg"

const PLACEHOLDER = {PlaceHolder};
const PlayerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const res = await api.get(`/players/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlayer(res.data);
      } catch (err) {
        console.error("❌ Error fetching player:", err);
        setError("Failed to load player details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300"
        style={{
          backgroundImage: `linear-gradient(rgba(5,10,25,0.9), rgba(5,10,25,0.96)), url(${PitchBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        Loading player details...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(5,10,25,0.9), rgba(5,10,25,0.96)), url(${PitchBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300"
        style={{
          backgroundImage: `linear-gradient(rgba(5,10,25,0.9), rgba(5,10,25,0.96)), url(${PitchBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        Player not found.
      </div>
    );
  }

  const bmiText =
    typeof player.bmi === "number" ? player.bmi.toFixed(2) : "—";

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-50"
      style={{
        backgroundImage: `linear-gradient(rgba(5,10,25,0.9), rgba(5,10,25,0.96)), url(${PitchBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* background accents */}
      <div className="pointer-events-none absolute -left-40 top-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-8">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-200 hover:text-emerald-300"
            onClick={() => navigate(-1)}
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[11px] text-slate-300">
            Player ID: <span className="text-emerald-300">{player.id}</span>
          </span>
        </div>

        {/* Main profile card */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {/* Player image */}
            <div className="flex justify-center md:justify-start">
              <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-emerald-400/60 bg-slate-950 shadow-lg">
                <img
                  src={player.playerImageUrl}
                  alt={player.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = {PLACEHOLDER}
                      ;
                  }}
                />
              </div>
            </div>

            {/* Basic info */}
            <div className="flex-1 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Player Profile
              </p>
              <h1 className="text-2xl font-semibold md:text-3xl">
                {player.name}
              </h1>
              <p className="text-sm text-slate-300">
                {player.position?.pname || "Position not set"}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                <MiniStat label="Role" value={player.role || "PLAYER"} />
                <MiniStat label="Age" value={player.age || "—"} />
                <MiniStat label="BMI" value={bmiText} />
                <MiniStat
                  label="Email"
                  value={player.email || "Not provided"}
                  isWide
                />
              </div>
            </div>
          </div>

          {/* Secondary info grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm">
            <InfoCard title="College" value={player.college || "Not provided"} />
            <InfoCard
              title="Height / Weight"
              value={
                player.height || player.weight
                  ? `${player.height || "—"} cm / ${player.weight || "—"} kg`
                  : "Not set"
              }
            />
            <InfoCard
              title="Birth Year"
              value={player.birthYear || "Not provided"}
            />
          </div>

          {/* Clubs & Leagues */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <PillSection
              title="Current Clubs"
              items={player.currentClubs?.map((club) => ({
                id: club.id,
                label: club.name,
                sub: club.type,
              }))}
              emptyText="No current clubs recorded."
            />

            <PillSection
              title="Leagues"
              items={player.leagues?.map((league) => ({
                id: league.lid,
                label: league.lname,
              }))}
              emptyText="No league data recorded."
            />
          </div>

          <div className="mt-6">
            <PillSection
              title="Former Local Clubs"
              items={player.formerLocalClubs?.map((club) => ({
                id: club.id,
                label: club.name,
              }))}
              emptyText="No former local clubs recorded."
            />
          </div>

          {/* Visa & Passport images */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <ImageCard
              title="Visa Photo"
              src={player.visaImageUrl}
            />
            <ImageCard
              title="Passport Photo"
              src={player.passportImageUrl}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

const MiniStat = ({ label, value, isWide = false }) => (
  <div
    className={`rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 ${
      isWide ? "col-span-2 sm:col-span-2" : ""
    }`}
  >
    <p className="text-[11px] uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-0.5 text-sm font-semibold text-slate-50 break-all">
      {value}
    </p>
  </div>
);

const InfoCard = ({ title, value }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-3">
    <p className="text-xs font-medium text-slate-300">{title}</p>
    <p className="mt-1 text-sm text-slate-50">{value}</p>
  </div>
);

const PillSection = ({ title, items, emptyText }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-3">
    <p className="text-xs font-medium text-slate-300 mb-2">{title}</p>
    {items && items.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item.id || item.label}
            className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-100 border border-slate-700"
          >
            {item.label}
            {item.sub && (
              <span className="text-[10px] text-slate-400">• {item.sub}</span>
            )}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-[11px] text-slate-500">{emptyText}</p>
    )}
  </div>
);

const ImageCard = ({ title, src, fallback }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-3">
    <p className="text-xs font-medium text-slate-300 mb-2">{title}</p>
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <img
        src={src}
        alt={title}
        className="w-full max-h-56 object-cover"
        onError={(e) => {
          e.currentTarget.src = fallback;
        }}
      />
    </div>
  </div>
);

export default PlayerProfile;
