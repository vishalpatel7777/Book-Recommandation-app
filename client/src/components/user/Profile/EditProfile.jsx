import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone } from "lucide-react";
import Loader from "../../common/Loader/Loader";
import CustomAlert from "../../common/Alert/CustomAlert";
import api from "../../../services/axios";
import { useFlashAlert, useFormValues } from "../../../hooks";

const inputStyle = {
  width: "100%",
  padding: "0.6rem 0.875rem",
  background: "var(--bg-page)",
  border: "1px solid var(--border-medium)",
  borderRadius: "var(--radius-sm)",
  color: "var(--text-primary)",
  fontSize: "var(--text-sm)",
  fontFamily: "var(--font-body)",
  outline: "none",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
};

const EditProfile = () => {
  const { showAlert, alertMessage, flashAlert, setShowAlert } = useFlashAlert();
  const [profileData, setProfileData] = useState(null);
  const [Values, change, setValues] = useFormValues({ age: "", genre: "" });

  useEffect(() => {
    api.get("/user-information")
      .then((r) => { setProfileData(r.data); setValues({ age: r.data.age || "", genre: r.data.genre || "" }); })
      .catch(() => setProfileData(null));
  }, []);

  const save = async () => {
    try {
      const res = await api.put("/update", Values);
      flashAlert(res.data.message);
    } catch (err) {
      flashAlert(err.response?.data?.message || "Failed to update profile");
    }
  };

  const focusFn = (e) => {
    e.target.style.borderColor = "var(--accent-sage)";
    e.target.style.boxShadow = "0 0 0 3px var(--accent-sage-ring)";
  };
  const blurFn = (e) => {
    e.target.style.borderColor = "var(--border-medium)";
    e.target.style.boxShadow = "none";
  };

  if (!profileData) return <div style={{ padding: "var(--space-8) 0" }}><Loader /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-5)" }}>Edit Profile</h2>

      <div className="grid sm:grid-cols-2 gap-3" style={{ marginBottom: "var(--space-5)" }}>
        {[
          { icon: <User size={12} />, label: "Username", value: `@${profileData.username}` },
          { icon: <Mail size={12} />, label: "Email", value: profileData.email },
          { icon: <Phone size={12} />, label: "Phone", value: profileData.phone ? `+91 ${profileData.phone}` : "—" },
        ].map(({ icon, label, value }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", padding: "var(--space-3)", borderRadius: "var(--radius-sm)", background: "var(--bg-surface)", border: "1px solid var(--border-light)" }}>
            <span style={{ color: "var(--text-muted)" }}>{icon}</span>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)" }}>{label}</p>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-primary)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div>
          <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "var(--space-1)" }}>Age</label>
          <input
            type="number" name="age" value={Values.age} onChange={change}
            placeholder="Your age"
            style={inputStyle}
            onFocus={focusFn} onBlur={blurFn}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "var(--space-1)" }}>Favourite Genre</label>
          <input
            type="text" name="genre" value={Values.genre} onChange={change}
            placeholder="e.g. Fiction, Science"
            style={inputStyle}
            onFocus={focusFn} onBlur={blurFn}
          />
        </div>
      </div>

      <button onClick={save} className="btn btn-primary" style={{ marginTop: "var(--space-5)" }}>
        Save Changes
      </button>

      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </motion.div>
  );
};

export default EditProfile;
