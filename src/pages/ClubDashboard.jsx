// src/pages/ClubDashboard.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";

import ClubOverviewCard from "../components/ClubOverviewCard";
import ClubSquadManager from "../components/club/ClubSquadManager";
import ClubCoachList from "../components/club/ClubCoachList";

/** ── Status screens shown before the club is approved ─────────────── */
const PendingScreen = ({ club }) => (
  <div className="flex flex-col items-center gap-6 max-w-lg mx-auto text-center">
    <div className="h-20 w-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-4xl animate-pulse">
      ⏳
    </div>
    <div>
      <h2 className="text-xl font-bold text-amber-300">Application Under Review</h2>
      <p className="text-sm text-slate-400 mt-2">
        Your club registration for <span className="text-slate-200 font-semibold">{club.clubName}</span> has been submitted and is currently being reviewed by our administrators.
      </p>
      <p className="text-xs text-slate-500 mt-3">
        You will receive an email at <span className="text-emerald-400">{club.contactEmail}</span> once a decision is made.
      </p>
    </div>
    <div className="w-full rounded-2xl border border-slate-700 bg-slate-900/60 p-5 text-left space-y-3">
      <InfoRow label="Submitted" value={club.submittedAt ? new Date(club.submittedAt).toLocaleString() : "—"} />
      <InfoRow label="District"  value={club.district} />
      <InfoRow label="Province"  value={club.province} />
      <InfoRow label="Contact"   value={club.contactPersonName} />
    </div>
  </div>
);

const RejectedScreen = ({ club, onResubmit }) => (
  <div className="flex flex-col items-center gap-6 max-w-lg mx-auto text-center">
    <div className="h-20 w-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-4xl">
      ✕
    </div>
    <div>
      <h2 className="text-xl font-bold text-red-400">Application Rejected</h2>
      <p className="text-sm text-slate-400 mt-2">
        Your application for <span className="text-slate-200 font-semibold">{club.clubName}</span> was not approved.
      </p>
    </div>
    {club.rejectionReason && (
      <div className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-left">
        <p className="text-[10px] uppercase tracking-widest text-red-400 mb-1">Reason from Admin</p>
        <p className="text-sm text-red-200">{club.rejectionReason}</p>
      </div>
    )}
    <div className="w-full rounded-2xl border border-slate-700 bg-slate-900/60 p-5 text-left space-y-3">
      <InfoRow label="Reviewed"  value={club.reviewedAt ? new Date(club.reviewedAt).toLocaleString() : "—"} />
      <InfoRow label="District"  value={club.district} />
      <InfoRow label="Province"  value={club.province} />
    </div>
    <p className="text-xs text-slate-500">
      You can address the concerns above and resubmit your application. Your previous data will be pre-filled.
    </p>
    <button
      onClick={onResubmit}
      className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition"
    >
      ↺ Resubmit Application
    </button>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-xs">
    <span className="text-slate-500 uppercase tracking-wider">{label}</span>
    <span className="text-slate-200 font-medium">{value || "—"}</span>
  </div>
);

/** ── Main dashboard ─────────────────────────────────────────────── */
const ClubDashboard = () => {
  const { id: routeId } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [appStatus, setAppStatus] = useState(null); // "PENDING"|"REJECTED"|"APPROVED"|null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");

  // entityId is only set after approval
  const entityId = routeId || localStorage.getItem("entityId");

  useEffect(() => {
    const fetchClub = async () => {
      try {
        setLoading(true);

        if (entityId) {
          // Already approved — load full profile
          const res = await API.get(`/api/clubs/${entityId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setClub(res.data || null);
          setAppStatus(res.data?.status || "APPROVED");
        } else {
          // Not approved yet — try to find their application
          const res = await API.get("/api/clubs/my-application", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setClub(res.data || null);
          setAppStatus(res.data?.status || null);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setClub(null);
          setAppStatus(null);
        } else {
          console.error("❌ Error fetching club:", err);
          setError("Failed to load club details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [entityId, token]);

  const handleResubmit = () => {
    // Navigate to CreateClubForm; the form will pick up the rejected record by email
    navigate("/create-club");
  };

  /* ── loading ── */
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300"
        style={{
          backgroundImage: `linear-gradient(rgba(5,10,25,0.9), rgba(5,10,25,0.96)), url(${PitchBg})`,
          backgroundSize: "cover",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
          <p className="text-sm">Loading club dashboard…</p>
        </div>
      </div>
    );
  }

  /* ── error ── */
  if (error) {
    return (
      <FullScreenWrapper>
        <div className="text-center text-red-400">
          <p className="text-lg font-bold mb-2">Something went wrong</p>
          <p className="text-sm">{error}</p>
        </div>
      </FullScreenWrapper>
    );
  }

  /* ── no application at all ── */
  if (!club || appStatus === null) {
    return (
      <FullScreenWrapper>
        <div className="max-w-md w-full bg-slate-900/90 p-8 rounded-3xl border border-slate-800 text-center backdrop-blur-xl">
          <h2 className="text-2xl font-bold mb-4">No Club Profile Found</h2>
          <p className="text-sm text-slate-400 mb-8 font-medium">
            It looks like you haven't registered your football club yet. Start the registration process to access full management features.
          </p>
          <button
            onClick={() => navigate("/create-club")}
            className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-2xl hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 uppercase tracking-widest"
          >
            Register Your Club
          </button>
        </div>
      </FullScreenWrapper>
    );
  }

  /* ── pending ── */
  if (appStatus === "PENDING") {
    return (
      <FullScreenWrapper>
        <PendingScreen club={club} />
      </FullScreenWrapper>
    );
  }

  /* ── rejected ── */
  if (appStatus === "REJECTED") {
    return (
      <FullScreenWrapper>
        <RejectedScreen club={club} onResubmit={handleResubmit} />
      </FullScreenWrapper>
    );
  }

  /* ── APPROVED — full dashboard ── */
  const players    = club?.players || [];
  const playerCount = players.length;

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
      <div className="pointer-events-none absolute -left-40 top-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Club Dashboard</p>
            <h1 className="text-2xl font-semibold md:text-3xl">{club.clubName}</h1>
            <p className="mt-1 text-xs text-slate-400">Manage your club details and squad from one place.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-slate-300">
              Role: <span className="text-emerald-300">{role}</span>
            </span>
            <button type="button" onClick={() => navigate("/club/player-updates")}
              className="rounded-full bg-amber-500/10 border border-amber-500/40 px-4 py-1 text-amber-400 font-bold hover:bg-amber-500/20 transition">
              Review Player Updates
            </button>
            <button type="button" onClick={() => navigate("/club/edit-profile")}
              className="rounded-full bg-emerald-500 px-4 py-1 text-slate-950 font-bold hover:bg-emerald-400 transition">
              Edit Profile
            </button>
            <button type="button" onClick={() => navigate("/admin/register-coach")}
              className="rounded-full bg-sky-500 px-4 py-1 text-slate-950 font-bold hover:bg-sky-400 transition">
              + Register Technical Staff
            </button>
            <button type="button" onClick={() => navigate("/")}
              className="rounded-full bg-slate-900/80 px-3 py-1 text-slate-300 hover:text-emerald-300">
              ← Back to Home
            </button>
          </div>
        </header>

        <HeadCoachAlert clubId={club.id} />

        <section className="mb-8 grid gap-6 md:grid-cols-[2fr,1.5fr]">
          <ClubOverviewCard club={club} playerCount={playerCount} />
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-md backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Snapshot</p>
            <div className="space-y-2 text-sm">
              <StatRow label="Total Players" value={playerCount} />
              <StatRow label="Email" value={club.username || club.contactEmail || "Not provided"} />
              <StatRow label="Contact Person" value={club.contactPersonName || "Not set"} />
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Technical Staff</h2>
            <p className="text-[11px] text-slate-400 mt-1">Official coaching staff assigned to your club.</p>
          </div>
          <ClubCoachList clubId={club.id} />
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Squad Roster</h2>
            <button onClick={() => navigate("/players/register-player")}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl font-bold text-xs transition">
              + Register New Player
            </button>
          </div>
          <ClubSquadManager clubId={club.id} />
        </section>
      </main>
    </div>
  );
};

/* ── shared wrappers / helpers ────────────────────────────────────── */
const FullScreenWrapper = ({ children }) => (
  <div
    className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4"
    style={{
      backgroundImage: `linear-gradient(rgba(5,10,25,0.93), rgba(5,10,25,0.97)), url(${PitchBg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="w-full max-w-lg">{children}</div>
  </div>
);

const StatRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-xs sm:text-sm">
    <span className="text-slate-400">{label}</span>
    <span className="font-semibold text-slate-50 truncate max-w-[65%] text-right">{value}</span>
  </div>
);

const HeadCoachAlert = ({ clubId }) => {
  const [hasHeadCoach, setHasHeadCoach] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await API.get(`/api/coaches/club/${clubId}`);
        const list = res.data || [];
        setHasHeadCoach(list.some((a) => a.role === "HEAD_COACH" && a.active));
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    if (clubId) check();
  }, [clubId]);

  if (loading || hasHeadCoach) return null;

  return (
    <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-4 animate-pulse">
      <span className="text-2xl">⚠️</span>
      <div>
        <h4 className="text-sm font-bold text-amber-200 uppercase tracking-widest">Technical Vacancy Detected</h4>
        <p className="text-[10px] text-amber-100/70">
          Your club currently has no official Head Coach registered. Please register a Head Coach to ensure compliance with association regulations.
        </p>
      </div>
    </div>
  );
};

export default ClubDashboard;
