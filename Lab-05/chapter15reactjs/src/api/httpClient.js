import axios from 'axios'

const configuredUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8080/orchids'

const cleanUrl = configuredUrl.replace(/\/+$/, '')
const normalizedBaseUrl = cleanUrl.endsWith('/orchids') ? cleanUrl : `${cleanUrl}/orchids`

export const http = axios.create({
  baseURL: normalizedBaseUrl,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export function getApiErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) return error.response.data.message
    if (error.code === 'ECONNABORTED') {
      return 'Máy chủ phản hồi quá lâu. Vui lòng thử lại.'
    }
    if (error.response) {
      return `Yêu cầu thất bại (HTTP ${error.response.status}). Vui lòng thử lại.`
    }
    return 'Không thể kết nối máy chủ. Hãy kiểm tra backend và địa chỉ API.'
  }

  return 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.'
}
