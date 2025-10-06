import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userAPI, blogAPI, categoryAPI } from '../../api'
import { 
  Users, 
  BookOpen, 
  FolderOpen, 
  Tag, 
  Eye,
  TrendingUp,
  Calendar
} from 'lucide-react'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentBlogs, setRecentBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load user stats
      const userStatsResponse = await userAPI.getStats()
      const userStats = userStatsResponse.data.stats
      
      // Load blog stats (you might need to create this endpoint)
      const blogsResponse = await blogAPI.getAll({ limit: 5 })
      const recentBlogs = blogsResponse.data
      
      // Load category stats
      const categoriesResponse = await categoryAPI.getAll({ limit: 100 })
      const categoryStats = categoriesResponse.data
      
      setStats({
        users: userStats,
        blogs: {
          total: recentBlogs.length, // This would be from a proper stats endpoint
          recent: recentBlogs.length
        },
        categories: categoryStats.length
      })
      
      setRecentBlogs(recentBlogs.slice(0, 5))
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats?.users.totalUsers || 0}
          change={stats?.users.recentUsers || 0}
          changeText="new this month"
          link="/admin/users"
          linkText="View Users"
        />
        <StatCard
          icon={BookOpen}
          title="Total Blogs"
          value={stats?.blogs.total || 0}
          change={stats?.blogs.recent || 0}
          changeText="recent"
          link="/blogs"
          linkText="View Blogs"
        />
        <StatCard
          icon={FolderOpen}
          title="Categories"
          value={stats?.categories || 0}
          link="/admin/categories"
          linkText="Manage Categories"
        />
        <StatCard
          icon={Tag}
          title="Tags"
          value="0" // You might want to add tag stats
          link="/admin/tags"
          linkText="Manage Tags"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blogs */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Blogs</h2>
            <Link 
              to="/blogs"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentBlogs.map(blog => (
              <div key={blog.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <Link 
                    to={`/blogs/${blog.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-primary-600 truncate block"
                  >
                    {blog.title}
                  </Link>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                    <span>{blog.author?.username}</span>
                    <span>•</span>
                    <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Eye className="h-3 w-3" />
                  <span>{blog.view_count}</span>
                </div>
              </div>
            ))}
            {recentBlogs.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No recent blogs</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            <Link
              to="/blogs/create"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="h-5 w-5 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Write New Blog</p>
                <p className="text-sm text-gray-500">Create and publish a new blog post</p>
              </div>
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Manage Users</p>
                <p className="text-sm text-gray-500">View and manage user accounts</p>
              </div>
            </Link>
            <Link
              to="/admin/categories"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FolderOpen className="h-5 w-5 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Manage Categories</p>
                <p className="text-sm text-gray-500">Organize blog categories</p>
              </div>
            </Link>
            <Link
              to="/admin/tags"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Tag className="h-5 w-5 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Manage Tags</p>
                <p className="text-sm text-gray-500">Organize blog tags</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
const StatCard = ({ icon: Icon, title, value, change, changeText, link, linkText }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-8 w-8 text-primary-600" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                +{change} {changeText}
              </span>
            </div>
          )}
        </div>
      </div>
      {link && (
        <div className="mt-4">
          <Link
            to={link}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            {linkText} →
          </Link>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard