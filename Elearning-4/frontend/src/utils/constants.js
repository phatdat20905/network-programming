export const APP_CONFIG = {
  APP_NAME: 'BlogApp',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  UPLOAD_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
}

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
}

export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
}

export const SORT_OPTIONS = [
  { value: 'created_at', label: 'Newest First' },
  { value: 'title', label: 'Title A-Z' },
  { value: 'view_count', label: 'Most Viewed' },
  { value: 'updated_at', label: 'Recently Updated' }
]

export const PAGINATION_CONFIG = {
  DEFAULT_LIMIT: 12,
  LIMIT_OPTIONS: [6, 12, 24, 48]
}