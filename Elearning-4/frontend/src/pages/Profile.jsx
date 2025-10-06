import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, Input, Button, Textarea } from '../components/ui'
import { User, Mail, Calendar, Edit, Save, X } from 'lucide-react'
import { formatters } from '../utils/formatters'
import { useForm } from '../hooks/useForm'
import { validation } from '../utils/validation'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUserProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const { values, errors, handleChange, handleBlur, setValue, validate } = useForm(
    {
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || ''
    },
    validation.validateProfile
  )

  const handleSave = async () => {
    if (!validate()) return

    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      updateUserProfile({
        ...user,
        ...values
      })
      
      toast.success('Profile updated successfully')
      setEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
      console.error('Error updating profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setValue('username', user?.username || '')
    setValue('email', user?.email || '')
    setValue('bio', user?.bio || '')
    setEditing(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-gray-500">Loading profile...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your account information
            </p>
          </div>
          
          {!editing ? (
            <Button
              onClick={() => setEditing(true)}
              icon={<Edit className="h-4 w-4" />}
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                icon={<X className="h-4 w-4" />}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                loading={loading}
                icon={<Save className="h-4 w-4" />}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Personal Information
              </h2>

              <div className="space-y-4">
                <Input
                  label="Username"
                  name="username"
                  value={values.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  onBlur={() => handleBlur('username')}
                  error={errors.username}
                  disabled={!editing}
                  icon={<User className="h-4 w-4" />}
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  error={errors.email}
                  disabled={!editing}
                  icon={<Mail className="h-4 w-4" />}
                />

                <Textarea
                  label="Bio"
                  name="bio"
                  value={values.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  onBlur={() => handleBlur('bio')}
                  error={errors.bio}
                  disabled={!editing}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  helperText="A brief description about yourself"
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member since</span>
                  <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatters.formatDate(user.created_at)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </Card>

            {/* Profile Completion */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Completion
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Basic Info</span>
                  <span className="text-gray-900">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-full"></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Bio</span>
                  <span className="text-gray-900">
                    {user.bio ? '100%' : '0%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: user.bio ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile