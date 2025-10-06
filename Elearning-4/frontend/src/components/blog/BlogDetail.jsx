import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, Eye, Clock, Edit, Trash2 } from 'lucide-react'
import { formatters } from '../../utils/formatters'
import { Button } from '../ui'
import { useAuth } from '../../contexts/AuthContext'

const BlogDetail = ({ blog, onEdit, onDelete, loading }) => {
  const { user } = useAuth()
  const isAuthor = user && blog.author && user.id === blog.author.id
  const isAdmin = user?.role === 'admin'

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="h-96 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Blog not found</div>
      </div>
    )
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        {blog.category && (
          <Link
            to={`/blogs?category=${blog.category.id}`}
            className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium mb-4 hover:bg-primary-200 transition-colors"
          >
            {blog.category.name}
          </Link>
        )}
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="font-medium">{blog.author?.username || 'Unknown'}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={blog.created_at}>
              {formatters.formatDate(blog.created_at)}
            </time>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{formatters.formatNumber(blog.view_count || 0)} views</span>
          </div>

          {blog.reading_time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{blog.reading_time} min read</span>
            </div>
          )}
        </div>

        {/* Action Buttons for Author/Admin */}
        {(isAuthor || isAdmin) && (
          <div className="flex gap-2 mb-6">
            <Button
              variant="outline"
              size="small"
              onClick={onEdit}
              icon={<Edit className="h-4 w-4" />}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={onDelete}
              icon={<Trash2 className="h-4 w-4" />}
            >
              Delete
            </Button>
          </div>
        )}

        {blog.image_url && (
          <div className="rounded-lg overflow-hidden mb-6">
            <img
              src={blog.image_url}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div 
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <footer className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {blog.tags.map(tag => (
              <Link
                key={tag.id}
                to={`/blogs?tag=${tag.id}`}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </footer>
      )}
    </article>
  )
}

export default BlogDetail