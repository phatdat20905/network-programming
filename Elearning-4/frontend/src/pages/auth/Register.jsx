import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useForm } from '../../hooks/useForm'
import { Input, Button } from '../../components/ui'
import { validation } from '../../utils/validation'

const Register = () => {
  const [loading, setLoading] = useState(false)
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const { values, errors, handleChange, handleBlur, validate } = useForm(
    {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validation.validateRegister
  )

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return

    setLoading(true)
    try {
      const result = await register({
        username: values.username,
        email: values.email,
        password: values.password
      })
      if (result.success) {
        navigate('/')
      }
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={values.username}
              onChange={(e) => handleChange('username', e.target.value)}
              onBlur={() => handleBlur('username')}
              error={errors.username}
              placeholder="Choose a username"
            />

            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={errors.email}
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={values.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              error={errors.password}
              placeholder="Create a password"
              helperText="Password must be at least 6 characters long"
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={values.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
            />
          </div>

          <div>
            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="large"
            >
              Create account
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register