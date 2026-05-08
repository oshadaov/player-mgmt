// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../auth/api";
import PitchBg from "../assets/hero.jpg";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await API.post("/auth/signup", {
        email: formData.email,
        password: formData.password
      });
      alert("✅ Account created successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6" style={{ backgroundImage: `url(${PitchBg})`, backgroundSize: "cover" }}>
      <div className="max-w-md w-full bg-slate-900/90 p-10 rounded-3xl backdrop-blur-xl border border-slate-800 shadow-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-black text-emerald-400 uppercase tracking-tighter">Join the League</h1>
          <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Create your representative account</p>
        </header>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/40 rounded-2xl text-red-400 text-xs text-center font-bold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Official Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              onChange={handleChange} 
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-emerald-500 outline-none transition text-sm" 
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              onChange={handleChange} 
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-emerald-500 outline-none transition text-sm" 
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Confirm Password</label>
            <input 
              name="confirmPassword" 
              type="password" 
              required 
              onChange={handleChange} 
              className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl focus:border-emerald-500 outline-none transition text-sm" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-2xl hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 uppercase tracking-widest mt-4 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500">
          Already have an account? <Link to="/login" className="text-emerald-400 font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
