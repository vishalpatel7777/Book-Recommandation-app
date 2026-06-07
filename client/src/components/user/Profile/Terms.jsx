import React from "react";
import { FileText } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Account Registration",
    body: "To access certain features, you must register an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.",
  },
  {
    title: "2. Use of Services",
    body: "You agree not to misuse the platform, engage in unlawful activities, or violate intellectual property rights. You may not use BookMosaic to distribute spam, malware, or harmful content.",
  },
  {
    title: "3. Purchases and Payments",
    body: "All purchases made through BookMosaic are processed through a secure, encrypted payment gateway. Prices are listed in INR and include applicable taxes.",
  },
  {
    title: "4. Refund Policy",
    body: "Refunds are assessed case-by-case. For duplicate transactions or verified technical errors, please contact support within 7 days of purchase. Digital goods are generally non-refundable once delivered.",
  },
  {
    title: "5. Intellectual Property",
    body: "All content on BookMosaic, including book descriptions, recommendation algorithms, and UI designs, is protected by applicable copyright laws. Unauthorized reproduction is prohibited.",
  },
  {
    title: "6. Changes to Terms",
    body: "We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the updated terms.",
  },
  {
    title: "7. Contact Information",
    body: "For questions about these Terms and Conditions, contact us at support@bookmosaic.com. We aim to respond within 2 business days.",
  },
];

const Terms = () => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
      <FileText size={16} style={{ color: "var(--accent-sage)" }} />
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)" }}>Terms and Conditions</h2>
    </div>
    <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: "var(--space-7)" }}>Last updated: January 2025</p>

    <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)", marginBottom: "var(--space-7)", padding: "var(--space-5)", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: `1px solid var(--border-light)` }}>
      Welcome to BookMosaic! By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions.
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

export default Terms;
