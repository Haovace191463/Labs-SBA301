export default function PageHeader({ title, subtitle, badgeText, children }) {
  return (
    <div className="py-4 mb-4 border-bottom">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h1 className="h2 fw-bold text-dark mb-0">{title}</h1>
            {badgeText && (
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1 small">
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && <p className="text-muted mb-0 lead fs-6">{subtitle}</p>}
        </div>
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}
