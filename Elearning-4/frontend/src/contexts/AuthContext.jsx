import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../api/auth'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tokens, setTokens] = useState([])

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        await checkAuth()
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const checkAuth = async () => {
    try {
      const response = await authAPI.getMe()
      const userData = response.data.user
      setUser(userData)
      setIsAuthenticated(true)
      setIsAdmin(userData.role === 'admin')
      
      await loadUserTokens()
    } catch (error) {
      console.error('Auth check failed:', error)
      throw error
    }
  }

  const loadUserTokens = async () => {
    try {
      const response = await authAPI.getMyTokens()
      setTokens(response.data.tokens)
    } catch (error) {
      console.error('Failed to load user tokens:', error)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password })
      const { user: userData, tokens: newTokens } = response.data
      
      localStorage.setItem('accessToken', newTokens.accessToken)
      localStorage.setItem('refreshToken', newTokens.refreshToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      setUser(userData)
      setIsAuthenticated(true)
      setIsAdmin(userData.role === 'admin')
      await loadUserTokens()
      
      toast.success('Login successful!')
      return { success: true, data: response.data }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      toast.error(errorMessage)
      return { 
        success: false, 
        error: errorMessage 
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      const { user: newUser, tokens: newTokens } = response.data
      
      localStorage.setItem('accessToken', newTokens.accessToken)
      localStorage.setItem('refreshToken', newTokens.refreshToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      setUser(newUser)
      setIsAuthenticated(true)
      setIsAdmin(newUser.role === 'admin')
      await loadUserTokens()
      
      toast.success('Registration successful!')
      return { success: true, data: response.data }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      toast.error(errorMessage)
      return { 
        success: false, 
        error: errorMessage 
      }
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await authAPI.logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      clearAuthData()
      toast.success('Logged out successfully')
    }
  }

  const logoutAll = async () => {
    try {
      await authAPI.logoutAll()
      toast.success('Logged out from all devices')
    } catch (error) {
      console.error('Logout all error:', error)
    } finally {
      clearAuthData()
    }
  }

  const clearAuthData = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    setIsAdmin(false)
    setTokens([])
  }

  const refreshTokens = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await authAPI.refreshToken(refreshToken)
      const { tokens: newTokens } = response.data

      localStorage.setItem('accessToken', newTokens.accessToken)
      if (newTokens.refreshToken) {
        localStorage.setItem('refreshToken', newTokens.refreshToken)
      }

      return newTokens
    } catch (error) {
      logout()
      throw error
    }
  }

  const updateUserProfile = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    setIsAdmin(userData.role === 'admin')
  }

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    tokens,
    login,
    register,
    logout,
    logoutAll,
    refreshTokens,
    checkAuth,
    updateUserProfile,
    loadUserTokens
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}