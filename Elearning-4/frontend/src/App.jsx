import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import BlogListPage from './pages/blog/BlogListPage'
import BlogDetailPage from './pages/blog/BlogDetailPage'
import BlogCreatePage from './pages/blog/BlogCreatePage'
import BlogEditPage from './pages/blog/BlogEditPage'
import Profile from './pages/Profile'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagementPage from './pages/admin/UserManagementPage'
import CategoryManagementPage from './pages/admin/CategoryManagementPage'
import TagManagementPage from './pages/admin/TagManagementPage'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Layout routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blogs" element={<BlogListPage />} />
          <Route path="blogs/:id" element={<BlogDetailPage />} />
          <Route path="blogs/slug/:slug" element={<BlogDetailPage />} />
          
          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="blogs/create" element={<BlogCreatePage />} />
            <Route path="blogs/edit/:id" element={<BlogEditPage />} />
          </Route>

          {/* Admin routes */}
          <Route path="/" element={<AdminRoute />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/users" element={<UserManagementPage />} />
            <Route path="admin/categories" element={<CategoryManagementPage />} />
            <Route path="admin/tags" element={<TagManagementPage />} />
          </Route>
        </Route>

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  )
}

export default App