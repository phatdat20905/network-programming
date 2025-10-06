import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, Eye, Clock } from 'lucide-react'
import { formatters } from '../../utils/formatters'

const BlogCard = ({ blog }) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {blog.image_url && (
        <div className="h-48 overflow-hidden">
          <img
            src={blog.image_url}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          {blog.category && (
            <Link
              to={`/blogs?category=${blog.category.id}`}
              className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs font-medium hover:bg-primary-200 transition-colors"
            >
              {blog.category.name}
            </Link>
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          <Link 
            to={`/blogs/${blog.id}`}
            className="hover:text-primary-600 transition-colors"
          >
            {blog.title}
          </Link>
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.excerpt || blog.content?.substring(0, 150)}...
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{blog.author?.username || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={blog.created_at}>
                {formatters.formatDate(blog.created_at)}
              </time>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{blog.view_count || 0}</span>
            </div>
            {blog.reading_time && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{blog.reading_time} min</span>
              </div>
            )}
          </div>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {blog.tags.slice(0, 3).map(tag => (
              <Link
                key={tag.id}
                to={`/blogs?tag=${tag.id}`}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
            {blog.tags.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default BlogCard