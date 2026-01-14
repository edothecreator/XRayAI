import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface User {
  id: string
  email: string
  displayName: string
  createdAt: string
}

interface AuthContextType {
  currentUser: User | null
  loading: boolean
  signup: (email: string, password: string, displayName: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (displayName: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'xray_auth_users'
const CURRENT_USER_KEY = 'xray_current_user'

// Simple password hashing (for demo purposes - in production, use proper hashing)
const hashPassword = (password: string): string => {
  // Simple hash for demo - in production, use bcrypt or similar
  return btoa(password).split('').reverse().join('')
}

// Get all users from localStorage
const getUsers = (): Array<{ email: string; passwordHash: string; displayName: string; id: string; createdAt: string }> => {
  try {
    const users = localStorage.getItem(STORAGE_KEY)
    return users ? JSON.parse(users) : []
  } catch {
    return []
  }
}

// Save users to localStorage
const saveUsers = (users: Array<{ email: string; passwordHash: string; displayName: string; id: string; createdAt: string }>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

// Get current user from localStorage
const getCurrentUser = (): User | null => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

// Save current user to localStorage
const saveCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load current user from localStorage on mount
    const user = getCurrentUser()
    setCurrentUser(user)
    setLoading(false)
  }, [])

  const signup = async (email: string, password: string, displayName: string) => {
    const users = getUsers()
    
    // Check if user already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists')
    }

    // Validate inputs
    if (!email || !password || !displayName) {
      throw new Error('All fields are required')
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    if (!email.includes('@')) {
      throw new Error('Please enter a valid email address')
    }

    // Create new user
    const newUser = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      displayName: displayName.trim(),
      createdAt: new Date().toISOString(),
    }

    // Save user
    users.push(newUser)
    saveUsers(users)

    // Set as current user
    const user: User = {
      id: newUser.id,
      email: newUser.email,
      displayName: newUser.displayName,
      createdAt: newUser.createdAt,
    }
    saveCurrentUser(user)
    setCurrentUser(user)
  }

  const login = async (email: string, password: string) => {
    const users = getUsers()
    const passwordHash = hashPassword(password)
    
    // Find user
    const userData = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === passwordHash
    )

    if (!userData) {
      throw new Error('Invalid email or password')
    }

    // Set as current user
    const user: User = {
      id: userData.id,
      email: userData.email,
      displayName: userData.displayName,
      createdAt: userData.createdAt,
    }
    saveCurrentUser(user)
    setCurrentUser(user)
  }

  const logout = async () => {
    saveCurrentUser(null)
    setCurrentUser(null)
  }

  const updateUserProfile = async (displayName: string) => {
    if (!currentUser) {
      throw new Error('No user logged in')
    }

    const users = getUsers()
    const userIndex = users.findIndex(u => u.id === currentUser.id)
    
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    // Update user data
    users[userIndex].displayName = displayName.trim()
    saveUsers(users)

    // Update current user
    const updatedUser: User = {
      ...currentUser,
      displayName: displayName.trim(),
    }
    saveCurrentUser(updatedUser)
    setCurrentUser(updatedUser)
  }

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    updateUserProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

