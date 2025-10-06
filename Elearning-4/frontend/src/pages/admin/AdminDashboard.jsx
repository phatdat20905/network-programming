import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userAPI, blogAPI, categoryAPI } from '../../api'
import { Card } from '../../components/ui'
import { 
  Users, 
  BookOpen, 
  FolderOpen, 
  Tags,
  TrendingUp,
  Eye,
  Calendar
} from 'lucide-react'
import { formatters } from '../../utils/formatters'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    blogs: 0,
    categories: 0,
    tags: 0,
    totalViews: 0
  })
  const [recentBlogs, setRecentBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load stats
      const [usersRes, blogsRes, categoriesRes, tagsRes] = await Promise.all([
        userAPI.getStats(),
        blogAPI.getAll({ limit: 1 }),
        categoryAPI.getAll({ limit: 1 }),
        userAPI.getStats() // Using as placeholder for tags
      ])

      // Load recent blogs
      const recentBlogsRes = await blogAPI.getAll({ 
        limit: 5, 
        sortBy: 'created_at',
        sortOrder: 'DESC'
      })

      setStats({
        users: usersRes.data?.totalUsers || 0,
        blogs: blogsRes.pagination?.totalItems || 0,
        categories: categoriesRes.pagination?.totalItems || 0,
        tags: 50, // Placeholder
        totalViews: 15000 // Placeholder
      })

      setRecentBlogs(recentBlogsRes.data || [])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon, title, value, description, color = 'blue' }) => (
    <Card hover className="text-center">
      <div className={`inline-flex items-center justify-center p-3 rounded-full bg-${color}-100 text-${color}-600 mb-4`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-900 font-medium mb-1">{title}</p>
      <p className="text-gray-500 text-sm">{description}</p>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Overview of your blog platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="h-6 w-6" />}
            title="Total Users"
            value={formatters.formatNumber(stats.users)}
            description="Registered users"
            color="blue"
          />
          <StatCard
            icon={<BookOpen className="h-6 w-6" />}
            title="Total Blogs"
            value={formatters.formatNumber(stats.blogs)}
            description="Published blogs"
            color="green"
          />
          <StatCard
            icon={<FolderOpen className="h-6 w-6" />}
            title="Categories"
            value={formatters.formatNumber(stats.categories)}
            description="Blog categories"
            color="purple"
          />
          <StatCard
            icon={<Eye className="h-6 w-6" />}
            title="Total Views"
            value={formatters.formatNumber(stats.totalViews)}
            description="All-time views"
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Blogs */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Blogs</h2>
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
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      by {blog.author?.username} • {formatters.formatRelativeTime(blog.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Eye className="h-4 w-4" />
                    <span>{blog.view_count || 0}</span>
                  </div>
                </div>
              ))}
              
              {recentBlogs.length === 0 && (
                <p className="text-gray-500 text-center py-4">No blogs yet</p>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/admin/users"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <Users className="h-8 w-8 text-primary-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Users</span>
                <span className="text-xs text-gray-500">Manage users</span>
              </Link>

              <Link
                to="/admin/categories"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <FolderOpen className="h-8 w-8 text-primary-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Categories</span>
                <span className="text-xs text-gray-500">Manage categories</span>
              </Link>

              <Link
                to="/admin/tags"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <Tags className="h-8 w-8 text-primary-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Tags</span>
                <span className="text-xs text-gray-500">Manage tags</span>
              </Link>

              <Link
                to="/blogs/create"
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <BookOpen className="h-8 w-8 text-primary-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Write Blog</span>
                <span className="text-xs text-gray-500">Create new blog</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard