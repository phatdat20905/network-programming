import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui'
import { Home, ArrowLeft, Search } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto max-w-md">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
            <div className="w-24 h-2 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto rounded-full"></div>
          </div>

          {/* Content */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page not found
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered an incorrect URL.
          </p>

          {/* Suggestions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Here are some helpful links:
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <Home className="h-4 w-4 text-primary-600" />
                <Link to="/" className="hover:text-primary-600 transition-colors">
                  Go back to home page
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Search className="h-4 w-4 text-primary-600" />
                <Link to="/blogs" className="hover:text-primary-600 transition-colors">
                  Browse all blogs
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 text-primary-600" />
                <button 
                  onClick={() => window.history.back()} 
                  className="hover:text-primary-600 transition-colors"
                >
                  Go back to previous page
                </button>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={Link}
              to="/"
              size="large"
              icon={<Home className="h-4 w-4" />}
            >
              Go Home
            </Button>
            <Button
              as={Link}
              to="/blogs"
              variant="outline"
              size="large"
              icon={<Search className="h-4 w-4" />}
            >
              Browse Blogs
            </Button>
          </div>

          {/* Contact Support */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-500">
              Still can't find what you're looking for?{' '}
              <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound