# Blog Application Backend

A complete RESTful API backend for a blog application built with Node.js, Express, Sequelize, and MySQL. Features JWT authentication with refresh tokens, role-based authorization, comprehensive blog management, tag system, user management, and file uploads.

## Features

- **Authentication & Authorization**
  - JWT-based authentication with access & refresh tokens
  - Role-based access control (Admin/User)
  - Token rotation for enhanced security
  - Logout from all devices

- **Blog Management**
  - Create, read, update, delete blog posts
  - Rich text content support
  - Featured image upload
  - Blog categories and tags
  - Search, filter, and pagination
  - View count tracking

- **Tag Management**
  - Complete CRUD operations for tags
  - Blog-tag relationships
  - Tag-based filtering
  - Automatic slug generation

- **User Management (Admin)**
  - User listing with pagination and search
  - User role management
  - Account activation/deactivation
  - User statistics and reporting

- **Category Management**
  - Category CRUD operations (Admin only)
  - Blog categorization
  - Slug-based URLs

- **File Upload**
  - Single and multiple image upload
  - File type validation
  - Automatic file path management

- **Security**
  - Password hashing with bcrypt
  - Rate limiting
  - CORS protection
  - Helmet security headers
  - Input validation and sanitization

- **Database**
  - MySQL with Sequelize ORM
  - Database migrations
  - Seed data for development
  - Efficient relationships and indexes

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # Database configuration
│   │   └── constants.js     # Application constants
│   ├── models/              # Sequelize models
│   │   ├── index.js         # Models index and associations
│   │   ├── User.js          # User model
│   │   ├── Blog.js          # Blog model
│   │   ├── Category.js      # Category model
│   │   ├── Tag.js           # Tag model
│   │   ├── BlogTag.js       # Blog-Tag relationship
│   │   └── RefreshToken.js  # Refresh token model
│   ├── migrations/          # Database migrations
│   │   ├── 001-create-users.js
│   │   ├── 002-create-categories.js
│   │   ├── 003-create-blogs.js
│   │   ├── 004-create-tags.js
│   │   ├── 005-create-blog-tags.js
│   │   └── 006-create-refresh-tokens.js
│   ├── seeders/             # Database seeders
│   │   ├── 001-demo-users.js
│   │   ├── 002-demo-categories.js
│   │   ├── 003-demo-blogs.js
│   │   └── 004-demo-tags.js
│   ├── controllers/         # Route controllers
│   │   ├── authController.js
│   │   ├── blogController.js
│   │   ├── categoryController.js
│   │   ├── tagController.js
│   │   ├── userController.js
│   │   └── uploadController.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # Authentication middleware
│   │   ├── validation.js    # Request validation
│   │   ├── errorHandler.js  # Error handling
│   │   ├── upload.js        # File upload handling
│   │   └── rateLimit.js     # Rate limiting
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── blog.js
│   │   ├── category.js
│   │   ├── tag.js
│   │   ├── user.js
│   │   ├── upload.js
│   │   └── index.js
│   ├── utils/               # Utility functions
│   │   ├── apiResponse.js   # Standardized API responses
│   │   ├── apiError.js      # Custom error class
│   │   ├── jwt.js           # JWT utilities
│   │   ├── helpers.js       # Helper functions
│   │   └── logger.js        # Logging utilities
│   ├── scripts/             # Utility scripts
│   │   ├── syncDatabase.js
│   │   └── createAdmin.js
│   ├── app.js               # Express app configuration
│   └── server.js            # Server entry point
├── uploads/                 # Uploaded files directory
├── logs/                    # Application logs
├── .env                     # Environment variables
├── .env.example             # Environment variables template
├── .sequelizerc             # Sequelize CLI configuration
└── package.json
```

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   # Server
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:5173

   # Database
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=blog_app
   DB_PORT=3306

   # JWT
   JWT_SECRET=your_super_secure_jwt_secret_key
   JWT_ACCESS_EXPIRE=15m
   JWT_REFRESH_EXPIRE_DAYS=7

   # Token rotation
   ENABLE_TOKEN_ROTATION=true

   # Upload
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=10485760
   ```

4. **Database Setup**

   ```bash
   # Create database
   npm run db:create

   # Run migrations
   npm run db:migrate

   # Seed initial data
   npm run db:seed:all

   # Create admin user
   npm run create:admin
   ```

5. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Database Models

- **User**: id, username, email, password, full_name, avatar, role, is_active, timestamps
- **Blog**: id, title, slug, summary, content, featured_image, author_id, category_id, is_published, published_at, view_count, timestamps
- **Category**: id, name, slug, description, timestamps
- **Tag**: id, name, slug, timestamps
- **BlogTag**: id, blog_id, tag_id
- **RefreshToken**: id, user_id, token, expires_at, is_revoked, timestamps

## API Endpoints

### Authentication (/api/auth)

| Method | Endpoint            | Description                  | Auth Required | Role     |
|--------|---------------------|------------------------------|---------------|----------|
| POST   | /register           | Register new user            | No            | -        |
| POST   | /login              | User login                   | No            | -        |
| POST   | /refresh-token      | Refresh access token         | No            | -        |
| POST   | /logout             | User logout                  | Yes           | Any      |
| POST   | /logout-all         | Logout from all devices      | Yes           | Any      |
| GET    | /me                 | Get current user             | Yes           | Any      |
| GET    | /tokens             | Get user's active tokens     | Yes           | Any      |
| POST   | /revoke-token       | Revoke specific token        | Yes           | Any      |

### Blogs (/api/blogs)

| Method | Endpoint            | Description                  | Auth Required | Role          |
|--------|---------------------|------------------------------|---------------|---------------|
| GET    | /                   | Get all blogs (public)       | No            | -             |
| GET    | /:id                | Get blog by ID               | No            | -             |
| GET    | /slug/:slug         | Get blog by slug             | No            | -             |
| POST   | /                   | Create new blog              | Yes           | Any           |
| PUT    | /:id                | Update blog                  | Yes           | Owner/Admin   |
| DELETE | /:id                | Delete blog                  | Yes           | Owner/Admin   |
| GET    | /user/my-blogs      | Get user's blogs             | Yes           | Any           |

### Categories (/api/categories)

| Method | Endpoint            | Description                  | Auth Required | Role   |
|--------|---------------------|------------------------------|---------------|--------|
| GET    | /                   | Get all categories           | No            | -      |
| GET    | /:id                | Get category by ID           | No            | -      |
| POST   | /                   | Create category              | Yes           | Admin  |
| PUT    | /:id                | Update category              | Yes           | Admin  |
| DELETE | /:id                | Delete category              | Yes           | Admin  |

### Tags (/api/tags)

| Method | Endpoint            | Description                  | Auth Required | Role          |
|--------|---------------------|------------------------------|---------------|---------------|
| GET    | /                   | Get all tags                 | No            | -             |
| GET    | /:id                | Get tag by ID                | No            | -             |
| GET    | /slug/:slug         | Get tag by slug              | No            | -             |
| POST   | /                   | Create tag                   | Yes           | Admin         |
| PUT    | /:id                | Update tag                   | Yes           | Admin         |
| DELETE | /:id                | Delete tag                   | Yes           | Admin         |
| POST   | /blog/:blogId       | Add tags to blog             | Yes           | Owner/Admin   |
| DELETE | /blog/:blogId/:tagId | Remove tag from blog        | Yes           | Owner/Admin   |

### User Management (/api/admin/users)

| Method | Endpoint            | Description                  | Auth Required | Role   |
|--------|---------------------|------------------------------|---------------|--------|
| GET    | /                   | Get all users                | Yes           | Admin  |
| GET    | /stats              | Get user statistics          | Yes           | Admin  |
| GET    | /:id                | Get user by ID               | Yes           | Admin  |
| PUT    | /:id                | Update user                  | Yes           | Admin  |
| DELETE | /:id                | Delete user                  | Yes           | Admin  |
| PATCH  | /:id/active         | Activate/deactivate user     | Yes           | Admin  |
| PATCH  | /:id/role           | Change user role             | Yes           | Admin  |

### Upload (/api/upload)

| Method | Endpoint            | Description                  | Auth Required | Role   |
|--------|---------------------|------------------------------|---------------|--------|
| POST   | /image              | Upload single image          | Yes           | Any    |
| POST   | /images             | Upload multiple images       | Yes           | Any    |

### Health Check

- GET /api/health - Server status

## Authentication Flow

1. **Registration/Login**

   ```json
   // Request
   POST /api/auth/register
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "Password123",
     "full_name": "Test User"
   }

   // Response
   {
     "success": true,
     "message": "User registered successfully",
     "data": {
       "user": { ... },
       "tokens": {
         "accessToken": "eyJ...",
         "refreshToken": "abc123...",
         "expiresIn": "15m"
       }
     }
   }
   ```

2. **Using Access Token**

   ```
   Authorization: Bearer <access_token>
   ```

3. **Token Refresh**

   ```json
   // Request
   POST /api/auth/refresh-token
   {
     "refreshToken": "<refresh_token>"
   }

   // Response
   {
     "success": true,
     "message": "Token refreshed successfully",
     "data": {
       "tokens": {
         "accessToken": "new_access_token",
         "refreshToken": "new_refresh_token",
         "expiresIn": "15m"
       }
     }
   }
   ```

## API Examples

### Create Blog with Tags

```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Authorization: Bearer <access_token>" \
  -F "title=My Blog Post" \
  -F "summary=Blog summary" \
  -F "content=Blog content here..." \
  -F "category_id=1" \
  -F "tags=[\"React\", \"JavaScript\"]" \
  -F "is_published=true" \
  -F "featured_image=@/path/to/image.jpg"
```

### Add Tags to Existing Blog

```bash
curl -X POST http://localhost:5000/api/tags/blog/1 \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "tags": ["Node.js", "Backend", "API"]
  }'
```

### User Management (Admin)

```bash
# Get all users with pagination
curl "http://localhost:5000/api/admin/users?page=1&limit=10&role=user" \
  -H "Authorization: Bearer <admin_token>"

# Change user role
curl -X PATCH http://localhost:5000/api/admin/users/2/role \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'
```

## Testing with Postman

1. **Import Collection & Environment**
   - Import `Blog-API.postman_collection.json`
   - Import `Blog-API-Environment.postman_environment.json`
   - Select environment "Blog API - Development Environment"

2. **Test Credentials**
   - Admin: `admin@blog.com` / `Admin123!`
   - Test User: `test@example.com` / `Password123`

3. **Recommended Test Flow**
   - Start with Health Check
   - Verify server is running
   - Authentication
     - Register new user or login with test credentials
     - Tokens are automatically saved to environment variables
   - Blog Operations
     - Create blog with tags
     - Get blogs with pagination and filtering
     - Update and delete blogs
   - Tag Management (Admin)
     - Create, update, delete tags
     - Manage blog-tag relationships
   - User Management (Admin only)
     - List users with search and filters
     - Update user roles and status
     - View user statistics
   - File Upload
     - Upload images for blog featured images

## Security Features

### Rate Limiting
- General: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Upload endpoints: 10 requests per 15 minutes

### Input Validation
- Request body validation using express-validator
- File type and size validation
- SQL injection prevention with Sequelize
- XSS protection with helmet

### Password Security
- bcrypt with 12 rounds salting
- Minimum 6 characters with complexity requirements

## Database Commands

```bash
# Development
npm run db:create          # Create database
npm run db:migrate         # Run migrations
npm run db:seed:all        # Seed all data
npm run create:admin       # Create admin user

# Maintenance
npm run db:drop            # Drop database
npm run db:reset           # Reset database (drop, create, migrate, seed)
npm run db:migrate:undo    # Rollback last migration
npm run db:migrate:undo:all # Rollback all migrations

# Individual seeders
npm run db:seed:tags       # Seed only tags
```

## Configuration

### Environment Variables
- `NODE_ENV`: Application environment (development/production)
- `PORT`: Server port (default: 5000)
- `CLIENT_URL`: Frontend URL for CORS
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_ACCESS_EXPIRE`: Access token expiry (default: 15m)
- `JWT_REFRESH_EXPIRE_DAYS`: Refresh token expiry in days (default: 7)
- `ENABLE_TOKEN_ROTATION`: Enable refresh token rotation
- `UPLOAD_PATH`: Directory for uploaded files
- `MAX_FILE_SIZE`: Maximum file size (default: 10MB)

### File Upload
- Supported types: JPEG, PNG, GIF, WebP
- Max file size: 10MB
- Upload directory: `./uploads/`


### Common HTTP Status Codes
- 200 - Success
- 201 - Created
- 400 - Bad Request (Validation errors)
- 401 - Unauthorized (Invalid token)
- 403 - Forbidden (Insufficient permissions)
- 404 - Not Found
- 409 - Conflict (Duplicate data)
- 500 - Internal Server Error

## License

This project is licensed under the MIT License.

## Quick Start with Postman

1. **Import collection and environment**
2. **Run Health Check** to verify server
3. **Login with admin** (`admin@blog.com` / `Password123`)
4. **Test features in order**:
   - Blog CRUD with tags
   - Tag management
   - User management
   - File upload

## ✅ Tổng kết Backend

Backend đã hoàn toàn đầy đủ với các thành phần chính:

### 🏗️ Core Structure
- **Models**: Đầy đủ 6 models với associations
- **Migrations**: 6 migration files cho database schema
- **Seeders**: 3 seeder files cho dữ liệu mẫu
- **Controllers**: 4 controllers cho các module chính
- **Middleware**: 5 middleware files cho security và validation
- **Routes**: 4 route files cho API endpoints
- **Utils**: 5 utility files cho common functions

### 🔐 Security & Features
- JWT Authentication với Refresh Token
- Role-based Authorization
- Rate Limiting
- File Upload với validation
- Input Validation
- Error Handling
- Logging system

### 📚 Documentation
- README.md chi tiết với hướng dẫn đầy đủ
- API documentation rõ ràng
- Postman collection hoàn chỉnh
- Environment configuration

### 🛠️ Development Tools
- Sequelize CLI với migrations
- Database seeding
- Admin user creation script
- Development/production configuration

**Backend đã hoàn toàn sẵn sàng cho development và production!** 🚀