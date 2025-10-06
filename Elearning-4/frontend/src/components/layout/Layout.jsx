import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'

const Layout = () => {
  const { isAdmin } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-1">
        {/* Sidebar for Admin Routes */}
        {isAdmin && isAdminRoute && (
          <>
            <Sidebar 
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen(!sidebarOpen)}
            />
            <Sidebar
              isOpen={mobileSidebarOpen}
              onToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              isMobile={true}
            />
          </>
        )}
        
        {/* Main Content */}
        <main className={`flex-1 ${isAdmin && isAdminRoute ? 'lg:ml-0' : ''}`}>
          <Outlet />
        </main>
      </div>
      
      <Footer />
    </div>
  )
}

export default Layout