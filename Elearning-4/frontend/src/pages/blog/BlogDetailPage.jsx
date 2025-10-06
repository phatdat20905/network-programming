import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { blogAPI } from '../../api'
import { BlogDetail } from '../../components/blog'
import { LoadingSpinner, Modal, Button } from '../../components/ui'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const BlogDetailPage = () => {
  const { id, slug } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadBlog()
  }, [id, slug])

  const loadBlog = async () => {
    try {
      setLoading(true)
      setError('')
      
      let response
      if (slug) {
        response = await blogAPI.getBySlug(slug)
      } else {
        response = await blogAPI.getById(id)
      }
      
      setBlog(response.data)
    } catch (error) {
      setError('Blog not found')
      console.error('Error loading blog:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    navigate(`/blogs/edit/${blog.id}`)
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await blogAPI.delete(blog.id)
      toast.success('Blog deleted successfully')
      navigate('/blogs')
    } catch (error) {
      toast.error('Failed to delete blog')
      console.error('Error deleting blog:', error)
    } finally {
      setDeleting(false)
      setDeleteModalOpen(false)
    }
  }

  const canModify = user && (user.id === blog?.author?.id || isAdmin)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="large" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <Link to="/blogs" className="text-primary-600 hover:text-primary-700">
            Back to Blogs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/blogs"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Blogs
          </Link>
        </div>

        {/* Blog Content */}
        <BlogDetail
          blog={blog}
          onEdit={canModify ? handleEdit : undefined}
          onDelete={canModify ? () => setDeleteModalOpen(true) : undefined}
          loading={loading}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Blog"
          size="small"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete this blog? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                loading={deleting}
                onClick={handleDelete}
              >
                Delete Blog
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default BlogDetailPage