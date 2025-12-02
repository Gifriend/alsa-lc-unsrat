import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Hanya akses localStorage jika di browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ✅ Response interceptor: Redirect hanya di client
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Hanya tangani 401 di sisi klien
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined'
    ) {
      localStorage.removeItem('admin_token')
      // Gunakan `window.location.assign` (lebih aman daripada assignment langsung)
      window.location.assign('/admin/login')
    }
    return Promise.reject(error)
  },
)

export default apiClient