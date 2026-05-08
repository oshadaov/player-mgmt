// src/pages/PlayerForm.jsx
import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import PitchBg from "../assets/hero.jpg"; 
import { useAuth } from "../auth/AuthContext";
import api from "../auth/api";

const PlayerForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    nic: "",
    phone: "",
    email: "",
    homeAddress: "",
    district: "",
    position: "",
    dominantFoot: "",
    jerseyNumber: "",
    previousClubs: "",
    clubId: user?.entityId || "" 
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [nicFile, setNicFile] = useState(null);
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

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (photoFile) data.append("photoFile", photoFile);
      if (nicFile) data.append("nicFile", nicFile);

      await api.post("/api/players", data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setFormData({
        fullName: "",
        nic: "",
        phone: "",
        email: "",
        homeAddress: "",
        district: "",
        position: "",
        dominantFoot: "",
        jerseyNumber: "",
        previousClubs: "",
        clubId: user?.entityId || ""
      });
      setPhotoFile(null);
      setNicFile(null);

      setSnackbar({
        open: true,
        message: "✅ Player registered! Pending admin approval.",
        severity: "success",
      });
    } catch (err) {
      console.error("❌ Error submitting player:", err);
      const msg = err.response?.data?.message || err.message || "Failed to submit player";
      setSnackbar({
        open: true,
        message: msg,
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
      <div className="pointer-events-none absolute -left-40 top-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Squad Management</p>
            <h1 className="text-2xl font-semibold md:text-3xl">Add New Player</h1>
            <p className="mt-1 text-xs text-slate-400">Register a new player with core details and documents.</p>
          </div>
        </header>

        <section className="flex flex-1 items-start">
          <div className="grid w-full gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input name="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} required />
                  <Input name="nic" label="NIC" value={formData.nic} onChange={handleChange} required />
                  <Input name="phone" label="Phone" value={formData.phone} onChange={handleChange} required />
                  <Input name="email" label="Email" type="email" value={formData.email} onChange={handleChange} required />
                  <Input name="homeAddress" label="Home Address" value={formData.homeAddress} onChange={handleChange} required />
                  <Input name="district" label="District" value={formData.district} onChange={handleChange} required />
                  <Input name="position" label="Position" value={formData.position} onChange={handleChange} />
                  <Input name="dominantFoot" label="Dominant Foot" value={formData.dominantFoot} onChange={handleChange} />
                  <Input name="jerseyNumber" label="Jersey Number" type="number" value={formData.jerseyNumber} onChange={handleChange} />
                  <Input name="previousClubs" label="Previous Clubs" value={formData.previousClubs} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs mb-1 text-slate-200">Player Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="w-full text-xs text-slate-400" />
                  </div>
                  <div>
                    <label className="text-xs mb-1 text-slate-200">NIC Document</label>
                    <input type="file" accept="image/*" onChange={(e) => setNicFile(e.target.files[0])} className="w-full text-xs text-slate-400" />
                  </div>
                </div>

                <div className="text-center pt-2">
                  <button type="submit" disabled={loading} className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold shadow-md shadow-emerald-500/40 text-slate-950 text-sm transition disabled:opacity-70">
                    {loading ? "Registering..." : "Submit Registration"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <MuiAlert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled">{snackbar.message}</MuiAlert>
      </Snackbar>
    </div>
  );
};

const Input = ({ name, label, value, onChange, type = "text", required = false, disabled = false }) => (
  <div className="flex flex-col">
    <label className="text-xs mb-1 text-slate-200">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} required={required} disabled={disabled} className="px-3 py-2.5 rounded-lg bg-slate-950/60 border border-slate-700 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-400 disabled:opacity-60" />
  </div>
);

export default PlayerForm;
