// src/components/ClubsSection.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../auth/api";
import fallbackLogo from "../assets/placeholder.jpg";

const FALLBACK_LOGO = fallbackLogo;

const ClubsSection = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.get("/api/clubs");
        const raw = res.data;
        const data = Array.isArray(raw)
          ? raw
          : raw?.content || raw?.clubs || [];
        setClubs(data);
      } catch (err) {
        console.error("Error fetching clubs:", err);
        setError("Failed to load clubs.");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return (
    <section className="border-t border-slate-800 bg-slate-950/90 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
              Discover teams
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-50 sm:text-4xl">
              Active clubs ready to connect.
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
              Browse registered clubs and view their details on the portal.
            </p>
          </div>
          <div className="rounded-full border border-emerald-500/20 bg-slate-900/70 px-4 py-2 text-sm text-slate-300">
            {loading
              ? "Fetching club list..."
              : `${clubs.length} clubs live now`}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-slate-400">Loading clubs...</p>
        ) : error ? (
          <p className="text-center text-red-300">{error}</p>
        ) : !clubs || clubs.length === 0 ? (
          <p className="text-center text-slate-500">
            No clubs available yet. Check back soon.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {clubs.map((club) => {
              const logoUrl = club.logoUrl || null;
              return (
                <div
                  key={club.id}
                  className="group flex flex-col items-center rounded-[1.75rem] border border-slate-800/90 bg-slate-900/80 p-6 text-center shadow-2xl shadow-slate-950/20 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-emerald-500/20"
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={`${club.clubName} Logo`}
                      className="mb-4 h-20 w-20 rounded-full object-cover ring-2 ring-emerald-400/35"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_LOGO;
                      }}
                    />
                  ) : (
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-2xl font-bold text-slate-100">
                      {club.clubName?.charAt(0) || "C"}
                    </div>
                  )}

                  <h3 className="text-xl font-semibold text-slate-50">
                    {club.clubName}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    {club.licenseManagerName ||
                      club.managerName ||
                      "Club manager not set"}
                  </p>
                  <p className="mt-2 text-xs text-slate-400 break-all">
                    {club.username || club.email || "No email provided"}
                  </p>

                  <div className="mt-5 flex w-full flex-col gap-3 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                    <span className="inline-flex rounded-full bg-slate-800/70 px-4 py-2">
                      Football club
                    </span>
                    <Link
                      to={`/clubs/${club.id}/view`}
                      className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                    >
                      View club
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ClubsSection;
