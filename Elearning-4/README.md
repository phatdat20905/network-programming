# Blog Application - Full Stack

A complete full-stack blog application with a RESTful API backend built using Node.js, Express, Sequelize, and MySQL, and a modern, responsive frontend built with React, Vite, and Tailwind CSS. The project supports user authentication, blog management, tag and category systems, user management, file uploads, and an admin dashboard.

## 🚀 Project Overview

This project is divided into two main components:
- **Backend**: A RESTful API providing authentication, blog management, tag and category management, user management, and file upload functionality.
- **Frontend**: A responsive React-based interface for users to interact with the blog, including browsing, creating, and managing content, with an admin panel for advanced controls.

The backend and frontend are designed to work seamlessly together, providing a robust blogging platform with role-based access control, secure authentication, and a user-friendly experience.

## 📋 Features

### 🔐 Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Role-based access control (Admin/User)
- Token rotation for enhanced security
- User registration, login, and logout (including logout from all devices)
- Protected routes for secure access

### 📝 Blog Management
- Create, read, update, and delete (CRUD) blog posts
- Rich text content support
- Featured image upload
- Blog categories and tags with filtering and search
- Pagination and view count tracking

### 🏷️ Tag & Category Management
- Full CRUD operations for tags and categories (Admin only)
- Blog-tag and blog-category relationships
- Automatic slug generation for SEO-friendly URLs

### 👥 User Management (Admin)
- User listing with pagination and search
- User role and status management (activate/deactivate)
- User statistics and reporting

### 📂 File Upload
- Single and multiple image uploads
- File type validation (JPEG, PNG, GIF, WebP)
- Maximum file size limit (10MB)

### 🎨 Frontend User Experience
- Responsive design for mobile, tablet, and desktop
- Modern UI with Tailwind CSS
- Loading states, error handling, and toast notifications
- Dark mode support (ready for implementation)

### 🛡️ Security
- Password hashing with bcrypt
- Rate limiting (100 requests/15 min for general, 5 for auth, 10 for uploads)
- CORS and XSS protection with Helmet
- Input validation and sanitization
- SQL injection prevention with Sequelize

### 📊 Database
- MySQL with Sequelize ORM
- Database migrations and seeders for development
- Efficient relationships and indexes

## 🛠 Tech Stack

### Backend
- **Framework**: Node.js, Express
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT with refresh tokens
- **File Upload**: Multer
- **Security**: bcrypt, Helmet, express-rate-limit
- **Logging**: Winston (or custom logger)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **State Management**: React Context API
- **Form Handling**: Custom hooks

## 📦 Project Structure

### Backend
```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js
│   │   └── constants.js
│   ├── models/              # Sequelize models
│   │   ├── User.js
│   │   ├── Blog.js
│   │   ├── Category.js
│   │   ├── Tag.js
│   │   ├── BlogTag.js
│   │   └── RefreshToken.js
│   ├── migrations/          # Database migrations
│   ├── seeders/             # Database seeders
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Authentication, validation, etc.
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── scripts/             # Utility scripts
│   ├── app.js               # Express app configuration
│   └── server.js            # Server entry point
├── uploads/                 # Uploaded files directory
├── logs/                    # Application logs
├── .env
├── .env.example
├── .sequelizerc
└── package.json
```

### Frontend
```
frontend/
├── public/
│   ├── index.html
│   └── vite.svg
├── src/
│   ├── api/                 # API service files
│   ├── components/          # Reusable components
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── auth/
│   │   ├── blog/
│   │   └── admin/
│   ├── contexts/            # Auth and Theme contexts
│   ├── hooks/               # Custom hooks
│   ├── pages/               # Page components
│   │   ├── auth/
│   │   ├── blog/
│   │   ├── admin/
│   │   ├── Home.jsx
│   │   ├── Profile.jsx
│   │   └── NotFound.jsx
│   ├── utils/               # Utility functions
│   ├── styles/              # Global styles
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 📋 Prerequisites

- **Node.js**: v16 or higher (backend), v14 or higher (frontend)
- **MySQL**: v8.0 or higher
- **npm or yarn**
- Backend API server running for frontend integration

## ⚙️ Installation

### Backend Setup
1. **Clone the backend repository**
   ```bash
   git clone <backend-repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:5173
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=blog_app
   DB_PORT=3306
   JWT_SECRET=your_super_secure_jwt_secret_key
   JWT_ACCESS_EXPIRE=15m
   JWT_REFRESH_EXPIRE_DAYS=7
   ENABLE_TOKEN_ROTATION=true
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=10485760
   ```

4. **Set up the database**
   ```bash
   npm run db:create
   npm run db:migrate
   npm run db:seed:all
   npm run create:admin
   ```

5. **Start the server**
   ```bash
   npm run dev  # Development mode
   npm start    # Production mode
   ```

### Frontend Setup
1. **Clone the frontend repository**
   ```bash
   git clone <frontend-repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create `.env` in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_APP_NAME=BlogApp
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔌 API Endpoints

### Authentication (/api/auth)
- POST `/register`, `/login`, `/refresh-token`, `/logout`, `/logout-all`
- GET `/me`, `/tokens`
- POST `/revoke-token`

### Blogs (/api/blogs)
- GET `/`, `/:id`, `/slug/:slug`, `/user/my-blogs`
- POST `/`
- PUT `/:id`
- DELETE `/:id`

### Categories (/api/categories)
- GET `/`, `/:id`
- POST `/`
- PUT `/:id`
- DELETE `/:id`

### Tags (/api/tags)
- GET `/`, `/:id`, `/slug/:slug`
- POST `/`, `/blog/:blogId`
- PUT `/:id`
- DELETE `/:id`, `/blog/:blogId/:tagId`

### User Management (/api/admin/users)
- GET `/`, `/stats`, `/:id`
- PUT `/:id`
- DELETE `/:id`
- PATCH `/:id/active`, `/:id/role`

### Upload (/api/upload)
- POST `/image`, `/images`

### Health Check
- GET `/api/health`

## 🎨 Frontend Features

- **Responsive Design**: Mobile-first with breakpoints for tablet and desktop
- **Navigation**: React Router for seamless page transitions
- **State Management**: Context API for authentication and theme
- **Components**: Reusable UI components (Button, Input, Modal, etc.)
- **Forms**: Custom hooks for form validation and handling
- **API Integration**: Axios with interceptors for token management

## 🧪 Testing

### Backend Testing
1. Import `Blog-API.postman_collection.json` and `Blog-API-Environment.postman_environment.json` into Postman.
2. Use test credentials:
   - Admin: `admin@blog.com` / `Admin123!`
   - Test User: `test@example.com` / `Password123`
3. Follow test flow:
   - Health check (`GET /api/health`)
   - Authentication (login/register)
   - Blog CRUD with tags
   - Tag and category management
   - User management (admin only)
   - File upload

### Frontend Testing
1. Run `npm run dev` and access `http://localhost:5173`.
2. Test authentication flow (login/register).
3. Verify blog creation, editing, and deletion.
4. Check admin dashboard features (user, tag, and category management).
5. Ensure responsive design across devices.

## 🛡️ Security Features

- **Backend**:
  - Password hashing with bcrypt (12 rounds)
  - Rate limiting for API endpoints
  - CORS and XSS protection
  - Input validation with express-validator
  - SQL injection prevention with Sequelize
- **Frontend**:
  - Secure token storage
  - Protected routes with authentication checks
  - Form validation for user inputs

## 📊 Database Models

- **User**: id, username, email, password, full_name, avatar, role, is_active, timestamps
- **Blog**: id, title, slug, summary, content, featured_image, author_id, category_id, is_published, published_at, view_count, timestamps
- **Category**: id, name, slug, description, timestamps
- **Tag**: id, name, slug, timestamps
- **BlogTag**: id, blog_id, tag_id
- **RefreshToken**: id, user_id, token, expires_at, is_revoked, timestamps

## 🚀 Deployment

### Backend
- Set `NODE_ENV=production` in `.env`
- Configure production database
- Use strong JWT secrets
- Set up reverse proxy (e.g., nginx)
- Configure SSL certificate
- Use PM2 for process management:
  ```javascript
  // ecosystem.config.js
  module.exports = {
    apps: [{
      name: 'blog-api',
      script: './src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }]
  }
  ```

### Frontend
- Build with `npm run build`
- Serve the `dist/` folder using a web server (e.g., nginx)
- Update `VITE_API_BASE_URL` in `.env` to point to the production API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- Check the API documentation in the backend README
- Review error logs in `backend/logs/`
- Verify environment variables and database connections
- Use Postman collection for backend testing
- Contact the project maintainers for additional support

## 🔄 Changelog

### v2.0.0
- Added tag and category management
- Implemented user management for admins
- Enhanced blog operations with tag support
- Improved error handling and validation
- Added comprehensive Postman collection

### v1.0.0
- Initial release with basic CRUD operations
- JWT authentication with refresh tokens
- File upload functionality
- Role-based authorization
- Responsive frontend with React and Tailwind CSS

## 🎯 Getting Started

1. Set up the backend (follow backend installation steps).
2. Set up the frontend (follow frontend installation steps).
3. Start both servers:
   - Backend: `npm run dev` (default: `http://localhost:5000`)
   - Frontend: `npm run dev` (default: `http://localhost:5173`)
4. Test with Postman or browser using the provided test credentials.
5. Explore features like blog creation, tag management, and the admin dashboard.

Built with ❤️ using Node.js, Express, Sequelize, MySQL, React, Vite, and Tailwind CSS.