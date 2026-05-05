// src/pages/CreateClubForm.jsx
import React, { useState } from "react";
import PitchBg from "../assets/hero.jpg";
import API from "../auth/api";

const CreateClubForm = () => {
  const [formData, setFormData] = useState({
    clubName: "",
    district: "",
    province: "",
    contactPersonName: "",
    contactNic: "",
    contactPhone: "",
    contactEmail: "",
    foundingYear: "",
    homeGroundName: "",
    homeGroundLocation: ""
  });

  const [logoFile, setLogoFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (logoFile) {
        data.append("logoFile", logoFile);
      }

      await API.post("/api/clubs", data, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      alert("Club registration submitted! It is now pending admin approval.");
      
      setFormData({
        clubName: "",
        district: "",
        province: "",
        contactPersonName: "",
        contactNic: "",
        contactPhone: "",
        contactEmail: "",
        foundingYear: "",
        homeGroundName: "",
        homeGroundLocation: ""
      });
      setLogoFile(null);
    } catch (err) {
      console.error("❌ Error registering club:", err);
      const msg = err.response?.data?.message || err.message || "Failed to register club";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-50"
      style={{
        backgroundImage: `linear-gradient(rgba(5, 10, 25, 0.9), rgba(5, 10, 25, 0.96)), url(${PitchBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="pointer-events-none absolute -left-40 top-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Admin</p>
            <h1 className="text-2xl font-semibold md:text-3xl">Create New Club</h1>
            <p className="mt-1 text-xs text-slate-400">Register a new club for admin approval.</p>
          </div>
        </header>

        <section className="flex flex-1 items-start">
          <div className="grid w-full gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
              {error && (
                <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-200">Club Name *</label>
                    <input
                      type="text"
                      name="clubName"
                      value={formData.clubName}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 focus:border-emerald-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-200">District *</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 focus:border-emerald-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-200">Province *</label>
                    <input
                      type="text"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 focus:border-emerald-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-200">Founding Year</label>
                    <input
                      type="number"
                      name="foundingYear"
                      value={formData.foundingYear}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-200">Contact Person Name *</label>
                  <input
                    type="text"
                    name="contactPersonName"
                    value={formData.contactPersonName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 focus:border-emerald-400 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-200">Contact NIC *</label>
                    <input
                      type="text"
                      name="contactNic"
                      value={formData.contactNic}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 focus:border-emerald-400 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-200">Contact Phone *</label>
                    <input
                      type="text"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 focus:border-emerald-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-200">Contact Email *</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 focus:border-emerald-400 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-200">Home Ground</label>
                    <input
                      type="text"
                      name="homeGroundName"
                      value={formData.homeGroundName}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-200">Ground Location</label>
                    <input
                      type="text"
                      name="homeGroundLocation"
                      value={formData.homeGroundLocation}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-200">Club Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-800 file:text-slate-100"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:opacity-70"
                  >
                    {loading ? "Submitting..." : "Submit Registration"}
                  </button>
                </div>
              </form>
            </div>

            <aside className="hidden flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 text-xs text-slate-200 shadow-xl backdrop-blur md:flex">
              <h2 className="text-sm font-semibold text-slate-50">Registration Info</h2>
              <p className="text-slate-300">Submit this form to register a new club. Once submitted, an admin will review the application.</p>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CreateClubForm;
