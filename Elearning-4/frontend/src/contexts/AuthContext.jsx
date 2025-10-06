import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
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

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    setIsAdmin(false)
    setTokens([])
  }, [])

  const initializeAuth = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        await checkAuth()
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      // Không logout tự động khi initialize fail
      if (error.response?.status === 429) {
        console.warn('Rate limited during auth initialization')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  const checkAuth = async () => {
    try {
      const response = await authAPI.getMe()
      const userData = response.data.user
      setUser(userData)
      setIsAuthenticated(true)
      setIsAdmin(userData.role === 'admin')
    } catch (error) {
      console.error('Auth check failed:', error)
      if (error.response?.status === 401) {
        clearAuthData()
      }
      throw error
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
      
      toast.success('Login successful!')
      return { success: true, data: response.data }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      
      if (error.response?.status === 429) {
        toast.error('Too many login attempts. Please wait a moment.')
      } else {
        toast.error(errorMessage)
      }
      
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

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    tokens,
    login,
    logout,
    clearAuthData,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}