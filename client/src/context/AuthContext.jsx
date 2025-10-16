import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import { storage } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(storage.getToken())
  const [user, setUser] = useState(storage.getUser())
  const [role, setRole] = useState(storage.getRole())
  const [loading, setLoading] = useState(false)
  const isAuthenticated = !!token

  useEffect(() => {
    if (token) {
      storage.setToken(token)
    } else {
      storage.removeToken()
    }
  }, [token])

  useEffect(() => {
    if (user) storage.setUser(user); else storage.removeUser()
  }, [user])

  useEffect(() => {
    if (role) storage.setRole(role); else storage.removeRole()
  }, [role])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setToken(data?.token)
      setUser(data?.user)
      setRole(data?.user?.role)
      return { success: true }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', payload)
      return { success: true, data }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || 'Registration failed' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setRole(null)
    storage.clearAll()
  }

  const value = useMemo(() => ({ token, user, role, isAuthenticated, login, register, logout, loading }), [token, user, role, isAuthenticated, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}