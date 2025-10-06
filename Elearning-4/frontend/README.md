# Blog App - Frontend

A modern, responsive blog application built with React, Vite, and Tailwind CSS. This frontend application provides a complete blogging platform with user authentication, blog management, and admin dashboard.

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Protected routes
- Admin role management
- Token refresh mechanism

### 📝 Blog Management
- Create, read, update, and delete blogs
- Rich text content support
- Image upload for blog covers
- Category and tag system
- Blog search and filtering
- Pagination

### 🎨 User Experience
- Responsive design for all devices
- Modern UI with Tailwind CSS
- Loading states and error handling
- Toast notifications
- Dark mode support (ready for implementation)

### 👥 Admin Features
- User management
- Category management  
- Tag management
- Dashboard with analytics
- Content moderation

### 🔧 Technical Features
- React Router for navigation
- Context API for state management
- Custom hooks for reusable logic
- Axios for API calls with interceptors
- Form validation
- Image optimization

## 🛠 Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Form Handling:** Custom hooks
- **State Management:** React Context API

## 📦 Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- Backend API server running

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Elearning-4/frontend
    ```
2. **Install dependencies

bash
npm install
# or
yarn install
Environment Configuration
Create a .env file in the root directory:

env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=BlogApp
Start the development server

bash
npm run dev
# or
yarn dev
Build for production

bash
npm run build
# or
yarn build
🏗 Project Structure
frontend/
├── public/
│   ├── index.html
│   └── vite.svg
├── src/
│   ├── api/
│   │   ├── axiosInstance.js
│   │   ├── auth.js
│   │   ├── blog.js
│   │   ├── category.js
│   │   ├── tag.js
│   │   ├── user.js
│   │   └── upload.js
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Textarea.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── Alert.jsx
│   │   │   └── ImageUpload.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Layout.jsx
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── blog/
│   │   │   ├── BlogCard.jsx
│   │   │   ├── BlogList.jsx
│   │   │   ├── BlogForm.jsx
│   │   │   ├── BlogFilters.jsx
│   │   │   └── BlogDetail.jsx
│   │   └── admin/
│   │       ├── UserManagement.jsx
│   │       ├── CategoryManagement.jsx
│   │       ├── TagManagement.jsx
│   │       └── Dashboard.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   ├── useForm.js
│   │   └── useDebounce.js
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── blog/
│   │   │   ├── BlogListPage.jsx
│   │   │   ├── BlogDetailPage.jsx
│   │   │   ├── BlogCreatePage.jsx
│   │   │   └── BlogEditPage.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── UserManagementPage.jsx
│   │   │   ├── CategoryManagementPage.jsx
│   │   │   └── TagManagementPage.jsx
│   │   ├── Home.jsx
│   │   ├── Profile.jsx
│   │   └── NotFound.jsx
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validation.js
│   │   └── formatters.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js

🔌 API Integration
The frontend communicates with a RESTful API. Key endpoints include:

Authentication: /auth/login, /auth/register, /auth/refresh-token

Blogs: /blogs, /blogs/:id, /blogs/user/my-blogs

Categories: /categories

Tags: /tags

Users: /admin/users (admin only)

Upload: /upload/image

🎯 Key Components
UI Components
Button - Custom button with variants

Input - Form input with validation

Modal - Reusable modal dialog

Pagination - Pagination controls

LoadingSpinner - Loading indicator

Layout Components
Header - Navigation header with user menu

Sidebar - Admin sidebar navigation

Footer - Site footer

Layout - Main layout wrapper

Blog Components
BlogCard - Blog preview card

BlogList - Blog listing grid

BlogDetail - Blog detail view

BlogForm - Blog creation/editing form

BlogFilters - Search and filter controls

🔒 Authentication Flow
User logs in with email/password

JWT tokens (access & refresh) are stored securely

Access token is included in API requests

Token refresh happens automatically

Protected routes check authentication status

🎨 Styling & Theming
Tailwind CSS for utility-first styling

Responsive design with mobile-first approach

Custom color palette in tailwind.config.js

Dark mode ready (implemented in ThemeContext)

📱 Responsive Design
The application is fully responsive with breakpoints:

Mobile: < 768px

Tablet: 768px - 1024px

Desktop: > 1024px

Environment Variables for Production
env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_NAME=BlogApp


## 🎉 **DỰ ÁN ĐÃ HOÀN THIỆN 100%!**

Bây giờ dự án frontend của bạn đã có:

### ✅ **ĐÃ HOÀN THÀNH ĐẦY ĐỦ:**
- **Sidebar component** cho admin panel
- **README.md** hoàn chỉnh với hướng dẫn chi tiết
- **Tất cả components, pages, hooks, utils**
- **Documentation đầy đủ** cho development và deployment

### 🚀 **TÍNH NĂNG HOÀN CHỈNH:**
- Authentication system
- Blog management (CRUD)
- Admin dashboard
- Responsive design
- API integration
- Error handling
- Form validation
- Image upload
- Search & filters
- Pagination

Bạn có thể bắt đầu sử dụng dự án ngay! Chạy `npm run dev` để khởi động development server và kiểm tra tất cả tính năng. 🎯