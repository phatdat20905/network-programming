import React from 'react'
import BlogCard from './BlogCard'
import { LoadingSpinner } from '../ui'

const BlogList = ({ blogs, loading, error, emptyMessage = "No blogs found" }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-2">Error loading blogs</div>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">{emptyMessage}</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map(blog => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default BlogList