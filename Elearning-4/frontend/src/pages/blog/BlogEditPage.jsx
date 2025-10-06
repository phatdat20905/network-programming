import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { blogAPI } from '../../api'
import { BlogForm } from '../../components/blog'
import { LoadingSpinner } from '../../components/ui'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const BlogEditPage = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadBlog()
  }, [id])

  const loadBlog = async () => {
    try {
      setLoading(true)
      const response = await blogAPI.getById(id)
      const blogData = response.data
      
      // Check if user can edit this blog
      if (user.id !== blogData.author?.id && !isAdmin) {
        toast.error('You are not authorized to edit this blog')
        navigate('/blogs')
        return
      }
      
      setBlog(blogData)
    } catch (error) {
      toast.error('Blog not found')
      navigate('/blogs')
      console.error('Error loading blog:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      setUpdating(true)
      
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

      await blogAPI.update(id, submitData)
      toast.success('Blog updated successfully!')
      navigate(`/blogs/${id}`)
    } catch (error) {
      toast.error('Failed to update blog')
      console.error('Error updating blog:', error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="large" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Blog</h1>
            <p className="text-gray-600 mt-1">
              Update your blog content and settings
            </p>
          </div>

          <BlogForm
            initialData={blog}
            onSubmit={handleSubmit}
            loading={updating}
          />
        </div>
      </div>
    </div>
  )
}

export default BlogEditPage