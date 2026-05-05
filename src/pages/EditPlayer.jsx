// src/pages/EditPlayerPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PitchBg from "../assets/hero.jpg";
import PlaceHolder from "../assets/placeholder.jpg";
import api from "../auth/api.js"
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";



const PLACEHOLDER = PlaceHolder;

// Optional: centralize base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE || "http://localhost:8088";

const EditPlayerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "PLAYER",
    birthYear: "",
    height: "",
    weight: "",
    college: "",
    position: "",
  });

  const [images, setImages] = useState({
    playerImage: null,
    visaImage: null,
    passportImage: null,
  });

  const [previews, setPreviews] = useState({
    playerImage: null,
    visaImage: null,
    passportImage: null,
  });

  const createdUrlsRef = useRef(new Set());
  const [loading, setLoading] = useState(true);
  const [activePopup, setActivePopup] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  const token = localStorage.getItem("token");

  // 🔹 Fetch player on mount
  useEffect(() => {
    let isMounted = true;

    const fetchPlayer = async () => {
      try {
        const res = await api.get(`${API_BASE_URL}/api/players/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!isMounted) return;

        const data = res.data;

        setFormData({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "PLAYER",
          // adapt to your actual field (birthYear / birthDate)
          birthYear: data.birthYear || "",
          height: data.height || "",
          weight: data.weight || "",
          college: data.college || "",
          position: data.position?.pname || data.position || "",
        });

        // 🔹 Use Cloudinary URLs (or whatever URL fields your backend returns)
        setPreviews({
          playerImage:
            data.playerImageUrl ||
            data.playerImage || // in case you named it like this
            null,
          visaImage:
            data.visaImageUrl ||
            data.visaImage ||
            null,
          passportImage:
            data.passportImageUrl ||
            data.passportImage ||
            null,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching player:", err);
        setLoading(false);
      }
    };

    fetchPlayer();

    return () => {
      isMounted = false;
    };
  }, [id, token]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const typeToFieldKey = (type) => {
    if (type === "player") return "playerImage";
    if (type === "visa") return "visaImage";
    return "passportImage";
  };

  const applySelectedFile = (fieldKey, file) => {
    if (!file) return;

    const oldUrl = previews[fieldKey];
    if (oldUrl && createdUrlsRef.current.has(oldUrl)) {
      URL.revokeObjectURL(oldUrl);
      createdUrlsRef.current.delete(oldUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    createdUrlsRef.current.add(objectUrl);

    setImages((p) => ({ ...p, [fieldKey]: file }));
    setPreviews((p) => ({ ...p, [fieldKey]: objectUrl }));
  };

  const handlePopupFileSelect = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fieldKey = typeToFieldKey(type);
    applySelectedFile(fieldKey, file);
    setActivePopup(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const role = localStorage.getItem("role");

    try {
      if (role === "CLUB") {
        await api.put(`${API_BASE_URL}/api/players/${id}/propose-update`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSnackbar({
          open: true,
          message: "✅ Update proposal submitted for Admin approval!",
          severity: "success",
        });
      } else {
        const data = new FormData();
        Object.entries(formData).forEach(([k, v]) => data.append(k, v ?? ""));
        if (images.playerImage) data.append("playerImage", images.playerImage);
        
        await api.put(`${API_BASE_URL}/api/players/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSnackbar({
          open: true,
          message: "✅ Player updated successfully!",
          severity: "success",
        });
      }
      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      console.error("Error updating player:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to update player",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300"
        style={{
          backgroundImage: `linear-gradient(rgba(5,10,25,0.9), rgba(5,10,25,0.96)), url(${PitchBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        Loading player...
      </div>
    );
  }

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
              Edit Player
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Update player details and documents for your club’s squad.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-slate-300">
              Mode: <span className="text-emerald-300">Edit</span>
            </span>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full bg-slate-900/80 px-3 py-1 text-slate-300 hover:text-emerald-300"
            >
              ← Back
            </button>
          </div>
        </header>

        {/* content */}
        <section className="flex flex-1 items-start">
          <div className="grid w-full gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            {/* left: form */}
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
                    name="birthYear"
                    label="Birth Year"
                    type="number"
                    value={formData.birthYear}
                    onChange={handleChange}
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
                  <ImageCard
                    label="Player Image"
                    previewUrl={previews.playerImage}
                    onChangeClick={() => setActivePopup("player")}
                  />
                  <ImageCard
                    label="Visa Image"
                    previewUrl={previews.visaImage}
                    onChangeClick={() => setActivePopup("visa")}
                  />
                  <ImageCard
                    label="Passport Image"
                    previewUrl={previews.passportImage}
                    onChangeClick={() => setActivePopup("passport")}
                  />
                </div>

                <div className="text-center pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-semibold shadow-md shadow-emerald-500/40 text-slate-950 text-sm transition"
                  >
                    Update Player
                  </button>
                </div>
              </form>
            </div>

            {/* right: helper panel */}
            <aside className="hidden flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 text-xs text-slate-200 shadow-xl backdrop-blur md:flex">
              <h2 className="text-sm font-semibold text-slate-50">
                Editing guidelines
              </h2>
              <p className="text-slate-300">
                Keep player information up to date. Changes will be visible to
                admins and coaches across the portal.
              </p>

              <div className="rounded-2xl bg-slate-950/60 p-3 border border-slate-800">
                <p className="text-[11px] font-semibold text-slate-100">
                  Documents
                </p>
                <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                  <li>• Replace images only if you have better scans.</li>
                  <li>• Ensure visa and passport are valid.</li>
                  <li>• Use “Change Image” buttons to update photos.</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-slate-950/60 p-3 border border-emerald-500/30">
                <p className="text-[11px] font-semibold text-emerald-200">
                  Data tips
                </p>
                <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                  <li>• Keep height and weight updated for fitness tracking.</li>
                  <li>• Use position consistently (e.g., “Striker”, “GK”).</li>
                  <li>• Birth year is used to check age group eligibility.</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* Image change popup */}
      {activePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white text-black rounded-lg w-96 p-5 shadow-lg">
            <h3 className="text-lg font-semibold mb-3 capitalize">
              Change {activePopup} image
            </h3>
            <div className="mb-3">
              <img
                src={previews[typeToFieldKey(activePopup)] || PLACEHOLDER}
                alt="preview"
                className="w-full h-48 object-cover rounded"
                onError={(e) => {
                  e.target.src = PLACEHOLDER;
                }}
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePopupFileSelect(e, activePopup)}
              className="mb-4 text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActivePopup(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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

/* ----------------- Reusable components ----------------- */

const Input = ({ name, label, value, onChange, type = "text", required }) => (
  <div className="flex flex-col">
    <label className="text-xs mb-1 text-slate-200">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="px-3 py-2.5 rounded-lg bg-slate-950/60 border border-slate-700 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
    />
  </div>
);

const ImageCard = ({ label, previewUrl, onChangeClick }) => (
  <div className="flex flex-col items-center">
    <div className="text-xs mb-2 text-slate-200">{label}</div>
    <div className="h-32 w-32 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 mb-3 flex items-center justify-center">
      <img
        src={previewUrl || PLACEHOLDER}
        alt={label}
        className="h-full w-full object-cover"
        onError={(e) => {
          e.target.src = PLACEHOLDER;
        }}
      />
    </div>
    <button
      type="button"
      onClick={onChangeClick}
      className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-medium text-white shadow"
    >
      Change Image
    </button>
  </div>
);

export default EditPlayerPage;
