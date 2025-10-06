export const validation = {
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  validatePassword: (password) => {
    return password.length >= 6
  },

  validateUsername: (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/
    return usernameRegex.test(username)
  },

  validateLogin: (values) => {
    const errors = {}

    if (!values.email) {
      errors.email = 'Email is required'
    } else if (!validation.validateEmail(values.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!values.password) {
      errors.password = 'Password is required'
    } else if (!validation.validatePassword(values.password)) {
      errors.password = 'Password must be at least 6 characters long'
    }

    return errors
  },

  validateRegister: (values) => {
    const errors = {}

    if (!values.username) {
      errors.username = 'Username is required'
    } else if (!validation.validateUsername(values.username)) {
      errors.username = 'Username must be 3-30 characters and contain only letters, numbers, and underscores'
    }

    if (!values.email) {
      errors.email = 'Email is required'
    } else if (!validation.validateEmail(values.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!values.password) {
      errors.password = 'Password is required'
    } else if (!validation.validatePassword(values.password)) {
      errors.password = 'Password must be at least 6 characters long'
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    return errors
  },

  validateBlog: (values) => {
    const errors = {}

    if (!values.title || values.title.trim().length === 0) {
      errors.title = 'Title is required'
    } else if (values.title.length < 3) {
      errors.title = 'Title must be at least 3 characters long'
    } else if (values.title.length > 200) {
      errors.title = 'Title must be less than 200 characters'
    }

    if (!values.content || values.content.trim().length === 0) {
      errors.content = 'Content is required'
    } else if (values.content.length < 10) {
      errors.content = 'Content must be at least 10 characters long'
    }

    if (!values.category_id) {
      errors.category_id = 'Category is required'
    }

    return errors
  },

  validateProfile: (values) => {
    const errors = {}

    if (!values.username) {
      errors.username = 'Username is required'
    } else if (!validation.validateUsername(values.username)) {
      errors.username = 'Username must be 3-30 characters and contain only letters, numbers, and underscores'
    }

    if (!values.email) {
      errors.email = 'Email is required'
    } else if (!validation.validateEmail(values.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (values.bio && values.bio.length > 500) {
      errors.bio = 'Bio must be less than 500 characters'
    }

    return errors
  },

  validateCategory: (values) => {
    const errors = {}

    if (!values.name || values.name.trim().length === 0) {
      errors.name = 'Category name is required'
    } else if (values.name.length < 2) {
      errors.name = 'Category name must be at least 2 characters long'
    } else if (values.name.length > 50) {
      errors.name = 'Category name must be less than 50 characters'
    }

    if (values.description && values.description.length > 200) {
      errors.description = 'Description must be less than 200 characters'
    }

    return errors
  },

  validateTag: (values) => {
    const errors = {}

    if (!values.name || values.name.trim().length === 0) {
      errors.name = 'Tag name is required'
    } else if (values.name.length < 2) {
      errors.name = 'Tag name must be at least 2 characters long'
    } else if (values.name.length > 30) {
      errors.name = 'Tag name must be less than 30 characters'
    }

    if (values.description && values.description.length > 200) {
      errors.description = 'Description must be less than 200 characters'
    }

    return errors
  }
}