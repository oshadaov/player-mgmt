// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";
import fallbackLogo from "../assets/placeholder.jpg"; 
import AdminClubRegistry from "../components/admin/AdminClubRegistry";
import AdminClubApprovalList from "../components/admin/AdminClubApprovalList";
import AdminPlayerRegistry from "../components/admin/AdminPlayerRegistry";

const AdminDashboard = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setAdminName(parsed.username || parsed.name || "Admin");
      } catch {
        setAdminName("Admin");
      }
    }

    const fetchClubs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/api/clubs", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        // ✅ ensure always array
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.content || res.data?.clubs || [];

        setClubs(data);
      } catch (err) {
        console.error("❌ Error fetching clubs:", err);
        setError("Failed to load clubs");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const totalClubs = clubs.length;

  // ✅ treat both clubLogo and logoUrl as possible Cloudinary URL fields
  const clubsWithLogo = clubs.filter(
    (c) => c.clubLogo || c.logoUrl
  ).length;

  const clubsWithoutLogo = totalClubs - clubsWithLogo;

  const recentClubs = clubs.slice(0, 5);

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
        <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
              Admin Dashboard
            </p>
            <h1 className="text-2xl font-semibold md:text-3xl">
              Welcome back, {adminName}
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Quick overview of clubs and key actions for managing your portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            {localStorage.getItem("role") === "SUPER_ADMIN" && (
              <Link
                to="/superadmindashboard"
                className="rounded-full bg-emerald-500 px-3 py-1 text-slate-950 font-bold hover:bg-emerald-400 transition"
              >
                Super Admin Console
              </Link>
            )}
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

        {/* Top row: stats */}
        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <StatCard label="Total Clubs" value={totalClubs} />
          <StatCard label="Pending Approval" value={clubs.filter(c => c.status === "PENDING").length} />
          <StatCard label="With Logos" value={clubsWithLogo} />
          <StatCard label="Without Logo" value={clubsWithoutLogo} />
        </section>

        {/* Quick actions */}
        <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur">
          <h2 className="text-sm font-semibold text-slate-50 mb-2">
            Quick Actions
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Common admin tasks you’ll use frequently.
          </p>

          <div className="grid gap-6 lg:grid-cols-[1fr,250px]">
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <Link
              to="/admin/invite-club"
              className="flex items-center justify-between rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 hover:border-emerald-300 hover:bg-emerald-500/20 transition"
            >
              <div>
                <p className="font-semibold text-emerald-200">
                  Invite Club
                </p>
                <p className="text-[11px] text-emerald-100/80">
                  Issue an official registration invitation to a new club.
                </p>
              </div>
              <span className="text-xl">+</span>
            </Link>

            <Link
              to="/create" // your player form route
              className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 hover:border-emerald-300 transition"
            >
              <div>
                <p className="font-semibold text-slate-100">
                  Add Player
                </p>
                <p className="text-[11px] text-slate-400">
                  Register a new player and upload key documents.
                </p>
              </div>
              <span className="text-xl text-emerald-300">⚽</span>
            </Link>

            <Link
              to="/admin/player-updates"
              className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 hover:border-emerald-300 transition"
            >
              <div>
                <p className="font-semibold text-slate-100">
                  Player Updates
                </p>
                <p className="text-[11px] text-slate-400">
                  Review and approve player detail changes from clubs.
                </p>
              </div>
              <span className="text-xl text-emerald-300">📝</span>
            </Link>

            <Link
              to="/clubs"
              className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 hover:border-emerald-300 transition"
            >
              <div>
                <p className="font-semibold text-slate-100">
                  View All Clubs
                </p>
                <p className="text-[11px] text-slate-400">
                  Open the full clubs overview with search and filters.
                </p>
              </div>
              <span className="text-xl text-emerald-300">📊</span>
            </Link>

            <Link
              to="/admin/club-updates"
              className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 hover:border-emerald-300 transition"
            >
              <div>
                <p className="font-semibold text-slate-100">
                  Club Profile Updates
                </p>
                <p className="text-[11px] text-slate-400">
                  Review and approve club data changes.
                </p>
              </div>
              <span className="text-xl text-emerald-300">🏛️</span>
            </Link>
          </div>

          {/* Pending Approvals Sidebar */}
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase text-slate-500 mb-4 tracking-widest">Pending Clubs</h3>
            <AdminClubApprovalList />
          </div>
        </div>
      </section>

        {/* Registries Section */}
        <section className="space-y-6">
          {/* Club Registry */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-50 uppercase tracking-widest">
                  Global Club Registry
                </h2>
                <p className="text-[11px] text-slate-400 mt-1">
                  Authorized view of all federated football clubs.
                </p>
              </div>
            </div>
            <AdminClubRegistry />
          </div>

          {/* Player Registry */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur">
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-slate-50 uppercase tracking-widest">
                Global Player Registry
              </h2>
              <p className="text-[11px] text-slate-400 mt-1">
                Authorized view of all registered players across all clubs.
              </p>
            </div>
            <AdminPlayerRegistry />
          </div>

          {/* Coaching Management */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-semibold text-slate-50 uppercase tracking-widest">
                  Coaching Staff Registry
                </h2>
                <p className="text-[11px] text-slate-400 mt-1">
                  Manage professional coaching staff and club assignments.
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/admin/register-coach" className="bg-emerald-500 text-slate-950 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition">
                  Register Coach
                </Link>
                <Link to="/coaches" className="bg-slate-950 border border-slate-800 text-slate-300 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-emerald-400 transition">
                  View Full List
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-3 text-left shadow-sm backdrop-blur">
    <p className="text-[11px] uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-1 text-base font-semibold text-slate-50">{value}</p>
  </div>
);

export default AdminDashboard;
