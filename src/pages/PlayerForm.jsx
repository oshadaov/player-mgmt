// src/pages/PlayerForm.jsx
import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import PitchBg from "../assets/hero.jpg"; // reuse your hero background
import api from "../auth/api.js" 
const PlayerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "PLAYER",
    birthDate: "",
    height: "",
    weight: "",
    college: "",
    position: "",
  });

  const [playerImage, setPlayerImage] = useState(null);
  const [visaImage, setVisaImage] = useState(null);
  const [passportImage, setPassportImage] = useState(null);
  const [createdPlayer, setCreatedPlayer] = useState(null);
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // 🔗 These names must match CreatePlayerRequestDTO fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    if (playerImage) data.append("playerImage", playerImage);
    if (visaImage) data.append("visaImage", visaImage);
    if (passportImage) data.append("passportImage", passportImage);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await api.get("/players", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // ❌ don't set Content-Type; browser sets multipart boundary automatically
        },
        body: data,
      });

      if (!res.ok) {
        const errorText = await res.err;
        console.error("Backend error /players:", res.status, errorText);
        throw new Error(`Failed to submit player (${res.status})`);
      }

      const result = await res.json();
      setCreatedPlayer(result);

      // reset basic form
      setFormData({
        name: "",
        email: "",
        role: "PLAYER",
        birthDate: "",
        height: "",
        weight: "",
        college: "",
        position: "",
      });
      setPlayerImage(null);
      setVisaImage(null);
      setPassportImage(null);

      setSnackbar({
        open: true,
        message: "✅ Player created successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("❌ Error submitting player:", err);
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
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

      <main className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8">
        {/* header */}
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
              Squad Management
            </p>
            <h1 className="text-2xl font-semibold md:text-3xl">
              Add New Player
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Register a new player with core details and required documents.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-slate-300">
              Panel: <span className="text-emerald-300">Club / Admin</span>
            </span>
            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-slate-300">
              Role assigned: <span className="text-emerald-300">PLAYER</span>
            </span>
          </div>
        </header>

        {/* content */}
        <section className="flex flex-1 items-start">
          <div className="grid w-full gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            {/* left: form + result */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    name="name"
                    label="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <Input
                    name="role"
                    label="Role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled
                  />
                  <Input
                    name="birthDate"
                    label="Birth Date"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="height"
                    label="Height (cm)"
                    type="number"
                    value={formData.height}
                    onChange={handleChange}
                  />
                  <Input
                    name="weight"
                    label="Weight (kg)"
                    type="number"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                  <Input
                    name="college"
                    label="College"
                    value={formData.college}
                    onChange={handleChange}
                  />
                  <Input
                    name="position"
                    label="Position"
                    value={formData.position}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FileInput
                    label="Player Image"
                    onChange={(e) => setPlayerImage(e.target.files[0])}
                  />
                  <FileInput
                    label="Visa Image"
                    onChange={(e) => setVisaImage(e.target.files[0])}
                  />
                  <FileInput
                    label="Passport Image"
                    onChange={(e) => setPassportImage(e.target.files[0])}
                  />
                </div>

                <div className="text-center pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-semibold shadow-md shadow-emerald-500/40 text-slate-950 text-sm transition disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving player..." : "Save Player"}
                  </button>
                </div>
              </form>

              {createdPlayer && (
                <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                  <h2 className="text-lg font-semibold mb-3">
                    Player Created
                  </h2>
                  <div className="grid gap-3 text-sm text-slate-200 md:grid-cols-2">
                    <p>
                      <span className="text-slate-400">Name:</span>{" "}
                      {createdPlayer.name}
                    </p>
                    <p>
                      <span className="text-slate-400">Email:</span>{" "}
                      {createdPlayer.email}
                    </p>
                    <p>
                      <span className="text-slate-400">Role:</span>{" "}
                      {createdPlayer.role}
                    </p>
                    <p>
                      <span className="text-slate-400">Birth Date:</span>{" "}
                      {createdPlayer.birthDate}
                    </p>
                    {createdPlayer.position && (
                      <p>
                        <span className="text-slate-400">Position:</span>{" "}
                        {createdPlayer.position}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4">
                    {createdPlayer.id && (
                      <>
                        <ImagePreview
                          src={`http://localhost:8022/players/${createdPlayer.id}/playerImage`}
                          label="Player"
                        />
                        <ImagePreview
                          src={`http://localhost:8022/players/${createdPlayer.id}/visaImage`}
                          label="Visa"
                        />
                        <ImagePreview
                          src={`http://localhost:8022/players/${createdPlayer.id}/passportImage`}
                          label="Passport"
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* right: helper panel */}
            <aside className="hidden flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 text-xs text-slate-200 shadow-xl backdrop-blur md:flex">
              <h2 className="text-sm font-semibold text-slate-50">
                Player profile guidelines
              </h2>
              <p className="text-slate-300">
                Ensure that all information is accurate and images are clear.
                This data will be used by coaches and admins to evaluate
                and manage the squad.
              </p>

              <div className="rounded-2xl bg-slate-950/60 p-3 border border-slate-800">
                <p className="text-[11px] font-semibold text-slate-100">
                  Documents
                </p>
                <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                  <li>• Player photo: front-facing, clear background.</li>
                  <li>• Visa scan: valid and readable.</li>
                  <li>• Passport scan: full information page.</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-slate-950/60 p-3 border border-emerald-500/30">
                <p className="text-[11px] font-semibold text-emerald-200">
                  Data tips
                </p>
                <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                  <li>• Use the college field to track university affiliation.</li>
                  <li>• Height and weight help later if you want to calculate BMI.</li>
                  <li>• You can update these details later from the player list.</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

// Reusable text input
const Input = ({
  name,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false,
}) => (
  <div className="flex flex-col">
    <label className="text-xs mb-1 text-slate-200">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className="px-3 py-2.5 rounded-lg bg-slate-950/60 border border-slate-700 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 disabled:opacity-60"
    />
  </div>
);

// File input
const FileInput = ({ label, onChange }) => (
  <div className="flex flex-col">
    <label className="text-xs mb-1 text-slate-200">{label}</label>
    <input
      type="file"
      accept="image/*"
      onChange={onChange}
      className="px-3 py-2.5 rounded-lg bg-slate-950/60 border border-slate-700 text-xs text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-500 file:text-slate-950 hover:file:bg-emerald-400"
    />
  </div>
);

// Small image preview
const ImagePreview = ({ src, label }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="h-32 w-32 overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
      <img src={src} alt={label} className="h-full w-full object-cover" />
    </div>
    <span className="text-[11px] text-slate-300">{label}</span>
  </div>
);

export default PlayerForm;
