import React, { useState, useEffect } from 'react'
import { categoryAPI } from '../../api'
import { Input, Button, Modal, Alert, Pagination } from '../ui'
import { Plus, Edit, Trash2, FolderOpen, Search } from 'lucide-react'
import toast from 'react-hot-toast'

const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Modals
  const [createModal, setCreateModal] = useState({ open: false })
  const [editModal, setEditModal] = useState({ open: false, category: null })
  const [deleteModal, setDeleteModal] = useState({ open: false, category: null })
  
  // Filters and pagination
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    loadCategories()
  }, [filters])

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await categoryAPI.getAll(filters)
      setCategories(response.data)
      setPagination(response.pagination)
    } catch (error) {
      setError('Failed to load categories')
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async (data) => {
    try {
      await categoryAPI.create(data)
      toast.success('Category created successfully')
      setCreateModal({ open: false })
      loadCategories()
    } catch (error) {
      toast.error('Failed to create category')
    }
  }

  const handleUpdateCategory = async (categoryId, data) => {
    try {
      await categoryAPI.update(categoryId, data)
      toast.success('Category updated successfully')
      setEditModal({ open: false, category: null })
      loadCategories()
    } catch (error) {
      toast.error('Failed to update category')
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    try {
      await categoryAPI.delete(categoryId)
      toast.success('Category deleted successfully')
      setDeleteModal({ open: false, category: null })
      loadCategories()
    } catch (error) {
      toast.error('Failed to delete category')
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
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage blog categories</p>
        </div>
        <Button onClick={() => setCreateModal({ open: true })}>
          <Plus className="h-4 w-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            label="Search"
            placeholder="Search categories..."
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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FolderOpen className="h-8 w-8 text-primary-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">{category.slug}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setEditModal({ open: true, category })}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => setDeleteModal({ open: true, category })}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {category.description && (
              <p className="text-gray-600 text-sm mb-4">
                {category.description}
              </p>
            )}
            
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>
                {category.blogs_count || 0} blogs
              </span>
              <span>
                Created {new Date(category.created_at).toLocaleDateString()}
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
      {!loading && categories.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new category.
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
      <CreateCategoryModal
        isOpen={createModal.open}
        onClose={() => setCreateModal({ open: false })}
        onSave={handleCreateCategory}
      />

      {/* Edit Modal */}
      <EditCategoryModal
        isOpen={editModal.open}
        category={editModal.category}
        onClose={() => setEditModal({ open: false, category: null })}
        onSave={handleUpdateCategory}
      />

      {/* Delete Modal */}
      <DeleteCategoryModal
        isOpen={deleteModal.open}
        category={deleteModal.category}
        onClose={() => setDeleteModal({ open: false, category: null })}
        onConfirm={handleDeleteCategory}
      />
    </div>
  )
}

// Create Category Modal
const CreateCategoryModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Category" size="medium">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Category Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter category name..."
          required
        />
        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enter category description..."
          rows={3}
        />
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Category
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// Edit Category Modal
const EditCategoryModal = ({ isOpen, category, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || ''
      })
    }
  }, [category])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(category.id, formData)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Category" size="medium">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Category Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Update Category
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// Delete Category Modal
const DeleteCategoryModal = ({ isOpen, category, onClose, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm(category.id)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Category" size="small">
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you sure you want to delete the category <strong>{category?.name}</strong>? 
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Delete Category
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default CategoryManagement