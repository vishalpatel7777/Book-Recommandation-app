import React from "react";

const Loader = ({ size = 28 }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: size * 2 }}>
    <div
      style={{
        width: size,
        height: size,
        border: `2px solid var(--border)`,
        borderTop: `2px solid var(--accent-sage)`,
        borderRadius: "50%",
        animation: "spin 0.75s linear infinite",
      }}
    />
  </div>
);

export default Loader;
