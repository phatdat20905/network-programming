import React, { useState, useEffect } from 'react'
import { blogAPI, categoryAPI, tagAPI } from '../../api'
import { BlogList, BlogFilters } from '../../components/blog'
import { Pagination } from '../../components/ui'
import { useDebounce } from '../../hooks/useDebounce'

const BlogListPage = () => {
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
    limit: 12
  })

  const [pagination, setPagination] = useState({})
  const debouncedSearch = useDebounce(filters.search, 500)

  useEffect(() => {
    loadBlogs()
  }, [filters, debouncedSearch])

  useEffect(() => {
    loadCategories()
    loadTags()
  }, [])

  const loadBlogs = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await blogAPI.getAll({
        ...filters,
        search: debouncedSearch
      })
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Blogs</h1>
          <p className="text-gray-600">
            Discover amazing stories from our community of writers
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
    </div>
  )
}

export default BlogListPage