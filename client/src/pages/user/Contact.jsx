import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const focusBlur = {
  onFocus: (e) => { e.target.style.borderColor = "#5C7A5E"; e.target.style.boxShadow = "0 0 0 2px rgba(92,122,94,0.12)"; },
  onBlur: (e) => { e.target.style.borderColor = "#E0D9CC"; e.target.style.boxShadow = "none"; },
};

const inputStyle = { background: "#FAF8F3", border: "1px solid #E0D9CC", color: "#2C2C2C", borderRadius: "2px", outline: "none", width: "100%", padding: "10px 12px", fontSize: "0.875rem", transition: "all 0.15s ease" };

function Contactus() {
  const form = useRef();
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);
    const userEmail = formData.get("email");

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    const autoReplyTemplate = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE;
    if (!serviceId || !templateId || !publicKey) {
      setError("Contact service not configured.");
      return;
    }
    emailjs
      .sendForm(serviceId, templateId, form.current, publicKey)
      .then(
        () => {
          setIsSent(true);
          setError("");
          if (autoReplyTemplate) {
            emailjs.send(serviceId, autoReplyTemplate, {
              to_email: userEmail,
              user_name: formData.get("name"),
              message: formData.get("message"),
            }, publicKey);
          }
          form.current.reset();
        },
        () => {
          setIsSent(false);
          setError("Failed to send message. Try again later.");
        }
      );
  };

  return (
    <main className="min-h-screen" style={{ background: "#FAF8F3", paddingTop: "72px" }}>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#8B6F47", letterSpacing: "0.14em", textTransform: "uppercase", display: "block", marginBottom: "16px" }}>Contact</span>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 600, color: "#1C1C1C", letterSpacing: "-0.02em" }}>
            We'd love to hear from <em style={{ color: "#5C7A5E", fontStyle: "italic" }}>you.</em>
          </h1>
        </motion.div>

        <div className="grid md:grid-cols-[1fr_1.5fr] gap-8">
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
            {[
              { icon: <MapPin size={14} />, label: "Address", value: import.meta.env.VITE_CONTACT_ADDRESS || "BookMosaic HQ, Your City" },
              { icon: <Mail size={14} />, label: "Email", value: import.meta.env.VITE_CONTACT_EMAIL || "support@bookmosaic.example" },
              { icon: <Phone size={14} />, label: "Phone", value: import.meta.env.VITE_CONTACT_PHONE || "+91 00000 00000" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-4 rounded-sm" style={{ background: "#FFFFFF", border: "1px solid #E8E2D6" }}>
                <div className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(92,122,94,0.1)", color: "#5C7A5E" }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: "0.68rem", color: "#A0A0A0", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "2px" }}>{item.label}</p>
                  <p style={{ fontSize: "0.875rem", color: "#2C2C2C" }}>{item.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="rounded-sm p-6" style={{ background: "#FFFFFF", border: "1px solid #E8E2D6" }}>
              <form ref={form} onSubmit={sendEmail} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 500, color: "#8A8A8A", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Name</label>
                    <input type="text" name="name" placeholder="Your name" required style={inputStyle} {...focusBlur} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 500, color: "#8A8A8A", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</label>
                    <input type="email" name="email" placeholder="Your email" required style={inputStyle} {...focusBlur} />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 500, color: "#8A8A8A", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Subject</label>
                  <input type="text" name="subject" placeholder="Subject" required style={inputStyle} {...focusBlur} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 500, color: "#8A8A8A", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Message</label>
                  <textarea name="message" placeholder="Your message..." required rows={4}
                    style={{ ...inputStyle, resize: "none" }} {...focusBlur} />
                </div>

                {isSent && (
                  <p style={{ fontSize: "0.8rem", color: "#5C7A5E", padding: "8px 12px", background: "rgba(92,122,94,0.08)", border: "1px solid rgba(92,122,94,0.2)", borderRadius: "2px" }}>
                    Message sent — we'll be in touch soon.
                  </p>
                )}
                {error && (
                  <p style={{ fontSize: "0.8rem", color: "#B85450", padding: "8px 12px", background: "rgba(184,84,80,0.06)", border: "1px solid rgba(184,84,80,0.2)", borderRadius: "2px" }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-sm text-sm font-medium text-white transition-all"
                  style={{ background: "#5C7A5E" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#4A6350"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#5C7A5E"}
                >
                  <Send size={13} /> Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default Contactus;
