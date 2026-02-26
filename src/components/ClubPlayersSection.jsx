// src/components/club/ClubPlayersSection.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import fallbackPlayerImg from "../assets/placeholder.jpg"; // adjust path if needed

const FALLBACK_PLAYER_IMG = fallbackPlayerImg;

const ClubPlayersSection = ({
  players = [],
  onAddPlayer,
  onEditPlayer,
  onRemovePlayer,
}) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredPlayers = useMemo(() => {
    const term = search.toLowerCase();
    if (!term) return players;
    return players.filter((p) => {
      return (
        p.name?.toLowerCase().includes(term) ||
        p.email?.toLowerCase().includes(term) ||
        p.role?.toLowerCase().includes(term) ||
        p.position?.pname?.toLowerCase().includes(term) ||
        p.position?.toLowerCase?.() // if position is a plain string
      );
    });
  }, [players, search]);

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-50">
            Squad / Players
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Manage your registered players, update details or remove them.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="sm:w-56">
            <label className="mb-1 block text-[11px] text-slate-300">
              Search players
            </label>
            <input
              type="text"
              placeholder="Name, email, position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          <button
            type="button"
            onClick={onAddPlayer}
            className="mt-1 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/30 hover:bg-emerald-400"
          >
            + Add Player
          </button>
        </div>
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="flex min-h-[120px] items-center justify-center text-xs text-slate-400">
          No players found for this club.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlayers.map((player) => {
            // ✅ Use Cloudinary URL (or whatever string URL your backend sends)
            const playerImgUrl =
              player.playerImageUrl ||
              player.playerImage || // if your entity uses this name
              null;

            return (
              <article
                key={player.id}
                className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs shadow-sm transition hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-emerald-500/20"
              >
                {/* Player header */}
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 overflow-hidden rounded-full border border-emerald-400/50 bg-slate-900">
                    <img
                      src={playerImgUrl || FALLBACK_PLAYER_IMG}
                      alt={player.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_PLAYER_IMG;
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-50">
                      {player.name}
                    </p>
                    <p className="text-[11px] text-emerald-300">
                      {player.position?.pname ||
                        player.position ||
                        player.role ||
                        "Player"}
                    </p>
                    <p className="text-[10px] text-slate-400 break-all">
                      {player.email}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                  <MiniStat label="Age" value={player.age || "—"} />
                  <MiniStat
                    label="Height"
                    value={player.height ? `${player.height} cm` : "—"}
                  />
                  <MiniStat
                    label="Weight"
                    value={player.weight ? `${player.weight} kg` : "—"}
                  />
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-between gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => navigate(`/players/${player.id}`)}
                    className="flex-1 rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1 hover:border-emerald-400 hover:text-emerald-200"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditPlayer(player.id)}
                    className="flex-1 rounded-lg bg-emerald-500 px-2 py-1 font-semibold text-slate-950 hover:bg-emerald-400"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemovePlayer(player.id)}
                    className="flex-1 rounded-lg border border-red-500/60 bg-red-500/10 px-2 py-1 text-red-200 hover:bg-red-500/20"
                  >
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

const MiniStat = ({ label, value }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-2 py-2 text-left">
    <p className="text-[10px] uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-0.5 text-xs font-semibold text-slate-50">{value}</p>
  </div>
);

export default ClubPlayersSection;
