import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import EditOrchid from './components/EditOrchid.jsx'
import ListOfOrchids from './components/ListOfOrchids.jsx'
import { deleteOrchid, getOrchid, getOrchids } from './api/orchidApi.js'
import { getApiErrorMessage } from './api/httpClient.js'

const fallbackImage = 'https://images.unsplash.com/photo-1566958769312-82cef41d19ef?auto=format&fit=crop&w=1000&q=85'

function NotFoundView() {
  return (
    <div className="collection" style={{ textAlign: 'center', padding: '90px 20px' }}>
      <div className="empty-state">
        <span className="empty-state__icon" aria-hidden="true">✿</span>
        <h2>404 — Không tìm thấy trang</h2>
        <p>Đường dẫn bạn yêu cầu không tồn tại hoặc đã bị di chuyển.</p>
        <Link to="/" className="button button--primary" style={{ marginTop: '20px' }}>
          Quay lại danh sách hoa lan
        </Link>
      </div>
    </div>
  )
}

export default function App() {
  const [orchids, setOrchids] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedOrchid, setSelectedOrchid] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const orchidData = await getOrchids()
      setOrchids(Array.isArray(orchidData) ? orchidData : [])
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Derive unique category names dynamically from existing orchid data
  const existingCategories = useMemo(() => {
    const cats = new Set()
    orchids.forEach((o) => {
      if (o.orchidCategory && o.orchidCategory.trim()) {
        cats.add(o.orchidCategory.trim())
      }
    })
    return Array.from(cats).sort()
  }, [orchids])

  // Real-time filtering by category and search query
  const visibleOrchids = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('vi')
    return orchids.filter((orchid) => {
      const category = orchid.orchidCategory || ''
      const matchesCategory =
        activeCategory === 'all' || category.trim().toLowerCase() === activeCategory.toLowerCase()

      const matchesQuery =
        !normalizedQuery ||
        `${orchid.orchidName || ''} ${category} ${orchid.orchidDescription || ''}`
          .toLocaleLowerCase('vi')
          .includes(normalizedQuery)

      return matchesCategory && matchesQuery
    })
  }, [orchids, query, activeCategory])

  async function removeOrchid(orchid) {
    if (!window.confirm(`Bạn có chắc muốn xóa "${orchid.orchidName}" (ID: ${orchid.orchidId}) khỏi bộ sưu tập?`)) {
      return
    }
    setError('')
    try {
      await deleteOrchid(orchid.orchidId)
      setOrchids((current) => current.filter((item) => item.orchidId !== orchid.orchidId))
      if (selectedOrchid?.orchidId === orchid.orchidId) setSelectedOrchid(null)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    }
  }

  async function viewOrchid(orchid) {
    setSelectedOrchid(orchid)
    try {
      const freshData = await getOrchid(orchid.orchidId)
      setSelectedOrchid(freshData)
    } catch (requestError) {
      if (requestError?.response?.status === 404) {
        setSelectedOrchid(null)
        setError('Hoa lan này không còn tồn tại trên máy chủ. Danh sách đã được cập nhật.')
        loadData()
      } else {
        setError(getApiErrorMessage(requestError))
      }
    }
  }

  const naturalCount = orchids.filter((orchid) => orchid.isNatural ?? orchid.natural).length
  const attractiveCount = orchids.filter((orchid) => orchid.isAttractive ?? orchid.attractive).length

  return (
    <div className="app-shell">
      <NavBar />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <section className="hero">
                  <div className="hero__copy">
                    <div className="eyebrow"><span /> SBA301 LAB 05 · FULL-STACK SPA</div>
                    <h1>Quản lý hoa lan<br /><em>Orchid_Mgnt_V5</em></h1>
                    <p>Ứng dụng Single Page Application tích hợp Spring Boot RESTful API và Microsoft SQL Server.</p>
                    <Link className="button button--primary hero__button" to="/orchids/new">
                      <span aria-hidden="true">＋</span> Thêm hoa lan mới
                    </Link>
                  </div>
                  <div className="hero__art" role="img" aria-label="Orchid Illustration" />
                  <div className="hero__note"><span>V5</span> SPRING BOOT 4 + REACT 19 + VITE 8</div>
                </section>

                <section className="collection">
                  <div className="collection__heading">
                    <div>
                      <div className="eyebrow">DỮ LIỆU TỪ SQL SERVER</div>
                      <h2>Danh sách <span>hoa lan</span></h2>
                    </div>
                    <div className="collection-stats">
                      <div><strong>{orchids.length.toString().padStart(2, '0')}</strong><span>Tổng số cây</span></div>
                      <div><strong>{naturalCount.toString().padStart(2, '0')}</strong><span>Tự nhiên (Natural)</span></div>
                      <div><strong>{attractiveCount.toString().padStart(2, '0')}</strong><span>Thu hút (Attractive)</span></div>
                    </div>
                  </div>

                  <div className="toolbar">
                    <div className="category-tabs" aria-label="Lọc theo danh mục">
                      <button
                        className={activeCategory === 'all' ? 'category-tab is-active' : 'category-tab'}
                        onClick={() => setActiveCategory('all')}
                      >
                        Tất cả <span>{orchids.length}</span>
                      </button>
                      {existingCategories.map((category) => (
                        <button
                          key={category}
                          className={activeCategory === category ? 'category-tab is-active' : 'category-tab'}
                          onClick={() => setActiveCategory(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>

                    <label className="search">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>
                      <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Tìm theo tên, danh mục, mô tả..."
                        aria-label="Tìm hoa lan"
                      />
                      {query && <button type="button" onClick={() => setQuery('')} aria-label="Xóa tìm kiếm">×</button>}
                    </label>
                  </div>

                  {error && (
                    <div className="error-banner" role="alert">
                      <span>{error}</span>
                      <button className="button button--quiet" onClick={loadData}>Thử lại</button>
                      <button className="error-banner__close" onClick={() => setError('')} aria-label="Đóng thông báo">×</button>
                    </div>
                  )}

                  {loading ? (
                    <div className="loading-state" role="status"><span className="spinner" /> Đang tải danh sách hoa lan...</div>
                  ) : (
                    <ListOfOrchids
                      orchids={visibleOrchids}
                      onView={viewOrchid}
                      onDelete={removeOrchid}
                    />
                  )}
                </section>
              </>
            }
          />

          <Route
            path="/orchids/new"
            element={<EditOrchid createMode={true} onSaved={loadData} />}
          />

          <Route
            path="/orchids/:id/edit"
            element={<EditOrchid createMode={false} onSaved={loadData} />}
          />

          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </main>

      <footer className="footer">
        <Link className="brand brand--footer" to="/">
          <span className="brand__mark">✿</span>
          <span>Orchid_Mgnt_<span className="brand__light">V5</span></span>
        </Link>
        <span>SBA301 Lab 05 · Single Page Application Architecture</span>
        <span className="footer__status"><i /> RESTful API Ready</span>
      </footer>

      {selectedOrchid && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelectedOrchid(null)}>
          <section className="dialog detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title">
            <button className="icon-button detail-dialog__close" onClick={() => setSelectedOrchid(null)} aria-label="Đóng">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
            <img
              src={selectedOrchid.orchidURL || selectedOrchid.orchidUrl || fallbackImage}
              alt={selectedOrchid.orchidName}
              onError={(e) => { e.currentTarget.src = fallbackImage }}
            />
            <div className="detail-dialog__content">
              <div className="eyebrow">
                ID #{selectedOrchid.orchidId} · {selectedOrchid.orchidCategory || 'Chưa phân loại'}
              </div>
              <h2 id="detail-title">{selectedOrchid.orchidName}</h2>
              <div className="badge-row">
                <span className={`badge ${(selectedOrchid.isNatural ?? selectedOrchid.natural) ? 'badge--natural' : 'badge--hybrid'}`}>
                  {(selectedOrchid.isNatural ?? selectedOrchid.natural) ? 'Tự nhiên (Natural: Yes)' : 'Lai tạo (Natural: No)'}
                </span>
                <span className={`badge ${(selectedOrchid.isAttractive ?? selectedOrchid.attractive) ? 'badge--attractive' : 'badge--neutral'}`}>
                  {(selectedOrchid.isAttractive ?? selectedOrchid.attractive) ? 'Thu hút (Attractive: Yes)' : 'Bình thường (Attractive: No)'}
                </span>
              </div>
              <p>{selectedOrchid.orchidDescription || 'Không có mô tả chi tiết cho giống lan này.'}</p>
              <div className="dialog__actions">
                <Link
                  className="button button--primary"
                  to={`/orchids/${selectedOrchid.orchidId}/edit`}
                  onClick={() => setSelectedOrchid(null)}
                >
                  Chỉnh sửa thông tin
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
