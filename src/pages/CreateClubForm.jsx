// src/pages/CreateClubForm.jsx
import React, { useState, useEffect } from "react";
import PitchBg from "../assets/hero.jpg";
import API from "../auth/api";

/** Decode a JWT payload without a library */
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

const CreateClubForm = () => {
  const [formData, setFormData] = useState({
    clubName: "",
    district: "",
    province: "",
    contactPersonName: "",
    contactPhone: "",
    contactEmail: "",   // auto-filled from JWT
    foundingYear: "",
    homeGroundName: "",
    homeGroundLocation: "",
  });

  const [coaches, setCoaches] = useState([]);
  const [selectedCoaches, setSelectedCoaches] = useState([]);
  const [showQuickCoach, setShowQuickCoach] = useState(false);
  const [quickCoach, setQuickCoach] = useState({
    fullName: "",
    email: "",
    specialization: "Tactics",
    role: "HEAD_COACH",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [licensePreview, setLicensePreview] = useState(null);
  const [rejectedClub, setRejectedClub] = useState(null); // pre-filled from rejected application
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // On mount: read email from JWT, then check if a rejected application exists to pre-fill
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = parseJwt(token);
      const email = payload?.sub || payload?.email || "";

      // Always set email first
      if (email) {
        setFormData((prev) => ({ ...prev, contactEmail: email }));
      }

      // Check for existing rejected application
      try {
        const res = await API.get("/api/clubs/my-application", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const club = res.data;
        if (club && club.status === "REJECTED") {
          setRejectedClub(club);
          // Pre-fill all form fields with the previously submitted data
          setFormData({
            clubName:           club.clubName           || "",
            district:           club.district           || "",
            province:           club.province           || "",
            contactPersonName:  club.contactPersonName  || "",
            contactPhone:       club.contactPhone       || "",
            contactEmail:       club.contactEmail       || email,
            foundingYear:       club.foundingYear       || "",
            homeGroundName:     club.homeGroundName     || "",
            homeGroundLocation: club.homeGroundLocation || "",
          });
          // Show existing logo/license previews if available
          if (club.licenseImageUrl) setLicensePreview(club.licenseImageUrl);
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          console.warn("Could not check existing application:", err.message);
        }
        // 404 = no application yet, which is fine
      }
    };
    init();
  }, []);

  // Fetch existing coaches
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await API.get("/api/coaches");
        setCoaches(res.data || []);
      } catch (err) {
        console.error("Failed to fetch coaches:", err);
      }
    };
    fetchCoaches();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuickCoachChange = (e) => {
    setQuickCoach({ ...quickCoach, [e.target.name]: e.target.value });
  };

  const addSelectedCoach = (coachId, role) => {
    if (!coachId) return;
    if (selectedCoaches.find((c) => String(c.coachId) === String(coachId))) return;
    setSelectedCoaches([...selectedCoaches, { coachId, role }]);
  };

  const createAndAddCoach = async () => {
    try {
      const res = await API.post("/api/coaches", { ...quickCoach, clubId: 0 });
      const newCoach = res.data;
      setCoaches([...coaches, newCoach]);
      addSelectedCoach(newCoach.id, quickCoach.role);
      setShowQuickCoach(false);
      setQuickCoach({ fullName: "", email: "", specialization: "Tactics", role: "HEAD_COACH" });
    } catch {
      alert("Failed to create coach. Email might already exist.");
    }
  };

  const handleLicenseChange = (e) => {
    const file = e.target.files[0];
    setLicenseFile(file);
    if (file) {
      setLicensePreview(URL.createObjectURL(file));
    } else {
      setLicensePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "") data.append(key, value);
      });
      if (logoFile) data.append("logoFile", logoFile);
      if (licenseFile) data.append("licenseFile", licenseFile);

      await API.post("/api/clubs", data, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      alert(
        "✅ Club registration submitted! Your application is now pending admin approval. You will be notified once approved."
      );
      window.location.href = "/";
    } catch (err) {
      console.error("❌ Error registering club:", err);
      const msg =
        err.response?.data?.message || err.message || "Failed to register club";
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
              {/* Rejection banner — shown when resubmitting a rejected application */}
              {rejectedClub && (
                <div className="mb-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-400 text-base">✕</span>
                    <p className="text-xs font-bold text-red-300 uppercase tracking-widest">
                      Previous Application Rejected
                    </p>
                  </div>
                  {rejectedClub.rejectionReason ? (
                    <p className="text-xs text-red-200 mb-2">
                      <span className="font-semibold">Reason: </span>{rejectedClub.rejectionReason}
                    </p>
                  ) : (
                    <p className="text-xs text-red-200 mb-2">No specific reason was provided.</p>
                  )}
                  <p className="text-[10px] text-slate-400">
                    Your previous data has been pre-filled. Please address the rejection reason above, update any incorrect information, and resubmit.
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Club Name + District */}
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

                {/* Province + Founding Year */}
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

                {/* Contact Person */}
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

                {/* Contact Phone + Email (read-only from JWT) */}
                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-200">
                      Contact Email
                      <span className="ml-1 text-[10px] text-emerald-400 font-normal">(from your account)</span>
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      readOnly
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2.5 text-sm text-slate-400 cursor-not-allowed focus:outline-none"
                    />
                  </div>
                </div>

                {/* Home Ground */}
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

                {/* Club Logo */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-200">Club Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogoFile(e.target.files[0])}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-800 file:text-slate-100"
                  />
                </div>

                {/* Club License Image */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-200">
                    Club License Image
                    <span className="ml-1 text-[10px] text-slate-400">(upload a photo/scan of your license)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleLicenseChange}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-900/60 file:text-emerald-200"
                  />
                  {licensePreview && (
                    <div className="mt-2 overflow-hidden rounded-xl border border-slate-700">
                      <img
                        src={licensePreview}
                        alt="License preview"
                        className="max-h-36 w-full object-contain bg-slate-950"
                      />
                    </div>
                  )}
                </div>

                {/* Coaching Staff */}
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Coaching Staff</h3>
                    <button
                      type="button"
                      onClick={() => setShowQuickCoach(!showQuickCoach)}
                      className="text-[10px] font-bold text-sky-400 hover:underline"
                    >
                      {showQuickCoach ? "- Close" : "+ Quick Create Coach"}
                    </button>
                  </div>

                  {showQuickCoach && (
                    <div className="mb-6 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          name="fullName"
                          placeholder="Coach Full Name"
                          value={quickCoach.fullName}
                          onChange={handleQuickCoachChange}
                          className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs outline-none focus:border-sky-500"
                        />
                        <input
                          name="email"
                          placeholder="Coach Email"
                          value={quickCoach.email}
                          onChange={handleQuickCoachChange}
                          className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs outline-none focus:border-sky-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          name="role"
                          value={quickCoach.role}
                          onChange={handleQuickCoachChange}
                          className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs outline-none"
                        >
                          <option value="HEAD_COACH">Head Coach</option>
                          <option value="ASSISTANT_COACH">Assistant Coach</option>
                        </select>
                        <button
                          type="button"
                          onClick={createAndAddCoach}
                          className="bg-sky-600 text-white font-bold py-2 rounded-xl text-xs hover:bg-sky-500 transition"
                        >
                          Create &amp; Assign
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <select
                        id="coach-select"
                        className="flex-1 bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs outline-none focus:border-emerald-500"
                        defaultValue=""
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val) addSelectedCoach(val, "HEAD_COACH");
                          e.target.value = "";
                        }}
                      >
                        <option value="">Search &amp; Select Existing Coach...</option>
                        {coaches.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.fullName} ({c.email})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedCoaches.map((sc) => {
                        const coach = coaches.find((c) => String(c.id) === String(sc.coachId));
                        return (
                          <div
                            key={sc.coachId}
                            className="bg-slate-800 px-3 py-1.5 rounded-full flex items-center gap-2 border border-slate-700"
                          >
                            <span className="text-[10px] font-bold">{coach?.fullName}</span>
                            <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-full uppercase">
                              {sc.role.replace("_", " ")}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedCoaches(selectedCoaches.filter((c) => c.coachId !== sc.coachId))
                              }
                              className="text-slate-500 hover:text-red-400 text-xs"
                            >
                              &times;
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
              <p className="text-slate-300">
                Submit this form to register a new club. Once submitted, an admin will review the application.
              </p>
              <ul className="space-y-2 text-slate-400 list-disc list-inside">
                <li>Upload your official club license image</li>
                <li>Your account email is used as the contact email</li>
                <li>Add coaching staff optionally</li>
                <li>You will be notified via email upon approval</li>
              </ul>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CreateClubForm;
