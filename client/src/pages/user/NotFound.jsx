import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div
    style={{
      minHeight: "100vh",
      background: "var(--bg-page)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--space-10)",
    }}
  >
    <div style={{ textAlign: "center", maxWidth: 480 }}>
      <p
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "6rem",
          fontWeight: 700,
          color: "var(--border-medium)",
          lineHeight: 1,
          marginBottom: "var(--space-4)",
          letterSpacing: "-0.04em",
        }}
      >
        404
      </p>
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "var(--text-2xl)",
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: "var(--space-3)",
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--text-muted)",
          lineHeight: "var(--leading-relaxed)",
          marginBottom: "var(--space-8)",
        }}
      >
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center", flexWrap: "wrap" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <button className="btn btn-primary">Back to Home</button>
        </Link>
        <Link to="/books" style={{ textDecoration: "none" }}>
          <button className="btn btn-secondary">Browse Books</button>
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
