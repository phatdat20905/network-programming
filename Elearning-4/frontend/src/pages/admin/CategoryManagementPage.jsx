import React, { useState, useEffect } from 'react'
import { categoryAPI } from '../../api'
import { Card, Button, Modal, Input, LoadingSpinner } from '../../components/ui'
import { Plus, Edit, Trash2, Search, FolderOpen } from 'lucide-react'
import { useForm } from '../../hooks/useForm'
import toast from 'react-hot-toast'

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const { values, errors, handleChange, handleBlur, reset, setValue } = useForm({
    name: '',
    description: ''
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await categoryAPI.getAll({ limit: 100 })
      setCategories(response.data || [])
    } catch (error) {
      toast.error('Failed to load categories')
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!values.name.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      setActionLoading(true)
      await categoryAPI.create(values)
      toast.success('Category created successfully')
      setModalOpen(false)
      reset()
      loadCategories()
    } catch (error) {
      toast.error('Failed to create category')
      console.error('Error creating category:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!values.name.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      setActionLoading(true)
      await categoryAPI.update(editingCategory.id, values)
      toast.success('Category updated successfully')
      setModalOpen(false)
      setEditingCategory(null)
      reset()
      loadCategories()
    } catch (error) {
      toast.error('Failed to update category')
      console.error('Error updating category:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (category) => {
    if (!window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      setActionLoading(true)
      await categoryAPI.delete(category.id)
      toast.success('Category deleted successfully')
      loadCategories()
    } catch (error) {
      toast.error('Failed to delete category')
      console.error('Error deleting category:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingCategory(null)
    reset()
    setModalOpen(true)
  }

  const openEditModal = (category) => {
    setEditingCategory(category)
    setValue('name', category.name)
    setValue('description', category.description || '')
    setModalOpen(true)
  }

  const handleSubmit = () => {
    if (editingCategory) {
      handleUpdate()
    } else {
      handleCreate()
    }
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
            <p className="text-gray-600 mt-2">
              Manage blog categories
            </p>
          </div>
          <Button
            onClick={openCreateModal}
            icon={<Plus className="h-4 w-4" />}
          >
            New Category
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </Card>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category.id} hover className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <FolderOpen className="h-5 w-5 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => openEditModal(category)}
                    icon={<Edit className="h-3 w-3" />}
                  />
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDelete(category)}
                    loading={actionLoading}
                    icon={<Trash2 className="h-3 w-3" />}
                  />
                </div>
              </div>
              
              {category.description && (
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
              )}
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  {category.blog_count || 0} blog{category.blog_count !== 1 ? 's' : ''}
                </span>
                <span>
                  Created {new Date(category.created_at).toLocaleDateString()}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <Card className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search' : 'Get started by creating your first category'}
            </p>
            {!searchTerm && (
              <Button onClick={openCreateModal}>
                Create Category
              </Button>
            )}
          </Card>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCategory ? 'Edit Category' : 'Create New Category'}
          size="medium"
        >
          <div className="space-y-4">
            <Input
              label="Category Name"
              name="name"
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              error={errors.name}
              placeholder="Enter category name"
              required
            />

            <Input
              label="Description"
              name="description"
              value={values.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter category description (optional)"
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
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default CategoryManagementPage