import React, { useState, useEffect } from 'react'
import { tagAPI } from '../../api'
import { Input, Button, Modal, Alert, Pagination } from '../ui'
import { Plus, Edit, Trash2, Tag, Search } from 'lucide-react'
import toast from 'react-hot-toast'

const TagManagement = () => {
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Modals
  const [createModal, setCreateModal] = useState({ open: false })
  const [editModal, setEditModal] = useState({ open: false, tag: null })
  const [deleteModal, setDeleteModal] = useState({ open: false, tag: null })
  
  // Filters and pagination
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    loadTags()
  }, [filters])

  const loadTags = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await tagAPI.getAll(filters)
      setTags(response.data)
      setPagination(response.pagination)
    } catch (error) {
      setError('Failed to load tags')
      console.error('Error loading tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTag = async (data) => {
    try {
      await tagAPI.create(data)
      toast.success('Tag created successfully')
      setCreateModal({ open: false })
      loadTags()
    } catch (error) {
      toast.error('Failed to create tag')
    }
  }

  const handleUpdateTag = async (tagId, data) => {
    try {
      await tagAPI.update(tagId, data)
      toast.success('Tag updated successfully')
      setEditModal({ open: false, tag: null })
      loadTags()
    } catch (error) {
      toast.error('Failed to update tag')
    }
  }

  const handleDeleteTag = async (tagId) => {
    try {
      await tagAPI.delete(tagId)
      toast.success('Tag deleted successfully')
      setDeleteModal({ open: false, tag: null })
      loadTags()
    } catch (error) {
      toast.error('Failed to delete tag')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
          <p className="text-gray-600">Manage blog tags</p>
        </div>
        <Button onClick={() => setCreateModal({ open: true })}>
          <Plus className="h-4 w-4 mr-2" />
          New Tag
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            label="Search"
            placeholder="Search tags..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            icon={Search}
          />
          <Select
            label="Per Page"
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
            options={[
              { value: 10, label: '10 per page' },
              { value: 25, label: '25 per page' },
              { value: 50, label: '50 per page' }
            ]}
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" title="Error" message={error} />
      )}

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tags.map((tag) => (
          <div key={tag.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-primary-600" />
                <h3 className="font-medium text-gray-900">
                  {tag.name}
                </h3>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setEditModal({ open: true, tag })}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => setDeleteModal({ open: true, tag })}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>
                {tag.blogs_count || 0} blogs
              </span>
              <span className="text-xs">
                {tag.slug}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && tags.length === 0 && (
        <div className="text-center py-12">
          <Tag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tags found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new tag.
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Create Modal */}
      <CreateTagModal
        isOpen={createModal.open}
        onClose={() => setCreateModal({ open: false })}
        onSave={handleCreateTag}
      />

      {/* Edit Modal */}
      <EditTagModal
        isOpen={editModal.open}
        tag={editModal.tag}
        onClose={() => setEditModal({ open: false, tag: null })}
        onSave={handleUpdateTag}
      />

      {/* Delete Modal */}
      <DeleteTagModal
        isOpen={deleteModal.open}
        tag={deleteModal.tag}
        onClose={() => setDeleteModal({ open: false, tag: null })}
        onConfirm={handleDeleteTag}
      />
    </div>
  )
}

// Create Tag Modal
const CreateTagModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ name })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Tag" size="small">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tag Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter tag name..."
          required
        />
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Tag
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// Edit Tag Modal
const EditTagModal = ({ isOpen, tag, onClose, onSave }) => {
  const [name, setName] = useState('')

  useEffect(() => {
    if (tag) {
      setName(tag.name || '')
    }
  }, [tag])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(tag.id, { name })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Tag" size="small">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tag Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Update Tag
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// Delete Tag Modal
const DeleteTagModal = ({ isOpen, tag, onClose, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm(tag.id)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Tag" size="small">
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you sure you want to delete the tag <strong>{tag?.name}</strong>? 
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Delete Tag
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default TagManagement