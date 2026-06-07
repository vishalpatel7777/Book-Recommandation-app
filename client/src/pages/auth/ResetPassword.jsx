import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import CustomAlert from "../../components/common/Alert/CustomAlert";
import api from "../../services/axios";

const inputStyle = {
  width: "100%",
  padding: "0.6rem 0.875rem",
  background: "var(--bg-card)",
  border: "1px solid var(--border-medium)",
  borderRadius: "var(--radius-sm)",
  color: "var(--text-primary)",
  fontSize: "var(--text-sm)",
  fontFamily: "var(--font-body)",
  outline: "none",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
};

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const focusFn = (e) => {
    e.target.style.borderColor = "var(--accent-sage)";
    e.target.style.boxShadow = "0 0 0 3px var(--accent-sage-ring)";
  };
  const blurFn = (e) => {
    e.target.style.borderColor = "var(--border-medium)";
    e.target.style.boxShadow = "none";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setAlertMessage("Passwords do not match");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
      return;
    }

    try {
      const response = await api.post(`/reset-password/${token}`, { password });
      setAlertMessage(response.data.message);
      setShowAlert(true);
      setTimeout(() => { setShowAlert(false); navigate("/login"); }, 2000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Failed to reset password");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-page)", padding: "0 var(--space-4)" }}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "var(--space-8)", width: "100%", maxWidth: "24rem", boxShadow: "var(--shadow-card)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-6)" }}>
          <div style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: "var(--accent-sage-bg)", border: "1px solid var(--accent-sage-mid)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={14} style={{ color: "var(--accent-sage)" }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)" }}>Reset Password</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "var(--space-1)" }}>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              style={inputStyle}
              onFocus={focusFn} onBlur={blurFn}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "var(--space-1)" }}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              style={inputStyle}
              onFocus={focusFn} onBlur={blurFn}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" style={{ marginTop: "var(--space-2)" }}>
            Reset Password
          </button>
        </form>
      </div>
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
};

export default ResetPassword;
