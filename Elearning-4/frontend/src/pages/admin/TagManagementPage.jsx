import React, { useState, useEffect } from 'react'
import { tagAPI } from '../../api'
import { Card, Button, Modal, Input, LoadingSpinner } from '../../components/ui'
import { Plus, Edit, Trash2, Search, Tag } from 'lucide-react'
import { useForm } from '../../hooks/useForm'
import toast from 'react-hot-toast'

const TagManagementPage = () => {
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const { values, errors, handleChange, handleBlur, reset, setValue } = useForm({
    name: '',
    description: ''
  })

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      setLoading(true)
      const response = await tagAPI.getAll({ limit: 100 })
      setTags(response.data || [])
    } catch (error) {
      toast.error('Failed to load tags')
      console.error('Error loading tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!values.name.trim()) {
      toast.error('Tag name is required')
      return
    }

    try {
      setActionLoading(true)
      await tagAPI.create(values)
      toast.success('Tag created successfully')
      setModalOpen(false)
      reset()
      loadTags()
    } catch (error) {
      toast.error('Failed to create tag')
      console.error('Error creating tag:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!values.name.trim()) {
      toast.error('Tag name is required')
      return
    }

    try {
      setActionLoading(true)
      await tagAPI.update(editingTag.id, values)
      toast.success('Tag updated successfully')
      setModalOpen(false)
      setEditingTag(null)
      reset()
      loadTags()
    } catch (error) {
      toast.error('Failed to update tag')
      console.error('Error updating tag:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (tag) => {
    if (!window.confirm(`Are you sure you want to delete "${tag.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      setActionLoading(true)
      await tagAPI.delete(tag.id)
      toast.success('Tag deleted successfully')
      loadTags()
    } catch (error) {
      toast.error('Failed to delete tag')
      console.error('Error deleting tag:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingTag(null)
    reset()
    setModalOpen(true)
  }

  const openEditModal = (tag) => {
    setEditingTag(tag)
    setValue('name', tag.name)
    setValue('description', tag.description || '')
    setModalOpen(true)
  }

  const handleSubmit = () => {
    if (editingTag) {
      handleUpdate()
    } else {
      handleCreate()
    }
  }

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tag.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner size="large" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tag Management</h1>
            <p className="text-gray-600 mt-2">
              Manage blog tags
            </p>
          </div>
          <Button
            onClick={openCreateModal}
            icon={<Plus className="h-4 w-4" />}
          >
            New Tag
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <Input
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </Card>

        {/* Tags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTags.map((tag) => (
            <Card key={tag.id} hover className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary-600" />
                  <h3 className="font-medium text-gray-900">#{tag.name}</h3>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => openEditModal(tag)}
                    icon={<Edit className="h-3 w-3" />}
                  />
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDelete(tag)}
                    loading={actionLoading}
                    icon={<Trash2 className="h-3 w-3" />}
                  />
                </div>
              </div>
              
              {tag.description && (
                <p className="text-gray-600 text-sm mb-3">
                  {tag.description}
                </p>
              )}
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  {tag.blog_count || 0} blog{tag.blog_count !== 1 ? 's' : ''}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {filteredTags.length === 0 && (
          <Card className="text-center py-12">
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tags found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search' : 'Get started by creating your first tag'}
            </p>
            {!searchTerm && (
              <Button onClick={openCreateModal}>
                Create Tag
              </Button>
            )}
          </Card>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingTag ? 'Edit Tag' : 'Create New Tag'}
          size="medium"
        >
          <div className="space-y-4">
            <Input
              label="Tag Name"
              name="name"
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              error={errors.name}
              placeholder="Enter tag name"
              required
            />

            <Input
              label="Description"
              name="description"
              value={values.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter tag description (optional)"
            />

            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                loading={actionLoading}
              >
                {editingTag ? 'Update Tag' : 'Create Tag'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default TagManagementPage