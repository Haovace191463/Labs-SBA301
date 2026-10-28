const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

export default function ListOfOrchids({ orchids, onView, onEdit, onDelete }) {
  if (orchids.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon" aria-hidden="true">✿</span>
        <h2>Chưa tìm thấy hoa lan</h2>
        <p>Thử thay đổi từ khóa hoặc thêm một cây lan mới vào bộ sưu tập.</p>
      </div>
    )
  }

  return (
    <div className="orchid-grid">
      {orchids.map((orchid) => (
        <article className="orchid-card" key={orchid.orchidId}>
          <button
            className="orchid-card__image-button"
            type="button"
            onClick={() => onView(orchid)}
            aria-label={`Xem chi tiết ${orchid.orchidName}`}
          >
            <img
              className="orchid-card__image"
              src={orchid.orchidUrl || 'https://images.unsplash.com/photo-1566958769312-82cef41d19ef?auto=format&fit=crop&w=900&q=85'}
              alt={orchid.orchidName}
              loading="lazy"
            />
            <span className="orchid-card__badge">
              {orchid.isNatural ? 'Tự nhiên' : 'Lai tạo'}
            </span>
          </button>
          <div className="orchid-card__content">
            <div className="orchid-card__category">{orchid.categoryName}</div>
            <button className="orchid-card__title" type="button" onClick={() => onView(orchid)}>
              {orchid.orchidName}
            </button>
            <p className="orchid-card__description">
              {orchid.orchidDescription || 'Một vẻ đẹp tinh tế trong bộ sưu tập của bạn.'}
            </p>
            <div className="orchid-card__footer">
              <strong>{money.format(orchid.price)}</strong>
              <div className="icon-actions">
                <button className="icon-button" type="button" onClick={() => onEdit(orchid)} aria-label={`Sửa ${orchid.orchidName}`} title="Chỉnh sửa">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m16.9 4.1 3 3M4 20l4.2-.9L20 7.3a2.1 2.1 0 0 0-3-3L5.2 16.1 4 20Z" /></svg>
                </button>
                <button className="icon-button icon-button--danger" type="button" onClick={() => onDelete(orchid)} aria-label={`Xóa ${orchid.orchidName}`} title="Xóa">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M5.5 7l1 13h11l1-13M9 7V4h6v3" /></svg>
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
