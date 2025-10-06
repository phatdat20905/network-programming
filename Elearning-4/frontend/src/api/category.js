import axiosInstance from './axiosInstance'

export const categoryAPI = {
  getAll: (params = {}) => {
    return axiosInstance.get('/categories', { params })
  },

  getById: (id) => {
    return axiosInstance.get(`/categories/${id}`)
  },

  create: (data) => {
    return axiosInstance.post('/categories', data)
  },

  update: (id, data) => {
    return axiosInstance.put(`/categories/${id}`, data)
  },

  delete: (id) => {
    return axiosInstance.delete(`/categories/${id}`)
  }
}