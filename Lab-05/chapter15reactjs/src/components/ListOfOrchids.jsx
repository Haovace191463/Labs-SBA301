import { useState } from 'react'
import { Link } from 'react-router-dom'

const fallbackImage = 'https://images.unsplash.com/photo-1566958769312-82cef41d19ef?auto=format&fit=crop&w=900&q=85'

export default function ListOfOrchids({ orchids, onView, onEdit, onDelete }) {
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'

  if (orchids.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon" aria-hidden="true">✿</span>
        <h2>Chưa tìm thấy hoa lan</h2>
        <p>Thử thay đổi từ khóa tìm kiếm hoặc thêm một cây lan mới vào bộ sưu tập.</p>
      </div>
    )
  }

  return (
    <div className="orchid-list-container">
      <div className="view-mode-bar">
        <span className="view-mode-label">Hiển thị {orchids.length} cây lan</span>
        <div className="view-toggle">
          <button
            type="button"
            className={`toggle-btn ${viewMode === 'table' ? 'is-active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Chế độ xem bảng (Chuẩn Lab 05)"
          >
            📋 Bảng (Table)
          </button>
          <button
            type="button"
            className={`toggle-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Chế độ xem thẻ (Grid cards)"
          >
            🎴 Thẻ (Cards)
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="table-responsive">
          <table className="orchid-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hình ảnh</th>
                <th>Tên hoa lan</th>
                <th>Danh mục</th>
                <th>Tự nhiên (Natural)</th>
                <th>Thu hút (Attractive)</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orchids.map((orchid) => {
                const isNatural = orchid.isNatural ?? orchid.natural
                const isAttractive = orchid.isAttractive ?? orchid.attractive
                const imageUrl = orchid.orchidURL || orchid.orchidUrl || fallbackImage

                return (
                  <tr key={orchid.orchidId}>
                    <td className="col-id">#{orchid.orchidId}</td>
                    <td className="col-thumb">
                      <img
                        src={imageUrl}
                        alt={orchid.orchidName}
                        className="table-thumb"
                        onError={(e) => { e.currentTarget.src = fallbackImage }}
                        loading="lazy"
                      />
                    </td>
                    <td className="col-name">
                      <button
                        type="button"
                        className="link-button"
                        onClick={() => onView(orchid)}
                      >
                        <strong>{orchid.orchidName}</strong>
                      </button>
                    </td>
                    <td>
                      <span className="badge badge--category">
                        {orchid.orchidCategory || 'Chưa phân loại'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${isNatural ? 'badge--natural' : 'badge--hybrid'}`}>
                        {isNatural ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${isAttractive ? 'badge--attractive' : 'badge--neutral'}`}>
                        {isAttractive ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="col-actions">
                      <button
                        className="button button--small button--quiet"
                        type="button"
                        onClick={() => onView(orchid)}
                        title="Xem chi tiết"
                      >
                        Xem
                      </button>
                      <Link
                        className="button button--small button--edit"
                        to={`/orchids/${orchid.orchidId}/edit`}
                        title="Chỉnh sửa"
                      >
                        Sửa
                      </Link>
                      <button
                        className="button button--small button--danger"
                        type="button"
                        onClick={() => onDelete(orchid)}
                        title="Xóa"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="orchid-grid">
          {orchids.map((orchid) => {
            const isNatural = orchid.isNatural ?? orchid.natural
            const isAttractive = orchid.isAttractive ?? orchid.attractive
            const imageUrl = orchid.orchidURL || orchid.orchidUrl || fallbackImage

            return (
              <article className="orchid-card" key={orchid.orchidId}>
                <button
                  className="orchid-card__image-button"
                  type="button"
                  onClick={() => onView(orchid)}
                  aria-label={`Xem chi tiết ${orchid.orchidName}`}
                >
                  <img
                    className="orchid-card__image"
                    src={imageUrl}
                    alt={orchid.orchidName}
                    onError={(e) => { e.currentTarget.src = fallbackImage }}
                    loading="lazy"
                  />
                  <div className="badge-group">
                    <span className="orchid-card__badge">
                      {isNatural ? 'Tự nhiên' : 'Lai tạo'}
                    </span>
                    {isAttractive && (
                      <span className="orchid-card__badge orchid-card__badge--star">
                        ★ Bắt mắt
                      </span>
                    )}
                  </div>
                </button>
                <div className="orchid-card__content">
                  <div className="orchid-card__category">
                    {orchid.orchidCategory || 'Hoa lan'} · #{orchid.orchidId}
                  </div>
                  <button className="orchid-card__title" type="button" onClick={() => onView(orchid)}>
                    {orchid.orchidName}
                  </button>
                  <p className="orchid-card__description">
                    {orchid.orchidDescription || 'Một vẻ đẹp tinh tế trong bộ sưu tập của bạn.'}
                  </p>
                  <div className="orchid-card__footer">
                    <span className="orchid-card__tag">
                      {isAttractive ? 'Thu hút: Có' : 'Thu hút: Không'}
                    </span>
                    <div className="icon-actions">
                      <Link
                        className="icon-button"
                        to={`/orchids/${orchid.orchidId}/edit`}
                        aria-label={`Sửa ${orchid.orchidName}`}
                        title="Chỉnh sửa"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m16.9 4.1 3 3M4 20l4.2-.9L20 7.3a2.1 2.1 0 0 0-3-3L5.2 16.1 4 20Z" /></svg>
                      </Link>
                      <button
                        className="icon-button icon-button--danger"
                        type="button"
                        onClick={() => onDelete(orchid)}
                        aria-label={`Xóa ${orchid.orchidName}`}
                        title="Xóa"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M5.5 7l1 13h11l1-13M9 7V4h6v3" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
