import axiosInstance from './axiosInstance'

export const uploadAPI = {
  uploadImage: (formData) => {
    return axiosInstance.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  uploadMultipleImages: (formData) => {
    return axiosInstance.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}