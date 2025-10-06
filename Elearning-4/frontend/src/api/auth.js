import axiosInstance from './axiosInstance'

export const authAPI = {
  register: (userData) => {
    return axiosInstance.post('/auth/register', userData)
  },

  login: (credentials) => {
    return axiosInstance.post('/auth/login', credentials)
  },

  refreshToken: (refreshToken) => {
    return axiosInstance.post('/auth/refresh-token', { refreshToken })
  },

  logout: (refreshToken) => {
    return axiosInstance.post('/auth/logout', { refreshToken })
  },

  logoutAll: () => {
    return axiosInstance.post('/auth/logout-all')
  },

  getMe: () => {
    return axiosInstance.get('/auth/me')
  },

  getMyTokens: () => {
    return axiosInstance.get('/auth/tokens')
  },

  revokeToken: (token) => {
    return axiosInstance.post('/auth/revoke-token', { token })
  }
}