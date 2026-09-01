import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, PenTool } from "lucide-react";
import api from "../../services/axios";
import { loginSuccess } from "../../store/slices/auth.slice";
import { useFlashAlert, useFormValues } from "../../hooks";
import CustomAlert from "../../components/common/Alert/CustomAlert";

const inputStyle = {
  width: "100%", padding: "0.6rem 0.875rem", background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", outline: "none", transition: "border-color 0.15s ease, box-shadow 0.15s ease",
};

export default function AuthorLogin() {
  const { showAlert, alertMessage, flashAlert, setShowAlert } = useFlashAlert();
  const [Values, change] = useFormValues({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submit = async () => {
    if (!Values.email || !Values.password) { flashAlert("Please fill all fields"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/author/login", Values);
      const user = data;
      dispatch(loginSuccess({ user }));
      navigate("/author/dashboard");
    } catch (err) {
      flashAlert(err.response?.data?.message || "Author login failed");
    } finally { setLoading(false); }
  };

  const focusStyle = (e) => { e.target.style.borderColor = "var(--accent-sage)"; e.target.style.boxShadow = "0 0 0 3px var(--accent-sage-ring)"; };
  const blurStyle = (e) => { e.target.style.borderColor = "var(--border-medium)"; e.target.style.boxShadow = "none"; };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-page)" }}>
      <div className="hidden lg:flex flex-col justify-between w-[42%] p-12" style={{ background: "var(--bg-dark)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <div style={{ width: 28, height: 28, background: "var(--accent-sage)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PenTool size={14} color="white" />
          </div>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "var(--text-base)", color: "var(--text-inverse)" }}>BookMosaic · Authors</span>
        </div>
        <div>
          <blockquote style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 400, fontStyle: "italic", color: "var(--text-inverse)", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-6)", opacity: 0.9 }}>
            "There is no greater agony than bearing an untold story inside you."
          </blockquote>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-faint)", letterSpacing: "var(--tracking-wide)" }}>— Maya Angelou</p>
        </div>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-faint)", opacity: 0.6 }}>© 2025 BookMosaic Authors</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
          <div style={{ marginBottom: "var(--space-8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <PenTool size={18} style={{ color: "var(--accent-sage)" }} />
              <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-sage)" }}>Author Portal</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-3xl)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>Author sign in</h1>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>Access your dashboard, manage books & track sales</p>
          </div>

          <div className="space-y-4">
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "var(--space-1)" }}>Email address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
                <input type="email" name="email" value={Values.email} onChange={change} placeholder="author@example.com" style={{ ...inputStyle, paddingLeft: "2.25rem" }} onFocus={focusStyle} onBlur={blurStyle} onKeyDown={(e) => e.key === "Enter" && submit()} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "var(--space-1)" }}>Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
                <input type={showPassword ? "text" : "password"} name="password" value={Values.password} onChange={change} placeholder="••••••••" style={{ ...inputStyle, paddingLeft: "2.25rem", paddingRight: "2.25rem" }} onFocus={focusStyle} onBlur={blurStyle} onKeyDown={(e) => e.key === "Enter" && submit()} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <button onClick={submit} disabled={loading} className="btn btn-primary w-full flex items-center justify-center" style={{ padding: "0.65rem", marginTop: "var(--space-1)" }}>
              {loading ? <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> : "Sign in as Author"}
            </button>
          </div>

          <p style={{ textAlign: "center", fontSize: "var(--text-sm)", color: "var(--text-muted)", marginTop: "var(--space-6)" }}>
            Not an author? <Link to="/author/register" style={{ color: "var(--accent-sage)", fontWeight: 500 }}>Register here</Link>
            <span style={{ margin: "0 8px", color: "var(--text-faint)" }}>·</span>
            <Link to="/login" style={{ color: "var(--text-muted)" }}>Reader login</Link>
          </p>
        </motion.div>
      </div>
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
}
