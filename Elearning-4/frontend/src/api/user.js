import axiosInstance from './axiosInstance'

export const userAPI = {
  getAll: (params = {}) => {
    return axiosInstance.get('/admin/users', { params })
  },

  getById: (id) => {
    return axiosInstance.get(`/admin/users/${id}`)
  },

  // ĐÃ XÓA getStats() vì không có route này trên backend
  update: (id, data) => {
    return axiosInstance.put(`/admin/users/${id}`, data)
  },

  delete: (id) => {
    return axiosInstance.delete(`/admin/users/${id}`)
  },

  toggleActive: (id, isActive) => {
    return axiosInstance.patch(`/admin/users/${id}/active`, { is_active: isActive })
  },

  changeRole: (id, role) => {
    return axiosInstance.patch(`/admin/users/${id}/role`, { role })
  }
}