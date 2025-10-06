import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blogAPI, categoryAPI, tagAPI } from '../api'
import { BlogList, BlogFilters } from '../components/blog'
import { Button, Pagination } from '../components/ui'
import { BookOpen, TrendingUp, Clock, Users, Eye, Share2 } from 'lucide-react'

const Home = () => {
  const [blogs, setBlogs] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    tag: '',
    sortBy: 'created_at',
    sortOrder: 'DESC',
    page: 1,
    limit: 9
  })

  const [pagination, setPagination] = useState({})

  useEffect(() => {
    loadBlogs()
    loadCategories()
    loadTags()
  }, [filters])

  const loadBlogs = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await blogAPI.getAll(filters)
      setBlogs(response.data)
      setPagination(response.pagination)
    } catch (error) {
      setError('Failed to load blogs')
      console.error('Error loading blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll({ limit: 100 })
      setCategories(response.data)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadTags = async () => {
    try {
      const response = await tagAPI.getAll({ limit: 100 })
      setTags(response.data)
    } catch (error) {
      console.error('Error loading tags:', error)
    }
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1
    }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BookOpen className="mx-auto h-16 w-16 mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to BlogApp
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Discover amazing stories, share your thoughts, and connect with a community of writers and readers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/blogs">
                <Button size="large" variant="secondary">
                  Explore Blogs
                </Button>
              </Link>
              <Link to="/blogs/create">
                <Button size="large">
                  Start Writing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Blogs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the latest and most popular stories from our community of writers.
            </p>
          </div>

          {/* Filters */}
          <BlogFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            categories={categories}
            tags={tags}
            className="mb-8"
          />

          {/* Blog List */}
          <BlogList
            blogs={blogs}
            loading={loading}
            error={error}
            emptyMessage="No blogs found. Try adjusting your filters or be the first to write a blog!"
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose BlogApp?
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to share your stories with the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Writing
              </h3>
              <p className="text-gray-600">
                Write and publish your stories with our intuitive editor. Focus on your content while we handle the rest.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Growing Community
              </h3>
              <p className="text-gray-600">
                Join thousands of writers and readers sharing knowledge, stories, and experiences.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Reach Audience
              </h3>
              <p className="text-gray-600">
                Get your content discovered by readers worldwide with our smart recommendation system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">1K+</div>
              <div className="text-primary-200">Active Writers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">5K+</div>
              <div className="text-primary-200">Published Blogs</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-primary-200">Monthly Readers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100+</div>
              <div className="text-primary-200">Categories</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home