import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--bg-surface-alt)", borderTop: `1px solid var(--border)` }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
              <div style={{ width: 24, height: 24, borderRadius: "var(--radius-sm)", background: "var(--accent-sage)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2.5h10M2 5h10M2 7.5h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <rect x="7" y="6.5" width="5" height="5" rx="0.75" fill="white" opacity="0.7"/>
                </svg>
              </div>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "var(--text-base)", color: "var(--text-primary)", letterSpacing: "var(--tracking-snug)" }}>BookMosaic</span>
            </div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", lineHeight: "var(--leading-relaxed)", maxWidth: "200px" }}>
              A quiet corner of the web for readers who love their books.
            </p>
          </div>

          {/* Discover */}
          <div>
            <h4 className="type-label" style={{ marginBottom: "var(--space-4)" }}>Discover</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {[["Home", "/home"], ["Browse Books", "/category"], ["Library", "/allbooks"], ["About", "/about"]].map(([text, path]) => (
                <li key={path}>
                  <Link to={path}
                    style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", textDecoration: "none", transition: "var(--transition-color)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                  >{text}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Library */}
          <div>
            <h4 className="type-label" style={{ marginBottom: "var(--space-4)" }}>Your Library</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {[["Profile", "/profile"], ["Wishlist", "/wishlist"], ["Cart", "/addtocart"], ["Notifications", "/notification"]].map(([text, path]) => (
                <li key={path}>
                  <Link to={path}
                    style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", textDecoration: "none", transition: "var(--transition-color)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                  >{text}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="type-label" style={{ marginBottom: "var(--space-4)" }}>Legal</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              {[["Terms of Use", "/profile/terms"], ["Privacy Policy", "/profile/privacy-policy"], ["FAQ", "/profile/faq"]].map(([text, path]) => (
                <li key={path}>
                  <Link to={path}
                    style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", textDecoration: "none", transition: "var(--transition-color)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                  >{text}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: "var(--space-10)", paddingTop: "var(--space-6)", borderTop: `1px solid var(--border)`, display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-2)" }} className="sm:flex-row sm:justify-between">
          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>© {year} BookMosaic · Crafted with care · India</p>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-faint)", fontStyle: "italic" }}>"Not all those who wander are lost — but all readers find their way."</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
