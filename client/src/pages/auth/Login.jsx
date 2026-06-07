import React, { useState } from "react";
import { loginSuccess } from "../../store/slices/auth.slice";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, X, Eye, EyeOff } from "lucide-react";
import CustomAlert from "../../components/common/Alert/CustomAlert";
import api from "../../services/axios";
import { useFlashAlert, useFormValues } from "../../hooks";

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

const Login = () => {
  const { showAlert, alertMessage, flashAlert, setShowAlert } = useFlashAlert();
  const [Values, change] = useFormValues({ email: "", password: "" });
  const [resetEmail, setResetEmail] = useState("");
  const [showResetPrompt, setShowResetPrompt] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submit = async () => {
    if (!Values.email || !Values.password) { flashAlert("Please fill all fields"); return; }
    setLoading(true);
    try {
      const response = await api.post("/login", Values);
      const user = response.data;
      dispatch(loginSuccess({ user }));
      navigate(user.role === "admin" ? "/admin/dashboard" : "/welcome");
    } catch (error) {
      flashAlert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!resetEmail) { flashAlert("Please enter your email"); return; }
    try {
      const res = await api.post("/forgot-password", { email: resetEmail });
      flashAlert(res.data.message, () => { setShowResetPrompt(false); setResetEmail(""); });
    } catch (err) {
      flashAlert(err.response?.data?.message || "Failed to send reset link");
    }
  };

  const focusStyle = (e) => {
    e.target.style.borderColor = "var(--accent-sage)";
    e.target.style.boxShadow = "0 0 0 3px var(--accent-sage-ring)";
  };
  const blurStyle = (e) => {
    e.target.style.borderColor = "var(--border-medium)";
    e.target.style.boxShadow = "none";
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-page)" }}>
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] p-12" style={{ background: "var(--bg-dark)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <div style={{ width: 28, height: 28, background: "var(--accent-sage)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2.5h10M2 5h10M2 7.5h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <rect x="7" y="6.5" width="5" height="5" rx="0.75" fill="white" opacity="0.7"/>
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "var(--text-base)", color: "var(--text-inverse)" }}>BookMosaic</span>
        </div>

        <div>
          <blockquote style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 400, fontStyle: "italic", color: "var(--text-inverse)", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-6)", opacity: 0.9 }}>
            "A reader lives a thousand lives before he dies. The man who never reads lives only one."
          </blockquote>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-faint)", letterSpacing: "var(--tracking-wide)" }}>— George R.R. Martin</p>
        </div>

        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-faint)", opacity: 0.6 }}>© 2025 BookMosaic</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div style={{ marginBottom: "var(--space-8)" }}>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-3xl)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>Sign in to your BookMosaic account</p>
          </div>

          <div className="space-y-4">
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "var(--space-1)" }}>Email address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
                <input
                  type="email" name="email" value={Values.email} onChange={change}
                  placeholder="you@example.com"
                  style={{ ...inputStyle, paddingLeft: "2.25rem" }}
                  onFocus={focusStyle} onBlur={blurStyle}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "var(--space-1)" }}>Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
                <input
                  type={showPassword ? "text" : "password"} name="password" value={Values.password} onChange={change}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingLeft: "2.25rem", paddingRight: "2.25rem" }}
                  onFocus={focusStyle} onBlur={blurStyle}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <button onClick={() => setShowResetPrompt(true)}
                style={{ fontSize: "var(--text-xs)", color: "var(--accent-sage)", background: "none", border: "none", cursor: "pointer", transition: "var(--transition-color)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-sage-dark)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--accent-sage)"}
              >
                Forgot password?
              </button>
            </div>

            <button
              onClick={submit} disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center"
              style={{ padding: "0.65rem", marginTop: "var(--space-1)" }}
            >
              {loading ? (
                <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              ) : "Sign in"}
            </button>
          </div>

          <p style={{ textAlign: "center", fontSize: "var(--text-sm)", color: "var(--text-muted)", marginTop: "var(--space-6)" }}>
            No account?{" "}
            <Link to="/signup" style={{ color: "var(--accent-sage)", fontWeight: 500, textDecoration: "none" }}>Create one</Link>
          </p>
        </motion.div>
      </div>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {showResetPrompt && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "var(--bg-overlay)", backdropFilter: "blur(4px)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              style={{ background: "var(--bg-card)", border: `1px solid var(--border)`, boxShadow: "var(--shadow-modal)", borderRadius: "var(--radius-md)", padding: "var(--space-6)", width: "100%", maxWidth: "24rem", margin: "0 var(--space-4)", position: "relative" }}
            >
              <button onClick={() => setShowResetPrompt(false)} style={{ position: "absolute", top: "var(--space-4)", right: "var(--space-4)", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
                <X size={15} />
              </button>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-1)" }}>Reset password</h3>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>We'll send a reset link to your email.</p>
              <input
                type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ ...inputStyle, marginBottom: "var(--space-3)" }}
                onFocus={focusStyle} onBlur={blurStyle}
              />
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <button onClick={handleReset} className="btn btn-primary" style={{ flex: 1 }}>Send link</button>
                <button onClick={() => setShowResetPrompt(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
};

export default Login;
