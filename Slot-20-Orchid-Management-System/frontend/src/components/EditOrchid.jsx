import { useEffect, useState } from 'react'

const emptyForm = {
  orchidName: '',
  orchidDescription: '',
  orchidUrl: '',
  price: '',
  isNatural: true,
  categoryId: '',
}

export default function EditOrchid({ orchid, categories, onClose, onSave, saving, apiError }) {
  const [form, setForm] = useState(emptyForm)
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    if (orchid) {
      setForm({
        orchidName: orchid.orchidName,
        orchidDescription: orchid.orchidDescription || '',
        orchidUrl: orchid.orchidUrl || '',
        price: String(orchid.price),
        isNatural: orchid.isNatural,
        categoryId: String(orchid.categoryId),
      })
    } else {
      setForm({ ...emptyForm, categoryId: categories[0] ? String(categories[0].categoryId) : '' })
    }
    setValidationError('')
  }, [orchid, categories])

  function change(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function submit(event) {
    event.preventDefault()
    if (!form.categoryId) {
      setValidationError('Vui lòng chọn danh mục hoa lan.')
      return
    }
    const price = Number(form.price)
    if (!Number.isFinite(price) || price < 0.01) {
      setValidationError('Giá phải lớn hơn 0.')
      return
    }

    setValidationError('')
    await onSave({
      orchidName: form.orchidName.trim(),
      orchidDescription: form.orchidDescription.trim(),
      orchidUrl: form.orchidUrl.trim(),
      price,
      isNatural: form.isNatural,
      categoryId: Number(form.categoryId),
    })
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog form-dialog" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="dialog__header">
          <div>
            <div className="eyebrow">BỘ SƯU TẬP CỦA BẠN</div>
            <h2 id="form-title">{orchid ? 'Chỉnh sửa hoa lan' : 'Thêm hoa lan mới'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Đóng">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <form className="orchid-form" onSubmit={submit}>
          {validationError && <div className="inline-error" role="alert">{validationError}</div>}
          {apiError && <div className="inline-error" role="alert">{apiError}</div>}
          <label>
            Tên hoa lan <span>*</span>
            <input name="orchidName" value={form.orchidName} onChange={change} maxLength={120} required placeholder="Ví dụ: Hồ điệp trắng" />
          </label>
          <div className="form-row">
            <label>
              Danh mục <span>*</span>
              <select name="categoryId" value={form.categoryId} onChange={change} required>
                <option value="" disabled>Chọn danh mục</option>
                {categories.map((category) => <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>)}
              </select>
            </label>
            <label>
              Giá (VND) <span>*</span>
              <input name="price" type="number" min="0.01" step="1000" value={form.price} onChange={change} required placeholder="500000" />
            </label>
          </div>
          <label>
            Đường dẫn hình ảnh
            <input name="orchidUrl" type="url" maxLength={500} value={form.orchidUrl} onChange={change} placeholder="https://..." />
          </label>
          <label>
            Mô tả
            <textarea name="orchidDescription" rows="3" maxLength={1000} value={form.orchidDescription} onChange={change} placeholder="Mô tả đặc điểm của cây..." />
          </label>
          <label className="checkbox-label">
            <input name="isNatural" type="checkbox" checked={form.isNatural} onChange={change} />
            <span>Đây là giống lan tự nhiên</span>
          </label>
          <div className="dialog__actions">
            <button className="button button--quiet" type="button" onClick={onClose}>Hủy</button>
            <button className="button button--primary" type="submit" disabled={saving}>
              {saving ? 'Đang lưu...' : orchid ? 'Lưu thay đổi' : 'Thêm vào bộ sưu tập'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
