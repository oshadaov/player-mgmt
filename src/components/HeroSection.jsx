import React from "react";
import { Link } from "react-router-dom";
import FootballStadium from "../assets/hero.jpg";
import { useAuth } from "../auth/AuthContext";

const HeroSection = ({ clubsCount = 0 }) => {
  const { token, user } = useAuth();
  const currentRole = user?.role || localStorage.getItem("role");
  const currentEntityId = user?.entityId || localStorage.getItem("entityId");

  return (
    <section
      className="relative flex min-h-[calc(100vh-4rem)] items-center px-4 pb-16 pt-24 sm:px-6 lg:pb-24"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(6, 10, 28, 0.78), rgba(4, 7, 17, 0.96)), url(${FootballStadium})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-slate-950/40" />
      <div className="absolute left-8 top-32 hidden h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl sm:block" />
      <div className="absolute right-6 bottom-24 hidden h-56 w-56 rounded-full bg-sky-500/10 blur-3xl lg:block" />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-10">
        <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3 rounded-full bg-white/10 px-3 py-2 text-sm text-slate-100 shadow-lg shadow-slate-950/20 ring-1 ring-slate-700/80 backdrop-blur">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500 text-base font-bold text-slate-950">
              SP
            </div>
            <span className="font-semibold tracking-tight">Sports Portal</span>
          </div>
          <nav className="hidden gap-6 text-xs font-medium text-slate-200 md:flex">
            <a href="#features" className="transition hover:text-emerald-300">
              Features
            </a>
            <a href="#clubs" className="transition hover:text-emerald-300">
              Clubs
            </a>
            <a href="#activity" className="transition hover:text-emerald-300">
              Activity
            </a>
            {token && (
              <Link 
                to={
                  currentRole === "SUPER_ADMIN" ? "/superadmindashboard" :
                  currentRole === "ADMIN" ? "/admindashboard" :
                  currentRole === "CLUB" ? `/clubs/${currentEntityId}` :
                  "/players/profile"
                } 
                className="text-emerald-400 font-bold hover:text-emerald-300"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      </header>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200 shadow-lg shadow-slate-950/15">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-xs text-slate-950">
              ⚽
            </span>
            Designed for clubs & players
          </div>

          <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
            Elevate your football management with a modern matchday experience.
          </h1>

          <p className="max-w-2xl text-sm text-slate-200 sm:text-base">
            Manage squads, fixtures, player stats and club activity in one
            polished, responsive portal designed for every screen.
          </p>

          <div className="grid gap-3 text-left text-xs text-slate-200 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-900/70 px-4 py-3 shadow-slate-950/10">
              <span className="text-emerald-300">Instant access</span>
              <p className="mt-1 text-slate-400">
                Find clubs, players and fixtures instantly.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-900/70 px-4 py-3 shadow-slate-950/10">
              <span className="text-emerald-300">Responsive design</span>
              <p className="mt-1 text-slate-400">
                Looks great on phones, tablets, and desktop.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Link to="/login-player">
              <button className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-emerald-500/30 transition hover:bg-emerald-400">
                Player Login
              </button>
            </Link>
            <Link to="/clublogin">
              <button className="rounded-full border border-slate-500/70 bg-slate-900/75 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-400/80 hover:text-emerald-300">
                Club Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-sky-500/30 transition hover:bg-sky-400">
                Join as Representative
              </button>
            </Link>
            <Link
              to="/registry"
              className="rounded-full border border-slate-500/70 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-400/80 hover:text-emerald-300"
            >
              Explore clubs
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Registered Clubs" value={clubsCount || "24+"} />
            <StatCard label="Players Active" value="180+" />
            <StatCard label="Upcoming Fixtures" value="14" />
          </div>
        </div>

        <div className="w-full max-w-lg">
          <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  Snapshot
                </p>
                <p className="text-2xl font-semibold text-slate-50">
                  Club Overview
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-[11px] font-semibold text-emerald-200">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Live now
              </span>
            </div>

            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <OverviewRow label="Total Clubs" value={clubsCount || "24"} />
              <OverviewRow label="Verified Managers" value="18" />
              <OverviewRow label="Trials Open" value="4" />
            </div>

            <div className="mt-6 rounded-[1.75rem] bg-gradient-to-br from-emerald-500/15 via-slate-900/80 to-slate-950/70 p-5 text-slate-100">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-200">
                    Next Match
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-100">
                    Eagle FC <span className="text-emerald-300">vs</span> Tiger
                    United
                  </p>
                </div>
                <span className="rounded-full bg-slate-900/75 px-3 py-2 text-[11px] font-semibold text-slate-200">
                  Home • 19:30
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-950/60 px-4 py-3 text-[11px] text-slate-200">
                  Ready players
                  <p className="mt-2 text-xl font-semibold text-emerald-300">
                    21
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-950/60 px-4 py-3 text-[11px] text-slate-200">
                  Injuries
                  <p className="mt-2 text-xl font-semibold text-emerald-300">
                    2
                  </p>
                </div>
              </div>

              <div className="mt-5 h-2 rounded-full bg-slate-800/80">
                <div className="h-full w-3/4 rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ label, value }) => (
  <div className="rounded-[1.75rem] border border-slate-800/90 bg-slate-900/80 px-5 py-4 shadow-xl shadow-slate-950/30 backdrop-blur-sm">
    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
      {label}
    </p>
    <p className="mt-3 text-2xl font-semibold text-slate-50">{value ?? "—"}</p>
  </div>
);

const OverviewRow = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 last:border-none last:pb-0">
    <span className="text-slate-300">{label}</span>
    <span className="font-semibold text-emerald-300">{value}</span>
  </div>
);

export default HeroSection;
