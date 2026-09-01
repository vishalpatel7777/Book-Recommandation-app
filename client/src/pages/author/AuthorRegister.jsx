import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, PenTool } from "lucide-react";
import api from "../../services/axios";
import { useFlashAlert, useFormValues } from "../../hooks";
import CustomAlert from "../../components/common/Alert/CustomAlert";

const inputStyle = {
  width: "100%", padding: "0.55rem 0.75rem", background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box",
};

export default function AuthorRegister() {
  const { showAlert, alertMessage, flashAlert, setShowAlert } = useFlashAlert();
  const [Values, change] = useFormValues({ username: "", email: "", password: "", fullname: "", phone: "", age: 25, genre: "Fiction", penName: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    if (!Values.username || !Values.email || !Values.password || !Values.fullname || !Values.phone) { flashAlert("Please fill all required fields"); return; }
    setLoading(true);
    try {
      await api.post("/author/register", Values);
      flashAlert("Author registered! Please sign in.", () => navigate("/author/login"));
    } catch (err) {
      flashAlert(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  const Field = ({ label, children, hint }) => (
    <div style={{ marginBottom: 14 }}>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 5, display: "block" }}>{label}</span>
      {children}
      {hint && <p style={{ fontSize: "0.68rem", color: "var(--text-faint)", marginTop: 4 }}>{hint}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: "var(--bg-page)" }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <PenTool size={16} style={{ color: "var(--accent-sage)" }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-sage)" }}>Author Portal</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", fontWeight: 600, color: "var(--text-primary)" }}>Become an Author</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 6 }}>Publish books, build your audience on BookMosaic</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Full Name *"><input style={inputStyle} name="fullname" value={Values.fullname} onChange={change} placeholder="Jane Doe" /></Field>
          <Field label="Username *"><input style={inputStyle} name="username" value={Values.username} onChange={change} placeholder="janedoe" /></Field>
          <Field label="Email *"><input style={inputStyle} name="email" value={Values.email} onChange={change} placeholder="jane@example.com" /></Field>
          <Field label="Phone *"><input style={inputStyle} name="phone" value={Values.phone} onChange={change} placeholder="10 digits" maxLength={10} /></Field>
          <Field label="Age"><input type="number" style={inputStyle} name="age" value={Values.age} onChange={change} /></Field>
          <Field label="Genre"><input style={inputStyle} name="genre" value={Values.genre} onChange={change} placeholder="Fiction, Self-Help..." /></Field>
        </div>
        <Field label="Pen Name" hint="Public display name for your books"><input style={inputStyle} name="penName" value={Values.penName} onChange={change} placeholder="J. Doe" /></Field>
        <Field label="Bio"><textarea style={{ ...inputStyle, resize: "vertical" }} rows={3} name="bio" value={Values.bio} onChange={change} placeholder="Short author bio..." /></Field>
        <Field label="Password *"><input type="password" style={inputStyle} name="password" value={Values.password} onChange={change} placeholder="••••••••" /></Field>

        <button onClick={submit} disabled={loading} className="btn btn-primary w-full flex items-center justify-center" style={{ padding: "0.65rem", marginTop: 8 }}>
          {loading ? "Creating…" : "Create Author Account"}
        </button>

        <p style={{ textAlign: "center", fontSize: "var(--text-sm)", color: "var(--text-muted)", marginTop: 16 }}>
          Already an author? <Link to="/author/login" style={{ color: "var(--accent-sage)", fontWeight: 500 }}>Sign in</Link>
          <span style={{ margin: "0 8px", color: "var(--text-faint)" }}>·</span>
          <Link to="/login" style={{ color: "var(--text-muted)" }}>Reader login</Link>
        </p>
      </motion.div>
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
}
