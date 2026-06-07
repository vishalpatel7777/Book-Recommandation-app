import React from "react";
import { Link } from "react-router-dom";

const EmptyState = ({ icon, title, description, actionLabel, actionPath, onAction }) => (
  <div className="empty-state">
    {icon && (
      <div className="empty-state-icon">
        {icon}
      </div>
    )}
    {title && <h2>{title}</h2>}
    {description && <p>{description}</p>}
    {actionLabel && actionPath && (
      <Link to={actionPath} style={{ textDecoration: "none" }}>
        <button className="btn btn-secondary" style={{ marginTop: "var(--space-2)" }}>{actionLabel}</button>
      </Link>
    )}
    {actionLabel && onAction && !actionPath && (
      <button onClick={onAction} className="btn btn-secondary" style={{ marginTop: "var(--space-2)" }}>{actionLabel}</button>
    )}
  </div>
);

export default EmptyState;
