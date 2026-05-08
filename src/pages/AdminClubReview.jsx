// src/pages/AdminClubReview.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";

/* ─── small helpers ──────────────────────────────────────────────── */
const Badge = ({ status }) => {
  const map = {
    PENDING:         "bg-amber-500/20 text-amber-300 border-amber-500/40",
    APPROVED:        "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    REJECTED:        "bg-red-500/20 text-red-300 border-red-500/40",
    PENDING_DELETION:"bg-rose-500/20 text-rose-300 border-rose-500/40",
    INVITED:         "bg-sky-500/20 text-sky-300 border-sky-500/40",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest ${map[status] || "bg-slate-700 text-slate-300 border-slate-600"}`}>
      {status?.replace("_", " ")}
    </span>
  );
};

const Field = ({ label, value }) => (
  <div>
    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-0.5">{label}</p>
    <p className="text-sm text-slate-100 font-medium break-words">{value || <span className="text-slate-600 italic">—</span>}</p>
  </div>
);

/* ─── main component ─────────────────────────────────────────────── */
const AdminClubReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [toast, setToast] = useState(null); // { type: "success"|"error", msg }

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get(`/api/clubs/${id}`);
        setClub(res.data);
      } catch (err) {
        console.error("Failed to load club:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleApprove = async () => {
    if (!window.confirm(`Approve "${club.clubName}"? This will notify the club representative.`)) return;
    try {
      setActing(true);
      await API.put(`/api/clubs/${id}/approve`);
      setClub((c) => ({ ...c, status: "APPROVED" }));
      showToast("success", `✅ ${club.clubName} has been approved.`);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Approval failed.");
    } finally {
      setActing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    try {
      setActing(true);
      await API.put(`/api/clubs/${id}/reject`, { rejectionReason: rejectReason });
      setClub((c) => ({ ...c, status: "REJECTED", rejectionReason: rejectReason }));
      setShowRejectModal(false);
      showToast("success", `Club rejected. Reason sent to the applicant.`);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Rejection failed.");
    } finally {
      setActing(false);
    }
  };

  /* ── loading / not-found ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
          <p className="text-emerald-400 text-sm">Loading club details…</p>
        </div>
      </div>
    );
  }
  if (!club) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400">
        Club not found.
      </div>
    );
  }

  const isPending = club.status === "PENDING";

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-50"
      style={{
        backgroundImage: `linear-gradient(rgba(5,10,25,0.92), rgba(5,10,25,0.97)), url(${PitchBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Glow accents */}
      <div className="pointer-events-none fixed -left-40 top-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-sm font-semibold shadow-2xl transition-all
          ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.msg}
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-7 shadow-2xl">
            <h3 className="text-base font-bold text-red-400 mb-1">Reject Club Application</h3>
            <p className="text-xs text-slate-400 mb-4">
              Provide a clear reason. This will be sent to the club representative via email.
            </p>
            <textarea
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-red-500 focus:outline-none resize-none"
              rows={4}
              placeholder="e.g. Incomplete documentation, invalid license…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="mt-4 flex gap-3 justify-end">
              <button
                onClick={() => { setShowRejectModal(false); setRejectReason(""); }}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || acting}
                className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-500 disabled:opacity-50 transition"
              >
                {acting ? "Rejecting…" : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-10">
        {/* Header */}
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-3 text-xs text-slate-500 hover:text-emerald-400 transition flex items-center gap-1"
            >
              ← Back
            </button>
            <div className="flex items-center gap-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
                Admin · Club Review
              </p>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">{club.clubName}</h1>
          </div>
          <Badge status={club.status} />
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* ── LEFT column ── */}
          <div className="space-y-6">

            {/* Club identity */}
            <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
              <h2 className="mb-5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Club Identity
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                <Field label="Club Name"        value={club.clubName} />
                <Field label="District"         value={club.district} />
                <Field label="Province"         value={club.province} />
                <Field label="Founding Year"    value={club.foundingYear} />
                <Field label="Home Ground"      value={club.homeGroundName} />
                <Field label="Ground Location"  value={club.homeGroundLocation} />
              </div>
            </section>

            {/* Contact info */}
            <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
              <h2 className="mb-5 text-[10px] font-bold uppercase tracking-widest text-sky-400">
                Contact Information
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <Field label="Contact Person"  value={club.contactPersonName} />
                <Field label="Phone"           value={club.contactPhone} />
                <Field label="Email"           value={club.contactEmail} />
                <Field label="License No."     value={club.licenseNumber} />
              </div>
            </section>

            {/* Submission meta */}
            <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
              <h2 className="mb-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Application Meta
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                <Field label="Status"        value={club.status} />
                <Field label="Submitted At"  value={club.submittedAt ? new Date(club.submittedAt).toLocaleString() : null} />
                <Field label="Reviewed At"   value={club.reviewedAt ? new Date(club.reviewedAt).toLocaleString() : null} />
                <Field label="Submitted By"  value={club.createdBy} />
                <Field label="Reviewed By"   value={club.updatedBy} />
              </div>
              {club.rejectionReason && (
                <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-widest text-red-400 mb-1">Rejection Reason</p>
                  <p className="text-sm text-red-200">{club.rejectionReason}</p>
                </div>
              )}
            </section>
          </div>

          {/* ── RIGHT column ── */}
          <div className="space-y-6">
            {/* Club Logo */}
            <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur">
              <h2 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Club Logo</h2>
              {club.logoUrl ? (
                <img
                  src={club.logoUrl}
                  alt="Club logo"
                  className="w-full max-h-48 rounded-2xl object-contain bg-slate-950 border border-slate-800"
                />
              ) : (
                <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/40">
                  <p className="text-xs text-slate-600 italic">No logo uploaded</p>
                </div>
              )}
            </section>

            {/* License Image */}
            <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur">
              <h2 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Club License</h2>
              {club.licenseImageUrl ? (
                <div>
                  <img
                    src={club.licenseImageUrl}
                    alt="Club license"
                    className="w-full max-h-64 rounded-2xl object-contain bg-slate-950 border border-slate-800"
                  />
                  <a
                    href={club.licenseImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block text-center text-[11px] text-sky-400 hover:underline"
                  >
                    Open full size ↗
                  </a>
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/40">
                  <p className="text-xs text-slate-600 italic">No license image uploaded</p>
                </div>
              )}
            </section>

            {/* Certificate */}
            {club.certificateUrl && (
              <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur">
                <h2 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Certificate</h2>
                <img
                  src={club.certificateUrl}
                  alt="Certificate"
                  className="w-full max-h-48 rounded-2xl object-contain bg-slate-950 border border-slate-800"
                />
              </section>
            )}

            {/* Action Panel */}
            {isPending && (
              <section className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-xl backdrop-blur">
                <h2 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  Review Decision
                </h2>
                <p className="text-xs text-slate-400 mb-5">
                  Carefully review all submitted documents before making a decision.
                  The applicant will be notified via email.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleApprove}
                    disabled={acting}
                    className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 disabled:opacity-60 transition"
                  >
                    {acting ? "Processing…" : "✓ Approve Club"}
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={acting}
                    className="w-full rounded-xl border border-red-500/50 bg-red-500/10 py-3 text-sm font-bold text-red-400 hover:bg-red-500/20 disabled:opacity-60 transition"
                  >
                    ✕ Reject Application
                  </button>
                </div>
              </section>
            )}

            {/* Already decided — show status banner */}
            {!isPending && (
              <section className={`rounded-3xl border p-5 shadow-xl backdrop-blur
                ${club.status === "APPROVED"
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-red-500/30 bg-red-500/5"}`}>
                <p className={`text-center font-bold text-sm ${club.status === "APPROVED" ? "text-emerald-400" : "text-red-400"}`}>
                  {club.status === "APPROVED"
                    ? "✓ This club has been approved"
                    : "✕ This club was rejected"}
                </p>
                {club.reviewedAt && (
                  <p className="text-center text-[10px] text-slate-500 mt-1">
                    {new Date(club.reviewedAt).toLocaleString()}
                  </p>
                )}
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminClubReview;
