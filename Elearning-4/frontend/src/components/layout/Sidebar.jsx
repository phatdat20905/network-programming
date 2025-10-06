import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  Tags,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const Sidebar = ({ isOpen, onToggle, isMobile = false }) => {
  const location = useLocation()

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard
    },
    {
      name: 'User Management',
      path: '/admin/users',
      icon: Users
    },
    {
      name: 'Category Management',
      path: '/admin/categories',
      icon: FolderOpen
    },
    {
      name: 'Tag Management',
      path: '/admin/tags',
      icon: Tags
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: Settings
    }
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
        {!isMobile && (
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${active
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                    ${!isOpen && !isMobile ? 'justify-center' : ''}
                  `}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {(isOpen || isMobile) && (
                    <span className="whitespace-nowrap">{item.name}</span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className={`flex items-center gap-3 text-sm text-gray-600 ${!isOpen && !isMobile ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary-600 font-medium text-sm">A</span>
          </div>
          {(isOpen || isMobile) && (
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-gray-500 truncate">Administrator</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-40 lg:hidden">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onToggle} />
        
        {/* Sidebar */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={onToggle}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
          </div>
          
          {sidebarContent}
        </div>
      </div>
    )
  }

  return (
    <div className={`
      hidden lg:flex lg:flex-shrink-0 bg-white border-r border-gray-200 transition-all duration-300
      ${isOpen ? 'w-64' : 'w-16'}
    `}>
      {sidebarContent}
    </div>
  )
}

export default Sidebar