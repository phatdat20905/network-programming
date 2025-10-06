import axiosInstance from './axiosInstance'

export const tagAPI = {
  getAll: (params = {}) => {
    return axiosInstance.get('/tags', { params })
  },

  getById: (id) => {
    return axiosInstance.get(`/tags/${id}`)
  },

  getBySlug: (slug) => {
    return axiosInstance.get(`/tags/slug/${slug}`)
  },

  create: (data) => {
    return axiosInstance.post('/tags', data)
  },

  update: (id, data) => {
    return axiosInstance.put(`/tags/${id}`, data)
  },

  delete: (id) => {
    return axiosInstance.delete(`/tags/${id}`)
  },

  addToBlog: (blogId, tags) => {
    return axiosInstance.post(`/tags/blog/${blogId}`, { tags })
  },

  removeFromBlog: (blogId, tagId) => {
    return axiosInstance.delete(`/tags/blog/${blogId}/${tagId}`)
  }
}