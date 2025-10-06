import { APP_CONFIG } from './constants'

export const helpers = {
  // Generate a slug from a string
  generateSlug: (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },

  // Calculate reading time from content
  calculateReadingTime: (content) => {
    const wordsPerMinute = 200
    const wordCount = content.trim().split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  },

  // Extract excerpt from content
  generateExcerpt: (content, maxLength = 150) => {
    const plainText = content.replace(/<[^>]*>/g, '') // Remove HTML tags
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength).trim() + '...'
  },

  // Validate file upload
  validateFile: (file, options = {}) => {
    const {
      maxSize = APP_CONFIG.UPLOAD_MAX_SIZE,
      allowedTypes = APP_CONFIG.SUPPORTED_IMAGE_TYPES
    } = options

    if (!file) {
      return { valid: false, error: 'No file selected' }
    }

    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: `File size must be less than ${maxSize / 1024 / 1024}MB` 
      }
    }

    if (!allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: `File type not supported. Allowed types: ${allowedTypes.join(', ')}` 
      }
    }

    return { valid: true }
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // Debounce function
  debounce: (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  // Get user initials
  getUserInitials: (username) => {
    if (!username) return 'U'
    return username
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  },

  // Check if user can modify content
  canModifyContent: (user, contentAuthorId) => {
    if (!user) return false
    return user.id === contentAuthorId || user.role === 'admin'
  },

  // Generate random color for avatars
  generateRandomColor: (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    const colors = [
      'bg-red-100 text-red-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800'
    ]
    
    return colors[Math.abs(hash) % colors.length]
  }
}