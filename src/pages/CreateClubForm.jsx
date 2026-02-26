// src/pages/CreateClubForm.jsx
import React, { useState } from "react";
import PitchBg from "../assets/hero.jpg";
import API from "../auth/api"; // ✅ use same axios instance as ClubList

const CreateClubForm = () => {
  const [clubName, setClubName] = useState("");
  const [licenseManagerName, setLicenseManagerName] = useState("");
  const [email, setEmail] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  const [generatedPassword, setGeneratedPassword] = useState(null);
  const [error, setError] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file || null);

    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    } else {
      setLogoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setGeneratedPassword(null);

    if (!clubName || !licenseManagerName || !email) {
      setError("Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("clubName", clubName);
    formData.append("licenseManagerName", licenseManagerName);
    formData.append("email", email);
    if (logoFile) formData.append("logo", logoFile); // 🔑 key MUST match backend param name

    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // admin JWT

      const res = await API.post("/api/clubs/create", formData, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // Let axios/browser set Content-Type with boundary automatically
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data;
      console.log("✅ Club created:", data);

      // Expecting generatedPassword in DTO
      if (data.generatedPassword) {
        setGeneratedPassword(data.generatedPassword);
      } else {
        setGeneratedPassword(null);
      }

      // reset form
      setClubName("");
      setLicenseManagerName("");
      setEmail("");
      setLogoFile(null);
      setLogoPreview(null);
    } catch (err) {
      console.error("❌ Error creating club:", err);
      // Try to get meaningful message from backend
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to create club";
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
      {/* subtle glow blobs */}
      <div className="pointer-events-none absolute -left-40 top-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8">
        {/* Page header */}
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
              Admin
            </p>
            <h1 className="text-2xl font-semibold md:text-3xl">
              Create New Club
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Register a new club, assign a licence manager, and generate a
              login password.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-slate-300">
              Role: <span className="text-emerald-300">Admin</span>
            </span>
            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-slate-300">
              Clubs can log in via{" "}
              <span className="text-emerald-300">Club Login</span>
            </span>
          </div>
        </header>

        {/* Content card */}
        <section className="flex flex-1 items-start">
          <div className="grid w-full gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            {/* Left: form */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
              {error && (
                <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  {error}
                </div>
              )}

              {generatedPassword && (
                <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
                  <p className="font-semibold">Club created successfully.</p>
                  <p className="mt-1">
                    Generated password:{" "}
                    <span className="font-mono font-bold text-emerald-300">
                      {generatedPassword}
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-200/80">
                    Please share this password securely with the club licence
                    manager.
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="space-y-4"
              >
                {/* Club Name */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-200">
                    Club Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    placeholder="e.g. Eagle FC"
                    required
                  />
                </div>

                {/* Licence Manager Name */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-200">
                    Licence Manager Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={licenseManagerName}
                    onChange={(e) => setLicenseManagerName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    placeholder="e.g. John Perera"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-200">
                    Club Email (used as username){" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                    placeholder="e.g. club@example.com"
                    required
                  />
                </div>

                {/* Logo upload */}
                <div className="mt-2">
                  <label className="mb-1 block text-xs font-medium text-slate-200">
                    Club Logo (optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex cursor-pointer items-center rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-xs font-medium text-slate-100 hover:border-emerald-400 hover:text-emerald-300">
                      Upload Logo
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleLogoChange}
                      />
                    </label>

                    {logoPreview ? (
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                        <img
                          src={logoPreview}
                          alt="Club logo preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/60 text-[11px] text-slate-500">
                        No logo
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    PNG or JPG recommended. Square images look best.
                  </p>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Creating club..." : "Create Club"}
                  </button>
                </div>
              </form>
            </div>

            {/* Right panel: helper info */}
            <aside className="hidden flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 text-xs text-slate-200 shadow-xl backdrop-blur md:flex">
              <h2 className="text-sm font-semibold text-slate-50">
                How this works
              </h2>
              <p className="text-slate-300">
                When you create a club, the system automatically generates a
                password linked to the club email. The licence manager can use
                that email and password to log in via the club portal.
              </p>

              <div className="rounded-2xl bg-slate-950/60 p-3 border border-slate-800">
                <p className="text-[11px] font-semibold text-slate-100">
                  Admin tips
                </p>
                <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                  <li>• Double-check the email before creating the club.</li>
                  <li>• Share the generated password via a secure channel.</li>
                  <li>• You can later update club details from the admin panel.</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-slate-950/60 p-3 border border-emerald-500/30">
                <p className="text-[11px] font-semibold text-emerald-200">
                  Example workflow
                </p>
                <ol className="mt-2 list-decimal space-y-1 pl-4 text-[11px] text-slate-300">
                  <li>Create the club and note the password.</li>
                  <li>Send credentials to the licence manager.</li>
                  <li>They log in via the Club Login page.</li>
                  <li>They complete club profile & add players.</li>
                </ol>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CreateClubForm;
