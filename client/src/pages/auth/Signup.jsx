import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, AtSign, Calendar, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import CustomAlert from "../../components/common/Alert/CustomAlert";
import ImageUpload from "../../components/user/Profile/ImageUpload";
import api from "../../services/axios";
import { useFlashAlert, useFormValues } from "../../hooks";

const GENRES = ["Fiction", "Science", "History", "Romance", "Mystery", "Biography", "Fantasy", "Thriller", "Self-Help", "Poetry"];

const inputStyle = {
  width: "100%",
  padding: "0.6rem 0.875rem 0.6rem 2.25rem",
  background: "var(--bg-card)",
  border: "1px solid var(--border-medium)",
  borderRadius: "var(--radius-sm)",
  color: "var(--text-primary)",
  fontSize: "var(--text-sm)",
  fontFamily: "var(--font-body)",
  outline: "none",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
};

const focusFn = (e) => {
  e.target.style.borderColor = "var(--accent-sage)";
  e.target.style.boxShadow = "0 0 0 3px var(--accent-sage-ring)";
};
const blurFn = (e) => {
  e.target.style.borderColor = "var(--border-medium)";
  e.target.style.boxShadow = "none";
};

const Field = ({ label, icon, type = "text", name, value, onChange, placeholder, extra }) => {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "var(--space-1)" }}>{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-placeholder)" }}>{icon}</span>
        <input
          type={isPassword ? (showPwd ? "text" : "password") : type}
          name={name} value={value} onChange={onChange} placeholder={placeholder}
          style={{ ...inputStyle, paddingRight: isPassword ? "2.25rem" : "0.875rem" }}
          onFocus={focusFn} onBlur={blurFn}
          {...extra}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: "var(--text-placeholder)", background: "none", border: "none", cursor: "pointer" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-placeholder)"}
          >
            {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
};

const Signup = () => {
  const { showAlert, alertMessage, flashAlert, setShowAlert } = useFlashAlert();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [Values, change, setValues] = useFormValues({
    username: "", email: "", password: "", confirmPassword: "",
    age: "", genre: "", fullname: "", phone: "", image: "",
  });

  const navigate = useNavigate();

  const validatePwd = (p) => p.length >= 6 && /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p) && /[!@#$%^&*(),.?":{}|<>]/.test(p);

  const goStep1 = async () => {
    if (!Values.fullname || !Values.email || !Values.username || !Values.age || !Values.genre) {
      flashAlert("Please fill all fields"); return;
    }
    setLoading(true);
    try {
      const res = await api.post("/validate-step1", { email: Values.email, username: Values.username, age: Values.age });
      flashAlert(res.data.message, () => setStep(2));
    } catch (err) {
      flashAlert(err.response?.data?.message || "Validation failed");
    } finally { setLoading(false); }
  };

  const submit = async () => {
    if (!Values.phone || !/^\d{10}$/.test(Values.phone)) { flashAlert("Phone must be exactly 10 digits"); return; }
    if (!validatePwd(Values.password)) { flashAlert("Password: 6+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special character"); return; }
    if (Values.password !== Values.confirmPassword) { flashAlert("Passwords do not match"); return; }
    setLoading(true);
    try {
      await api.post("/validate-step2", { phone: Values.phone, password: Values.password });
      await api.post("/signup", Values);
      flashAlert("Account created! Please check your email to verify.", () => navigate("/login"));
    } catch (err) {
      flashAlert(err.response?.data?.message || "Signup failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-page)" }}>
      {/* Left decorative panel */}
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
          <p style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--accent-sage)", letterSpacing: "var(--tracking-widest)", textTransform: "uppercase", marginBottom: "var(--space-4)" }}>
            Join thousands of readers
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {[
              "Personalised book recommendations",
              "Save and organise your wishlist",
              "Track your purchases",
              "Curated collections by genre",
            ].map((item) => (
              <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--text-faint)", lineHeight: "var(--leading-relaxed)" }}>
                <span style={{ color: "var(--accent-sage)", marginTop: "2px", flexShrink: 0 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p style={{ fontSize: "var(--text-xs)", color: "var(--text-faint)", opacity: 0.6 }}>© 2025 BookMosaic</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: step === 1 ? -16 : 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          <div style={{ marginBottom: "var(--space-7)" }}>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-3xl)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-1)" }}>
              {step === 1 ? "Create your account" : "Final details"}
            </h1>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>Step {step} of 2</p>
            <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
              {[1, 2].map((s) => (
                <div key={s} style={{ height: "3px", flex: 1, borderRadius: "var(--radius-xs)", background: s <= step ? "var(--accent-sage)" : "var(--border-light)", transition: "background 0.2s ease" }} />
              ))}
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <Field label="Full Name" icon={<User size={13} />} name="fullname" value={Values.fullname} onChange={change} placeholder="Jane Austen" />
              <Field label="Email" icon={<Mail size={13} />} type="email" name="email" value={Values.email} onChange={change} placeholder="you@example.com" />
              <Field label="Username" icon={<AtSign size={13} />} name="username" value={Values.username} onChange={change} placeholder="janeausten" />
              <Field label="Age" icon={<Calendar size={13} />} type="number" name="age" value={Values.age} onChange={change} placeholder="25" extra={{ min: 1, max: 120 }} />

              <div>
                <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "var(--space-2)" }}>Favourite Genre</label>
                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {GENRES.map((g) => (
                    <button key={g} type="button"
                      onClick={() => setValues((p) => ({ ...p, genre: g }))}
                      className="py-1.5 px-2 text-xs font-medium transition-all rounded-sm"
                      style={{
                        background: Values.genre === g ? "var(--accent-sage-bg)" : "var(--bg-card)",
                        border: `1px solid ${Values.genre === g ? "var(--accent-sage)" : "var(--border-medium)"}`,
                        color: Values.genre === g ? "var(--accent-sage-text)" : "var(--text-secondary)",
                        cursor: "pointer",
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <input
                  name="genre" value={Values.genre} onChange={change} placeholder="Or type a genre..."
                  style={{ width: "100%", padding: "var(--space-2) var(--space-3)", background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-sm)", fontSize: "var(--text-sm)", color: "var(--text-primary)", fontFamily: "var(--font-body)", outline: "none" }}
                  onFocus={focusFn} onBlur={blurFn}
                />
              </div>

              <button onClick={goStep1} disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
                style={{ marginTop: "var(--space-2)" }}
              >
                {loading
                  ? <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  : <>Continue <ArrowRight size={14} /></>
                }
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "var(--space-1)" }}>Phone Number</label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 rounded-sm text-sm shrink-0"
                    style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}>
                    +91
                  </div>
                  <div className="relative flex-1">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-placeholder)" }} />
                    <input
                      type="tel" name="phone" maxLength={10} value={Values.phone} onChange={change}
                      placeholder="9876543210"
                      style={{ width: "100%", padding: "0.6rem 0.875rem 0.6rem 2.25rem", background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-sm)", fontSize: "var(--text-sm)", color: "var(--text-primary)", fontFamily: "var(--font-body)", outline: "none" }}
                      onFocus={focusFn} onBlur={blurFn}
                    />
                  </div>
                </div>
              </div>

              <Field label="Password" icon={<Lock size={13} />} type="password" name="password" value={Values.password} onChange={change} placeholder="Min 6 chars, uppercase, special" />
              <Field label="Confirm Password" icon={<Lock size={13} />} type="password" name="confirmPassword" value={Values.confirmPassword} onChange={change} placeholder="Repeat your password" />

              <div>
                <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "var(--space-2)" }}>
                  Profile Picture <span style={{ color: "var(--text-muted)" }}>(optional)</span>
                </label>
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-sm)", padding: "var(--space-3)" }}>
                  <ImageUpload onImageSelect={(img) => setValues((p) => ({ ...p, image: img }))} />
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
                <button onClick={() => setStep(1)} className="btn btn-secondary flex items-center gap-1.5">
                  <ArrowLeft size={13} /> Back
                </button>
                <button onClick={submit} disabled={loading}
                  className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading
                    ? <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                    : <>Create Account <ArrowRight size={14} /></>
                  }
                </button>
              </div>
            </div>
          )}

          <p style={{ textAlign: "center", fontSize: "var(--text-sm)", color: "var(--text-muted)", marginTop: "var(--space-6)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--accent-sage)", fontWeight: 500, textDecoration: "none" }}>Sign in</Link>
          </p>
        </motion.div>
      </div>

      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
};

export default Signup;
