import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { blogAPI } from '../../api'
import { BlogForm } from '../../components/blog'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const BlogCreatePage = () => {
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const handleSubmit = async (formData) => {
    try {
      setLoading(true)
      
      const submitData = new FormData()
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          formData.tags.forEach(tag => {
            submitData.append('tags[]', tag)
          })
        } else {
          submitData.append(key, formData[key])
        }
      })

      await blogAPI.create(submitData)
      toast.success('Blog created successfully!')
      navigate('/blogs')
    } catch (error) {
      toast.error('Failed to create blog')
      console.error('Error creating blog:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Write New Blog</h1>
            <p className="text-gray-600 mt-1">
              Share your thoughts and stories with the world
            </p>
          </div>

          <BlogForm
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}

export default BlogCreatePage