import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

let isRefreshing = false
let failedQueue = []
let requestCount = 0
let lastResetTime = Date.now()
const MAX_REQUESTS_PER_MINUTE = 60

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Thêm rate limiting
axiosInstance.interceptors.request.use(
  (config) => {
    // Reset counter mỗi phút
    const now = Date.now()
    if (now - lastResetTime > 60000) {
      requestCount = 0
      lastResetTime = now
    }

    // Kiểm tra rate limiting
    if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
      console.warn('Rate limit exceeded, delaying request')
      return new Promise((resolve) => {
        setTimeout(() => {
          requestCount++
          resolve(config)
        }, 1000)
      })
    }

    requestCount++

    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Xử lý lỗi tốt hơn
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data
  },
  async (error) => {
    const originalRequest = error.config

    // Xử lý rate limiting (429)
    if (error.response?.status === 429) {
      console.warn('Rate limited by server, waiting 5 seconds...')
      
      // Đợi 5 giây và không retry tự động
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(error)
        }, 5000)
      })
    }

    // Xử lý authentication (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axiosInstance(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')
      
      if (!refreshToken) {
        logoutUser()
        return Promise.reject(error)
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        )

        const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens

        localStorage.setItem('accessToken', accessToken)
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken)
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        processQueue(null, accessToken)

        return axiosInstance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        logoutUser()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    if (error.response?.status === 403) {
      console.warn('Access forbidden')
      // Không logout tự động, chỉ reject error
    }

    return Promise.reject(error.response?.data || error)
  }
)

const logoutUser = () => {
  const refreshToken = localStorage.getItem('refreshToken')
  
  if (refreshToken) {
    axiosInstance.post('/auth/logout', { refreshToken })
      .catch(() => {})
  }

  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')

  if (window.location.pathname !== '/login') {
    window.location.href = '/login?reason=session_expired'
  }
}

// Auto refresh token (giữ nguyên)
const setupTokenRefresh = () => {
  const checkTokenExpiry = () => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return

    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]))
      const expiresAt = payload.exp * 1000
      const now = Date.now()
      const timeUntilExpiry = expiresAt - now

      if (timeUntilExpiry < 5 * 60 * 1000) {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          axiosInstance.post('/auth/refresh-token', { refreshToken })
            .then(response => {
              const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens
              localStorage.setItem('accessToken', accessToken)
              if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken)
              }
              console.log('Token auto-refreshed successfully')
            })
            .catch(error => {
              console.error('Auto token refresh failed:', error)
            })
        }
      }
    } catch (error) {
      console.error('Token expiry check failed:', error)
    }
  }

  setInterval(checkTokenExpiry, 60 * 1000)
}

setupTokenRefresh()

export default axiosInstance