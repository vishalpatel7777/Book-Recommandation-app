import React, { useState } from "react";
import { Upload, ImageIcon } from "lucide-react";

const ImageUpload = ({ onImageSelect }) => {
  const [imagePreview, setImagePreview] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 30 * 1024 * 1024) {
      alert("Image size exceeds 30MB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      onImageSelect(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-3)" }}>
      {imagePreview ? (
        <div style={{ position: "relative" }}>
          <img
            src={imagePreview}
            alt="Profile Preview"
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border-medium)" }}
          />
          <div
            style={{
              position: "absolute", bottom: -4, right: -4,
              width: 24, height: 24, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--accent-sage)", border: "2px solid var(--bg-page)",
            }}
          >
            <label style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
              <Upload size={10} style={{ color: "#fff" }} />
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            </label>
          </div>
        </div>
      ) : (
        <label
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-2)",
            padding: "var(--space-5) var(--space-6)", borderRadius: "var(--radius-sm)", cursor: "pointer",
            background: "var(--bg-surface)", border: "1px dashed var(--border)",
            transition: "border-color 0.15s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-sage)"}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
        >
          <div style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent-sage-bg)", border: "1px solid var(--accent-sage-mid)" }}>
            <ImageIcon size={18} style={{ color: "var(--accent-sage)" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)" }}>Upload profile photo</p>
            <p style={{ fontSize: "var(--text-xs)", marginTop: "2px", color: "var(--text-muted)" }}>PNG, JPG up to 30MB</p>
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
        </label>
      )}
    </div>
  );
};

export default ImageUpload;
