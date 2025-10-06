import React, { useState, useEffect } from 'react'
import { userAPI } from '../../api'
import { Card, Button, Modal, Input, Select, LoadingSpinner } from '../../components/ui'
import { Edit, Trash2, Search, UserPlus } from 'lucide-react'
import { formatters } from '../../utils/formatters'
import toast from 'react-hot-toast'

const UserManagementPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await userAPI.getAll()
      setUsers(response.data || [])
    } catch (error) {
      toast.error('Failed to load users')
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (user) => {
    try {
      setActionLoading(true)
      await userAPI.toggleActive(user.id, !user.is_active)
      toast.success(`User ${!user.is_active ? 'activated' : 'deactivated'} successfully`)
      loadUsers()
    } catch (error) {
      toast.error('Failed to update user')
      console.error('Error updating user:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleChangeRole = async (user, newRole) => {
    try {
      setActionLoading(true)
      await userAPI.changeRole(user.id, newRole)
      toast.success('User role updated successfully')
      loadUsers()
    } catch (error) {
      toast.error('Failed to update user role')
      console.error('Error updating user role:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      setActionLoading(true)
      await userAPI.delete(selectedUser.id)
      toast.success('User deleted successfully')
      setDeleteModalOpen(false)
      setSelectedUser(null)
      loadUsers()
    } catch (error) {
      toast.error('Failed to delete user')
      console.error('Error deleting user:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">
              Manage users and their permissions
            </p>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <div className="flex gap-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-4 w-4" />}
              className="flex-1"
            />
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {user.username?.charAt(0).toUpperCase()}
                          </span>
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
                      <Select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user, e.target.value)}
                        disabled={actionLoading}
                        options={[
                          { value: 'user', label: 'User' },
                          { value: 'moderator', label: 'Moderator' },
                          { value: 'admin', label: 'Admin' }
                        ]}
                        className="w-32"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatters.formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => handleToggleActive(user)}
                        loading={actionLoading}
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => {
                          setSelectedUser(user)
                          setDeleteModalOpen(true)
                        }}
                        loading={actionLoading}
                        icon={<Trash2 className="h-4 w-4" />}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found
              </div>
            )}
          </div>
        </Card>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete User"
          size="small"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete user <strong>{selectedUser?.username}</strong>? 
              This action cannot be undone and will permanently delete all their blogs and data.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                loading={actionLoading}
                onClick={handleDeleteUser}
              >
                Delete User
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default UserManagementPage