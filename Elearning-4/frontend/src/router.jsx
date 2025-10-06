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
      { path: 'profile', element: <Profile /> },
      { path: 'blogs/create', element: <BlogCreatePage /> },
      { path: 'blogs/edit/:id', element: <BlogEditPage /> },
      { path: 'admin', element: <AdminDashboard /> },
      { path: 'admin/users', element: <UserManagementPage /> },
      { path: 'admin/categories', element: <CategoryManagementPage /> },
      { path: 'admin/tags', element: <TagManagementPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])