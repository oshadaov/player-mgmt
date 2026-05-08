// src/pages/CompleteClubProfile.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PitchBg from "../assets/hero.jpg";
import API from "../auth/api";

const CompleteClubProfile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

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
  const [certFile, setCertFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClub = async () => {
      if (!token) {
        setError("Invalid or missing invitation token.");
        setFetching(false);
        return;
      }
      try {
        const res = await API.get(`/api/clubs/token/${token}`);
        const c = res.data;
        setFormData(prev => ({
          ...prev,
          clubName: c.clubName,
          contactEmail: c.contactEmail
        }));
      } catch (err) {
        setError("Failed to retrieve club invitation. It may have expired or is invalid.");
      } finally {
        setFetching(false);
      }
    };
    fetchClub();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      data.append("invitationToken", token);
      if (logoFile) data.append("logoFile", logoFile);
      if (certFile) data.append("certificateFile", certFile);

      await API.post("/api/clubs", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("✅ Profile completed! Pending administrative approval.");
      navigate("/");
    } catch (err) {
      console.error("Submission failed:", err);
      setError(err.response?.data?.message || "Failed to submit profile.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400">Verifying Invitation...</div>;
  if (error) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-red-400">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8" style={{ backgroundImage: `url(${PitchBg})`, backgroundSize: "cover" }}>
      <div className="max-w-3xl mx-auto bg-slate-900/90 p-8 rounded-3xl backdrop-blur-xl border border-slate-800 shadow-2xl">
        <header className="mb-8 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-black text-emerald-400 uppercase tracking-tighter">Complete Club Profile</h1>
          <p className="text-xs text-slate-400 mt-2">Please provide the remaining organizational details for <span className="text-white font-bold">{formData.clubName}</span>.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Input label="District" name="district" value={formData.district} required onChange={handleChange} />
             <Input label="Province" name="province" value={formData.province} required onChange={handleChange} />
             <Input label="Founding Year" name="foundingYear" type="number" value={formData.foundingYear} onChange={handleChange} />
             <Input label="Home Ground Name" name="homeGroundName" value={formData.homeGroundName} onChange={handleChange} />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-widest">Authorized Contact Person</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" name="contactPersonName" value={formData.contactPersonName} required onChange={handleChange} />
              <Input label="NIC Number" name="contactNic" value={formData.contactNic} required onChange={handleChange} />
              <Input label="Phone Number" name="contactPhone" value={formData.contactPhone} required onChange={handleChange} />
              <Input label="Email Address" name="contactEmail" value={formData.contactEmail} disabled />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-sky-400 uppercase tracking-widest">Documents & Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileInput label="Club Logo" onChange={(e) => setLogoFile(e.target.files[0])} />
              <FileInput label="Registration Certificate (PDF/IMG)" onChange={(e) => setCertFile(e.target.files[0])} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-2xl hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 uppercase tracking-widest mt-8 disabled:opacity-50"
          >
            {loading ? "Submitting Profile..." : "Submit for Approval"}
          </button>
        </form>
      </div>
    </div>
  );
};

const Input = ({ label, name, value, type = "text", required, onChange, disabled }) => (
  <div>
    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">{label}</label>
    <input 
      name={name} 
      type={type} 
      value={value}
      required={required} 
      disabled={disabled}
      onChange={onChange} 
      className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-emerald-500 outline-none transition text-sm disabled:opacity-50" 
    />
  </div>
);

const FileInput = ({ label, onChange }) => (
  <div>
    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">{label}</label>
    <input 
      type="file" 
      onChange={onChange} 
      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-800 file:text-slate-100" 
    />
  </div>
);

export default CompleteClubProfile;
