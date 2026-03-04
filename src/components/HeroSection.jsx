import React from "react";
import { Link } from "react-router-dom";
import FootballStadium from "../assets/hero.jpg";

const HeroSection = ({ clubsCount = 0 }) => {
  return (
    <section
      className="relative flex min-h-screen items-center px-4 pb-16 pt-20 md:pt-24 md:pb-20"
      style={{
        backgroundImage: `linear-gradient(rgba(5, 10, 30, 0.35), rgba(5, 10, 30, 0.7)), url(${FootballStadium})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Top nav / brand */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10">
        <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/90 text-sm font-bold text-slate-950">
              SP
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-50">
              Sports Portal
            </span>
          </div>
          <nav className="hidden gap-5 text-xs font-medium text-slate-200 md:flex">
            <a href="#features" className="hover:text-emerald-300">
              Features
            </a>
            <a href="#clubs" className="hover:text-emerald-300">
              Clubs
            </a>
            <a href="#activity" className="hover:text-emerald-300">
              Activity
            </a>
          </nav>
        </div>
      </header>

      {/* Main hero content */}
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 md:flex-row md:items-center md:justify-between">
        {/* Left: text */}
        <div className="max-w-xl space-y-6 text-center md:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            ⚽ Testing this 1234
            <span className="h-1 w-1 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-emerald-200">
              Designed for clubs & players
            </span>
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-50 drop-shadow-[0_0_18px_rgba(0,0,0,0.6)] sm:text-4xl lg:text-5xl">
            Manage your{" "}
            <span className="text-emerald-400">squad, fixtures</span> &{" "}
            performance in one place.
          </h1>

          <p className="text-sm text-slate-200 sm:text-base">
            Connect with your favourite clubs, manage players and fixtures, and
            stay updated with the latest squad activity – all in one sleek web
            portal.
          </p>

          {/* key benefits */}
          <ul className="mt-2 grid gap-2 text-left text-xs text-slate-200 sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✔</span>
              Real-time squad & club overview
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✔</span>
              Player profiles and availability
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✔</span>
              Fixtures and upcoming matches
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✔</span>
              Clean dashboard experience
            </li>
          </ul>

          {/* CTA buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Link to="/login-player">
              <button className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400">
                Player Login
              </button>
            </Link>

            <Link to="/clublogin">
              <button className="rounded-full border border-slate-500/80 bg-slate-900/70 px-6 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-emerald-400/70 hover:text-emerald-300">
                Club Login
              </button>
            </Link>

            <button className="text-xs font-medium text-slate-300 underline-offset-4 hover:text-emerald-200 hover:underline">
              Learn more about the portal
            </button>
          </div>

          {/* quick stats + trust strip */}
          <div className="mt-5 space-y-3">
            <div className="grid grid-cols-3 gap-3 text-xs sm:text-sm">
              <StatCard label="Registered Clubs" value={clubsCount} />
              <StatCard label="Active Players" value="—" />
              <StatCard label="Upcoming Matches" value="—" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-300 md:justify-start">
              <div className="flex -space-x-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/90 text-[10px] font-semibold text-slate-950">
                  CL
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/90 text-[10px] font-semibold text-slate-950">
                  FC
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/90 text-[10px] font-semibold text-slate-950">
                  TR
                </div>
              </div>
              <span className="text-slate-300">
                Trusted by local clubs and university teams.
              </span>
            </div>
          </div>
        </div>

        {/* Right: glassmorphism card */}
        <div className="w-full max-w-md">
          <div className="relative rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Snapshot
                </p>
                <p className="text-lg font-semibold text-slate-50">
                  Club Overview
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-medium text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Live
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-200">
              <OverviewRow label="Total Clubs" value={clubsCount} />
              <OverviewRow label="Verified Managers" value="—" />
              <OverviewRow label="Trials Open" value="—" />
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-sky-500/10 to-slate-900 p-3 text-xs text-slate-100">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-wide text-emerald-200">
                  Next Match
                </p>
                <span className="rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] text-slate-200">
                  Home • 19:30
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold">
                Eagle FC <span className="text-emerald-300">vs</span> Tiger
                United
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-200">
                <span>Ready players: 21</span>
                <span>Injuries: 2</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800/80">
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
  <div className="rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-left backdrop-blur">
    <p className="text-[11px] uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="text-base font-semibold text-slate-50">
      {value ?? "—"}
    </p>
  </div>
);

const OverviewRow = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-300">{label}</span>
    <span className="font-semibold text-emerald-300">{value}</span>
  </div>
);

export default HeroSection;
