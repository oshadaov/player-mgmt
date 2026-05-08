// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../auth/authService";
import { useAuth } from "../auth/AuthContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LoginPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const [snack, setSnack] = useState({ open: false, message: "", severity: "error" });

  const handleClose = () => setSnack((s) => ({ ...s, open: false }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginRequest(form.username, form.password);
      if (!data?.token) throw new Error("No token returned");
      
      // Save all session info
      login(data.token);
      
      const role = data.role;
      const entityId = data.entityId;
      const username = data.username;

      console.log("Login Success Data:", { role, entityId, username });

      localStorage.setItem("role", role);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", username);
      
      if (entityId) {
        localStorage.setItem("entityId", entityId);
      } else {
        localStorage.removeItem("entityId");
      }

      localStorage.setItem("user", JSON.stringify({
        username: username,
        role: role,
        entityId: entityId
      }));

      setSnack({ open: true, message: "Login successful!", severity: "success" });

      // Role-based redirection
      if (role === "SUPER_ADMIN") {
        navigate("/superadmindashboard");
      } else if (role === "ADMIN") {
        navigate("/admindashboard");
      } else if (role === "CLUB") {
        if (!entityId || entityId === "null") {
          console.error("Missing entityId for CLUB user");
          setSnack({ open: true, message: "Incomplete club profile. Contact support.", severity: "error" });
        } else {
          navigate(`/clubs/${entityId}`);
        }
      } else if (role === "PLAYER") {
        navigate("/players/profile");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: err?.response?.data?.message || err.message || "Login failed", severity: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-purple-900">
      <form onSubmit={submit} className="bg-white/5 p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-4">Sign in</h2>

        <label className="text-sm text-white/80">Username</label>
        <input
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full px-3 py-2 rounded-lg mb-3"
        />

        <label className="text-sm text-white/80">Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-3 py-2 rounded-lg mb-4"
        />

        <button type="submit" className="w-full bg-purple-600 py-2 rounded-lg text-white font-semibold">
          Sign in
        </button>
      </form>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleClose} severity={snack.severity}>
          {snack.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;
