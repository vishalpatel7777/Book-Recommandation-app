const theme = {
  colors: {
    primary: "#5C7A5E",
    primaryDark: "#4A6350",
    primaryLight: "#7A9E7C",

    secondary: "#8B6F47",
    secondaryDark: "#6D5538",

    success: "#5C7A5E",
    error: "#B85450",
    warning: "#8B6F47",
    info: "#5A7A8A",

    background: {
      page: "#FAF8F3",
      card: "#FFFFFF",
      navbar: "rgba(250,248,243,0.92)",
      surface: "#F5F2EC",
      surfaceHover: "#FDFCF9",
      parchment: "#EDE8DF",
    },

    text: {
      primary: "#2C2C2C",
      secondary: "#5A5A5A",
      muted: "#8A8A8A",
      faint: "#A8A29E",
    },

    border: "#E8E2D6",
    borderMedium: "#D8D1C4",
    borderFocus: "rgba(92,122,94,0.4)",

    accent: {
      sage: "#5C7A5E",
      sageDark: "#4A6350",
      sageLight: "rgba(92,122,94,0.1)",
      amber: "#8B6F47",
      amberDark: "#6D5538",
      amberLight: "rgba(139,111,71,0.1)",
      gold: "#C6963A",
      red: "#B85450",
      redLight: "rgba(184,84,80,0.08)",
    },

    admin: {
      inputBg: "#FFFFFF",
      tableHeader: "#F5F2EC",
      teal: "#5C7A5E",
      tealDark: "#4A6350",
      gold: "#8B6F47",
      sidebar: "#F5F2EC",
    },
  },

  fonts: {
    heading: "'Playfair Display', 'Georgia', serif",
    body:    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    mono:    "'JetBrains Mono', 'Fira Code', monospace",
  },

  fontSizes: {
    xs: "0.72rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    display: "clamp(2.4rem, 5vw, 3.6rem)",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
    "4xl": "80px",
  },

  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },

  shadows: {
    card: "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
    soft: "0 2px 12px rgba(44,44,44,0.07)",
    medium: "0 4px 24px rgba(44,44,44,0.1)",
    hover: "0 8px 32px rgba(44,44,44,0.12)",
    book: "4px 8px 24px rgba(0,0,0,0.12)",
    navbar: "0 1px 0 rgba(0,0,0,0.06)",
    button: "0 1px 3px rgba(92,122,94,0.25)",
  },

  transitions: {
    default: "all 0.18s ease",
    slow: "all 0.3s ease",
    fast: "all 0.12s ease",
  },
};

export default theme;
