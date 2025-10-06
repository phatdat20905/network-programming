import axiosInstance from './axiosInstance'

export const blogAPI = {
  getAll: (params = {}) => {
    return axiosInstance.get('/blogs', { params })
  },

  getById: (id) => {
    return axiosInstance.get(`/blogs/${id}`)
  },

  getBySlug: (slug) => {
    return axiosInstance.get(`/blogs/slug/${slug}`)
  },

  create: (formData) => {
    return axiosInstance.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  update: (id, formData) => {
    return axiosInstance.put(`/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  delete: (id) => {
    return axiosInstance.delete(`/blogs/${id}`)
  },

  getMyBlogs: (params = {}) => {
    return axiosInstance.get('/blogs/user/my-blogs', { params })
  }
}