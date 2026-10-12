import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createOrchid, getOrchid, getOrchids, updateOrchid } from '../api/orchidApi.js'
import { getApiErrorMessage } from '../api/httpClient.js'

const emptyForm = {
  orchidName: '',
  orchidCategory: '',
  isNatural: true,
  isAttractive: true,
  orchidURL: '',
  orchidDescription: '',
}

export default function EditOrchid({ createMode = false, onSaved }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const isCreate = createMode || !id

  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(!isCreate)
  const [saving, setSaving] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [apiError, setApiError] = useState('')

  // Load existing categories for autocomplete datalist
  useEffect(() => {
    let isMounted = true
    getOrchids()
      .then((data) => {
        if (!isMounted || !Array.isArray(data)) return
        const set = new Set()
        data.forEach((o) => {
          if (o.orchidCategory && o.orchidCategory.trim()) {
            set.add(o.orchidCategory.trim())
          }
        })
        setCategories(Array.from(set).sort())
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  // If in edit mode, load orchid by ID
  useEffect(() => {
    if (isCreate) {
      setForm(emptyForm)
      setLoading(false)
      setApiError('')
      return
    }

    const numericId = Number(id)
    if (!id || isNaN(numericId) || numericId <= 0) {
      setApiError(`Mã hoa lan không hợp lệ: "${id}".`)
      setLoading(false)
      return
    }

    setLoading(true)
    setApiError('')
    let isMounted = true

    getOrchid(numericId)
      .then((data) => {
        if (!isMounted) return
        setForm({
          orchidName: data.orchidName || '',
          orchidCategory: data.orchidCategory || '',
          isNatural: data.isNatural ?? data.natural ?? true,
          isAttractive: data.isAttractive ?? data.attractive ?? true,
          orchidURL: data.orchidURL || data.orchidUrl || '',
          orchidDescription: data.orchidDescription || '',
        })
      })
      .catch((err) => {
        if (!isMounted) return
        if (err?.response?.status === 404) {
          setApiError(`Không tìm thấy hoa lan với ID #${id} trên máy chủ.`)
        } else {
          setApiError(getApiErrorMessage(err))
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id, isCreate])

  function change(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function submit(event) {
    event.preventDefault()
    if (!form.orchidName.trim()) {
      setValidationError('Vui lòng nhập tên hoa lan.')
      return
    }

    setValidationError('')
    setApiError('')
    setSaving(true)

    const payload = {
      orchidName: form.orchidName.trim(),
      isNatural: Boolean(form.isNatural),
      orchidDescription: form.orchidDescription ? form.orchidDescription.trim() : '',
      orchidCategory: form.orchidCategory ? form.orchidCategory.trim() : '',
      isAttractive: Boolean(form.isAttractive),
      orchidURL: form.orchidURL ? form.orchidURL.trim() : '',
    }

    try {
      if (isCreate) {
        await createOrchid(payload)
      } else {
        await updateOrchid(Number(id), payload)
      }
      if (onSaved) onSaved()
      navigate('/')
    } catch (err) {
      setApiError(getApiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="form-page-container">
      <Link to="/" className="back-link">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        Quay lại danh sách hoa lan
      </Link>

      <section className="form-card" aria-labelledby="form-title">
        <div className="dialog__header">
          <div>
            <div className="eyebrow">BỘ SƯU TẬP HOA LAN</div>
            <h2 id="form-title">{isCreate ? 'Thêm hoa lan mới' : `Chỉnh sửa hoa lan #${id}`}</h2>
          </div>
        </div>

        {loading ? (
          <div className="loading-state" role="status">
            <span className="spinner" /> Đang tải thông tin hoa lan...
          </div>
        ) : (
          <form className="orchid-form" onSubmit={submit}>
            {validationError && <div className="inline-error" role="alert">{validationError}</div>}
            {apiError && <div className="inline-error" role="alert">{apiError}</div>}

            <label>
              Tên hoa lan <span>*</span>
              <input
                name="orchidName"
                value={form.orchidName}
                onChange={change}
                maxLength={100}
                required
                placeholder="Ví dụ: Taichung Beauty"
                disabled={Boolean(apiError && !isCreate)}
              />
            </label>

            <label>
              Danh mục hoa lan
              <input
                name="orchidCategory"
                value={form.orchidCategory}
                onChange={change}
                maxLength={100}
                list="category-options"
                placeholder="Ví dụ: Cattleya, Phalaenopsis, Dendrobium..."
                disabled={Boolean(apiError && !isCreate)}
              />
              <datalist id="category-options">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </label>

            <label>
              Đường dẫn hình ảnh (URL)
              <input
                name="orchidURL"
                type="url"
                maxLength={500}
                value={form.orchidURL}
                onChange={change}
                placeholder="https://example.com/orchid.jpg"
                disabled={Boolean(apiError && !isCreate)}
              />
            </label>

            <label>
              Mô tả
              <textarea
                name="orchidDescription"
                rows={3}
                maxLength={500}
                value={form.orchidDescription}
                onChange={change}
                placeholder="Mô tả đặc điểm của cây..."
                disabled={Boolean(apiError && !isCreate)}
              />
            </label>

            <div className="form-row">
              <label className="checkbox-label">
                <input
                  name="isNatural"
                  type="checkbox"
                  checked={form.isNatural}
                  onChange={change}
                  disabled={Boolean(apiError && !isCreate)}
                />
                <span>Lan tự nhiên (Natural)</span>
              </label>

              <label className="checkbox-label">
                <input
                  name="isAttractive"
                  type="checkbox"
                  checked={form.isAttractive}
                  onChange={change}
                  disabled={Boolean(apiError && !isCreate)}
                />
                <span>Thu hút / Bắt mắt (Attractive)</span>
              </label>
            </div>

            <div className="dialog__actions">
              <button
                className="button button--quiet"
                type="button"
                onClick={() => navigate('/')}
              >
                Hủy
              </button>
              <button
                className="button button--primary"
                type="submit"
                disabled={saving || Boolean(apiError && !isCreate)}
              >
                {saving ? 'Đang lưu...' : isCreate ? 'Thêm vào bộ sưu tập' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
