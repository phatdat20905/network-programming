import { useState } from 'react'

export const useForm = (initialValues = {}, validateFn = null) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleBlur = (name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))

    // Validate on blur if validate function provided
    if (validateFn) {
      const validationErrors = validateFn(values)
      setErrors(validationErrors)
    }
  }

  const setValue = (name, value) => {
    handleChange(name, value)
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  const validate = () => {
    if (validateFn) {
      const validationErrors = validateFn(values)
      setErrors(validationErrors)
      return Object.keys(validationErrors).length === 0
    }
    return true
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setValue,
    reset,
    validate,
    isValid: Object.keys(errors).length === 0
  }
}