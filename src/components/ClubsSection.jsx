// src/components/ClubsSection.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../auth/api"; // ✅ axios instance with baseURL http://localhost:8022
import fallbackLogo from "../assets/placeholder.jpg";

const FALLBACK_LOGO = fallbackLogo;

const ClubsSection = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔁 Fetch clubs from backend on mount
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        setError("");

        // If /api/clubs/all is public (permitAll), no token required
        const res = await API.get("/api/clubs/all");

        // Some backends return an array, some wrap in {content: [...]}
        const raw = res.data;
        const data = Array.isArray(raw) ? raw : raw?.content || raw?.clubs || [];

        console.log("🌐 /api/clubs/all response in ClubsSection:", raw);
        setClubs(data);
      } catch (err) {
        console.error("❌ Error fetching clubs in ClubsSection:", err);
        setError("Failed to load clubs.");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return (
    <section className="border-t border-slate-800 bg-slate-950/90 py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">
              Available Clubs
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Browse the clubs currently registered in the system.
            </p>
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => {
              // ✅ Prefer logoUrl (Cloudinary or stored URL)
              const logoUrl = club.logoUrl || null;

              return (
                <div
                  key={club.id}
                  className="group flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center shadow-lg transition hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-emerald-500/20"
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={`${club.clubName} Logo`}
                      className="mb-4 h-20 w-20 rounded-full object-cover ring-2 ring-emerald-400/40"
                      onError={(e) => {
                        // if Cloudinary URL fails, fall back
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_LOGO;
                      }}
                    />
                  ) : (
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-lg font-semibold text-slate-100">
                      {club.clubName?.charAt(0) || "C"}
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-slate-50">
                    {club.clubName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-300">
                    {club.licenseManagerName ||
                      club.managerName ||
                      "Manager not set"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 break-all">
                    {club.username || club.email || "No email provided"}
                  </p>

                  <div className="mt-4 flex w-full items-center justify-between text-[11px] text-slate-400">
                    <span className="rounded-full bg-slate-800/80 px-3 py-1">
                      Category: Football
                    </span>

                    <Link
                      to={`/clubs/${club.id}`}
                      className="text-emerald-300 group-hover:text-emerald-200"
                    >
                      View more &rsaquo;
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
