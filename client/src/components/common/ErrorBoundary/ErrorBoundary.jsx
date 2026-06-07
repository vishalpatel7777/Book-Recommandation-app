import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--space-10)",
        }}
      >
        <div
          style={{
            maxWidth: 480,
            width: "100%",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-10) var(--space-8)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "rgba(184,84,80,0.08)",
              border: "1px solid rgba(184,84,80,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto var(--space-5)",
              fontSize: "1.5rem",
            }}
          >
            ⚠
          </div>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-xl)",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginBottom: "var(--space-2)",
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text-muted)",
              lineHeight: "var(--leading-relaxed)",
              marginBottom: "var(--space-7)",
            }}
          >
            An unexpected error occurred. You can try again or return to the home page.
          </p>
          <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center" }}>
            <button
              onClick={this.handleReset}
              className="btn btn-secondary"
              style={{ minWidth: 110 }}
            >
              Try Again
            </button>
            <a href="/" style={{ textDecoration: "none" }}>
              <button className="btn btn-primary" style={{ minWidth: 110 }}>
                Go Home
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
