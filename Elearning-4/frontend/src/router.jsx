import { createBrowserRouter } from 'react-router-dom'
import App from './App'
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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'blogs', element: <BlogListPage /> },
      { path: 'blogs/:id', element: <BlogDetailPage /> },
      { path: 'blogs/slug/:slug', element: <BlogDetailPage /> },
      
      // Protected routes
      {
        path: 'profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      {
        path: 'blogs/create',
        element: <ProtectedRoute><BlogCreatePage /></ProtectedRoute>,
      },
      {
        path: 'blogs/edit/:id',
        element: <ProtectedRoute><BlogEditPage /></ProtectedRoute>,
      },
      
      // Admin routes
      {
        path: 'admin',
        element: <AdminRoute><AdminDashboard /></AdminRoute>,
      },
      {
        path: 'admin/users',
        element: <AdminRoute><UserManagementPage /></AdminRoute>,
      },
      {
        path: 'admin/categories',
        element: <AdminRoute><CategoryManagementPage /></AdminRoute>,
      },
      {
        path: 'admin/tags',
        element: <AdminRoute><TagManagementPage /></AdminRoute>,
      },
      
      { path: '*', element: <NotFound /> },
    ],
  },
])