import React, { useState, useEffect } from 'react'
import { userAPI } from '../../api'
import { Input, Select, Button, Modal, Alert, Pagination } from '../ui'
import { Search, Filter, Edit, Trash2, UserCheck, UserX, Shield, User } from 'lucide-react'
import toast from 'react-hot-toast'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  
  // Filters and pagination
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    is_active: '',
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({})
  
  // Modals
  const [editModal, setEditModal] = useState({ open: false, user: null })
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null })

  useEffect(() => {
    loadUsers()
    loadStats()
  }, [filters])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await userAPI.getAll(filters)
      setUsers(response.data)
      setPagination(response.pagination)
    } catch (error) {
      setError('Failed to load users')
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await userAPI.getStats()
      setStats(response.data.stats)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleUpdateUser = async (userId, data) => {
    try {
      await userAPI.update(userId, data)
      toast.success('User updated successfully')
      setEditModal({ open: false, user: null })
      loadUsers()
    } catch (error) {
      toast.error('Failed to update user')
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      await userAPI.delete(userId)
      toast.success('User deleted successfully')
      setDeleteModal({ open: false, user: null })
      loadUsers()
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  const handleToggleActive = async (user, isActive) => {
    try {
      await userAPI.toggleActive(user.id, isActive)
      toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`)
      loadUsers()
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const handleChangeRole = async (user, role) => {
    try {
      await userAPI.changeRole(user.id, role)
      toast.success('User role updated successfully')
      loadUsers()
    } catch (error) {
      toast.error('Failed to update user role')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">{stats.adminUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inactiveUsers}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            label="Search"
            placeholder="Search users..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            icon={Search}
          />
          <Select
            label="Role"
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            options={[
              { value: '', label: 'All Roles' },
              { value: 'admin', label: 'Admin' },
              { value: 'user', label: 'User' }
            ]}
          />
          <Select
            label="Status"
            value={filters.is_active}
            onChange={(e) => handleFilterChange('is_active', e.target.value)}
            options={[
              { value: '', label: 'All Status' },
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' }
            ]}
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

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(user, !user.is_active)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => setEditModal({ open: true, user })}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => setDeleteModal({ open: true, user })}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
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
      </div>

      {/* Edit Modal */}
      <EditUserModal
        isOpen={editModal.open}
        user={editModal.user}
        onClose={() => setEditModal({ open: false, user: null })}
        onSave={handleUpdateUser}
      />

      {/* Delete Modal */}
      <DeleteUserModal
        isOpen={deleteModal.open}
        user={deleteModal.user}
        onClose={() => setDeleteModal({ open: false, user: null })}
        onConfirm={handleDeleteUser}
      />
    </div>
  )
}

// Edit User Modal Component
const EditUserModal = ({ isOpen, user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    role: 'user',
    is_active: true
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        full_name: user.full_name || '',
        role: user.role || 'user',
        is_active: user.is_active ?? true
      })
    }
  }, [user])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(user.id, formData)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User" size="medium">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          value={formData.username}
          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />
        <Input
          label="Full Name"
          value={formData.full_name}
          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
        />
        <Select
          label="Role"
          value={formData.role}
          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
          options={[
            { value: 'user', label: 'User' },
            { value: 'admin', label: 'Admin' }
          ]}
        />
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Active User
          </label>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  )
}

// Delete User Modal Component
const DeleteUserModal = ({ isOpen, user, onClose, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm(user.id)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete User" size="small">
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you sure you want to delete the user <strong>{user?.username}</strong>? 
          This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Delete User
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default UserManagement