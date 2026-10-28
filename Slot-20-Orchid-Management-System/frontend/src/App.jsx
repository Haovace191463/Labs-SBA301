import { useCallback, useEffect, useMemo, useState } from 'react'
import EditOrchid from './components/EditOrchid.jsx'
import ListOfOrchids from './components/ListOfOrchids.jsx'
import { createOrchid, deleteOrchid, getCategories, getOrchid, getOrchids, updateOrchid } from './api/orchidApi.js'
import { getApiErrorMessage } from './api/httpClient.js'

export default function App() {
  const [orchids, setOrchids] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [editor, setEditor] = useState(null)
  const [selectedOrchid, setSelectedOrchid] = useState(null)
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [orchidData, categoryData] = await Promise.all([getOrchids(), getCategories()])
      setOrchids(orchidData)
      setCategories(categoryData)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const visibleOrchids = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('vi')
    return orchids.filter((orchid) => {
      const matchesCategory = activeCategory === 'all' || String(orchid.categoryId) === activeCategory
      const matchesQuery = !normalizedQuery || `${orchid.orchidName} ${orchid.categoryName} ${orchid.orchidDescription || ''}`.toLocaleLowerCase('vi').includes(normalizedQuery)
      return matchesCategory && matchesQuery
    })
  }, [orchids, query, activeCategory])

  async function saveOrchid(form) {
    setSaving(true)
    setError('')
    try {
      if (editor.orchid) {
        await updateOrchid(editor.orchid.orchidId, form)
      } else {
        await createOrchid(form)
      }
      setEditor(null)
      await loadData()
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setSaving(false)
    }
  }

  async function removeOrchid(orchid) {
    if (!window.confirm(`Bạn có chắc muốn xóa "${orchid.orchidName}" khỏi bộ sưu tập?`)) return
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
      setSelectedOrchid(await getOrchid(orchid.orchidId))
    } catch (requestError) {
      setSelectedOrchid(null)
      setError(requestError?.response?.status === 404
        ? 'Hoa lan này không còn tồn tại. Hãy tải lại danh sách để đồng bộ.'
        : getApiErrorMessage(requestError))
    }
  }

  const naturalCount = orchids.filter((orchid) => orchid.isNatural).length

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Orchid House trang chủ">
          <span className="brand__mark" aria-hidden="true">✿</span>
          <span>orchid<span className="brand__light">house</span></span>
        </a>
        <div className="topbar__right">
          <span className="connection-indicator"><i /> Bộ sưu tập của tôi</span>
          <span className="avatar" aria-label="Tài khoản">O</span>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero__copy">
            <div className="eyebrow"><span /> KHÔNG GIAN XANH CỦA BẠN</div>
            <h1>Vẻ đẹp nở rộ<br /><em>trong tầm tay.</em></h1>
            <p>Quản lý và lưu giữ những giống lan yêu thích trong bộ sưu tập riêng của bạn.</p>
            <button className="button button--primary hero__button" onClick={() => { setError(''); setEditor({ orchid: null }) }}>
              <span aria-hidden="true">＋</span> Thêm hoa lan
            </button>
          </div>
          <div className="hero__art" role="img" aria-label="Hoa lan trắng" />
          <div className="hero__note"><span>01</span> YOUR PRIVATE GARDEN</div>
        </section>

        <section className="collection">
          <div className="collection__heading">
            <div>
              <div className="eyebrow">TỪ KHU VƯỜN CỦA BẠN</div>
              <h2>Bộ sưu tập <span>hoa lan</span></h2>
            </div>
            <div className="collection-stats">
              <div><strong>{orchids.length.toString().padStart(2, '0')}</strong><span>Giống lan</span></div>
              <div><strong>{naturalCount.toString().padStart(2, '0')}</strong><span>Tự nhiên</span></div>
            </div>
          </div>

          <div className="toolbar">
            <div className="category-tabs" aria-label="Lọc theo danh mục">
              <button className={activeCategory === 'all' ? 'category-tab is-active' : 'category-tab'} onClick={() => setActiveCategory('all')}>Tất cả <span>{orchids.length}</span></button>
              {categories.map((category) => (
                <button key={category.categoryId} className={activeCategory === String(category.categoryId) ? 'category-tab is-active' : 'category-tab'} onClick={() => setActiveCategory(String(category.categoryId))}>{category.categoryName}</button>
              ))}
            </div>
            <label className="search">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm hoa lan..." aria-label="Tìm hoa lan" />
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
            <div className="loading-state" role="status"><span className="spinner" /> Đang tải bộ sưu tập...</div>
          ) : (
            <ListOfOrchids orchids={visibleOrchids} onView={viewOrchid} onEdit={(orchid) => { setError(''); setEditor({ orchid }) }} onDelete={removeOrchid} />
          )}
        </section>
      </main>

      <footer className="footer">
        <a className="brand brand--footer" href="/"><span className="brand__mark">✿</span><span>orchid<span className="brand__light">house</span></span></a>
        <span>Nuôi dưỡng vẻ đẹp, từng cánh hoa một.</span>
        <span className="footer__status"><i /> ĐÃ ĐỒNG BỘ</span>
      </footer>

      {editor && <EditOrchid orchid={editor.orchid} categories={categories} onClose={() => setEditor(null)} onSave={saveOrchid} saving={saving} apiError={error} />}
      {selectedOrchid && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelectedOrchid(null)}>
          <section className="dialog detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title">
            <button className="icon-button detail-dialog__close" onClick={() => setSelectedOrchid(null)} aria-label="Đóng">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </button>
            <img src={selectedOrchid.orchidUrl || 'https://images.unsplash.com/photo-1566958769312-82cef41d19ef?auto=format&fit=crop&w=1000&q=85'} alt={selectedOrchid.orchidName} />
            <div className="detail-dialog__content">
              <div className="eyebrow">{selectedOrchid.categoryName} · {selectedOrchid.isNatural ? 'TỰ NHIÊN' : 'LAI TẠO'}</div>
              <h2 id="detail-title">{selectedOrchid.orchidName}</h2>
              <p>{selectedOrchid.orchidDescription || 'Một vẻ đẹp tinh tế trong bộ sưu tập của bạn.'}</p>
              <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(selectedOrchid.price)}</strong>
              <button className="button button--primary" onClick={() => { setEditor({ orchid: selectedOrchid }); setSelectedOrchid(null) }}>Chỉnh sửa thông tin</button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
