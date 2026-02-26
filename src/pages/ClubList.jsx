// src/pages/ClubList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL 

const ClubList = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const res = await API.get("/api/clubs/all", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const raw = res.data;
        const data = Array.isArray(raw)
          ? raw
          : raw?.content || raw?.clubs || [];

        console.log("📌 Admin clubs response:", raw);
        setClubs(data);
      } catch (err) {
        console.error("❌ Error fetching clubs:", err);
        setError("Failed to load clubs");
        setClubs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  // ✅ Always work with a guaranteed array
  const clubArray = Array.isArray(clubs) ? clubs : [];

  // Helper: does this club have *some* logo info?
  const clubHasLogo = (club) =>
    !!(club.logoUrl || club.logo || club.clubLogo);

  const totalClubs = clubArray.length;
  const clubsWithLogo = clubArray.filter(clubHasLogo).length;
  const clubsWithoutLogo = totalClubs - clubsWithLogo;

  const visibleClubs = clubArray.filter((club) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;

    const manager = club.licenseManagerName || club.managerName || "";
    const email = club.username || club.email || "";

    return (
      club.clubName?.toLowerCase().includes(term) ||
      manager.toLowerCase().includes(term) ||
      email.toLowerCase().includes(term)
    );
  });

  // 🔧 Build a usable logo URL from whatever the backend gives
  const getLogoUrl = (club) => {
    // 1) If you later store a `logoUrl` (local disk / Cloudinary)
    if (club.logoUrl) {
      // If backend returns full URL -> use as is
      if (club.logoUrl.startsWith("http")) return club.logoUrl;
      // If backend returns relative path -> prefix with API base
      return `${API_BASE_URL}${club.logoUrl}`;
    }

    // 2) If you still have /api/clubs/{id}/logo endpoint
    if (club.id) {
      return `${API_BASE_URL}/api/clubs/${club.id}/logo`;
    }

    // 3) If you *temporarily* still return Base64 in `logo`
    if (club.logo) {
      return `data:image/png;base64,${club.logo}`;
    }

    // No logo
    return null;
  };

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

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
              Admin Dashboard
            </p>
            <h1 className="text-2xl font-semibold md:text-3xl">
              Clubs Overview
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              View and manage all registered clubs in the system.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <Link
              to="/"
              className="rounded-full bg-slate-900/80 px-3 py-1 text-slate-300 hover:text-emerald-300"
            >
              ← Back to Home
            </Link>
            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-slate-300">
              Role: <span className="text-emerald-300">Admin</span>
            </span>
          </div>
        </header>

        {/* Top row: stats + search */}
        <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="grid grid-cols-3 gap-3 md:w-auto md:min-w-[320px]">
            <StatCard label="Total Clubs" value={totalClubs} />
            <StatCard label="With Logos" value={clubsWithLogo} />
            <StatCard label="No Logo" value={clubsWithoutLogo} />
          </div>

          <div className="md:w-72">
            <label className="mb-1 block text-xs text-slate-300">
              Search clubs
            </label>
            <input
              type="text"
              placeholder="Search by name, manager, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </div>
        </section>

        {/* Content */}
        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-400">
            Loading clubs...
          </div>
        ) : error ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          </div>
        ) : visibleClubs.length === 0 ? (
          <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-400">
            No clubs match your search.
          </div>
        ) : (
          <section>
            <div className="mb-3 text-xs text-slate-400">
              Showing{" "}
              <span className="text-emerald-300">{visibleClubs.length}</span> of{" "}
              <span className="text-emerald-300">{totalClubs}</span> clubs
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleClubs.map((club) => {
                const manager =
                  club.licenseManagerName ||
                  club.managerName ||
                  "Not set";
                const email =
                  club.username || club.email || "Not provided";

                const logoUrl = getLogoUrl(club);

                return (
                  <article
                    key={club.id}
                    className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg transition hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-emerald-500/20"
                  >
                    {/* Logo */}
                    <div className="mb-4 flex justify-center">
                      {logoUrl ? (
                        <div className="h-20 w-20 overflow-hidden rounded-2xl border border-emerald-400/40 bg-slate-950">
                          <img
                            src={logoUrl}
                            alt={`${club.clubName} Logo`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              // graceful fallback: first letter badge
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-xl font-semibold text-slate-100">
                          {club.clubName?.charAt(0) || "C"}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <h2 className="text-lg font-semibold text-center text-slate-50">
                      {club.clubName}
                    </h2>
                    <p className="mt-1 text-center text-xs text-slate-300">
                      Manager:{" "}
                      <span className="text-slate-100">{manager}</span>
                    </p>
                    <p className="mt-1 break-all text-center text-[11px] text-slate-400">
                      {email}
                    </p>

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between text-[11px] text-slate-300">
                      <span className="rounded-full bg-slate-800/90 px-3 py-1">
                        Category: Football
                      </span>
                      <Link
                        to={`/clubs/${club.id}`}
                        className="text-emerald-300 hover:text-emerald-200"
                      >
                        View &rsaquo;
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-left shadow-sm backdrop-blur">
    <p className="text-[11px] uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="text-base font-semibold text-slate-50">{value}</p>
  </div>
);

export default ClubList;
