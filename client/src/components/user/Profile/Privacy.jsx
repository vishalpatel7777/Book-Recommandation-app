import React from "react";
import { Shield } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: "We collect personal information such as your name, email address, and payment details when you register or make a purchase. We also collect data on your book preferences and reading history to improve your recommendations.",
  },
  {
    title: "2. How We Use Your Information",
    body: "Your information is used to personalize recommendations, process transactions, and enhance your user experience. We do not sell or share your personal data with third parties without your explicit consent.",
  },
  {
    title: "3. Data Security",
    body: "We implement industry-standard security measures, including SSL encryption and secure database practices, to protect your personal data from unauthorized access, alteration, or disclosure.",
  },
  {
    title: "4. Cookies and Tracking",
    body: "We use cookies to maintain your session, remember preferences, and analyze site traffic. You can disable cookies through your browser settings, though some features may not function correctly.",
  },
  {
    title: "5. Third-Party Services",
    body: "We may use third-party services for payment processing and analytics. These services operate under their own privacy policies. We select partners who meet high standards of data protection.",
  },
  {
    title: "6. Your Rights",
    body: `You have the right to access, modify, or request deletion of your personal data. To exercise these rights, contact us at ${import.meta.env.VITE_SUPPORT_EMAIL || "support@bookmosaic.example"}. We will respond within 7 business days.`,
  },
  {
    title: "7. Data Retention",
    body: "We retain your account data for as long as your account is active. You may request account deletion at any time. Purchase records are retained for 3 years for legal and tax compliance.",
  },
  {
    title: "8. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a notice on the platform. Continued use constitutes acceptance of the revised policy.",
  },
];

const Privacy = () => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
      <Shield size={16} style={{ color: "var(--accent-sage)" }} />
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)" }}>Privacy Policy</h2>
    </div>
    <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: "var(--space-7)" }}>Last updated: January 2025</p>

    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-7)", padding: "var(--space-5)", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: `1px solid var(--border-light)` }}>
      At BookMosaic, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.
    </p>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      {SECTIONS.map((s, i) => (
        <div key={i}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>{s.title}</h3>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>{s.body}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Privacy;
