import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { PredictionResponse } from '../services/api'

export interface UploadHistoryItem {
  id: string
  patientName?: string
  fileName: string
  filePreview?: string
  predictions: PredictionResponse
  timestamp: string
  date: string
}

interface HistoryContextType {
  history: UploadHistoryItem[]
  addToHistory: (item: Omit<UploadHistoryItem, 'id' | 'timestamp' | 'date'>) => void
  getHistoryItem: (id: string) => UploadHistoryItem | undefined
  clearHistory: () => void
  deleteHistoryItem: (id: string) => void
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)
const HISTORY_KEY = 'xrayai_upload_history'
const MAX_HISTORY_ITEMS = 100

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<UploadHistoryItem[]>([])

  useEffect(() => {
    // Load history from localStorage
    try {
      const savedHistory = localStorage.getItem(HISTORY_KEY)
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory)
        setHistory(parsed)
      }
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }, [])

  const addToHistory = (item: Omit<UploadHistoryItem, 'id' | 'timestamp' | 'date'>) => {
    const newItem: UploadHistoryItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    const newHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS)
    setHistory(newHistory)
    
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
    } catch (error) {
      console.error('Failed to save history:', error)
    }
  }

  const getHistoryItem = (id: string): UploadHistoryItem | undefined => {
    return history.find(item => item.id === id)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }

  const deleteHistoryItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id)
    setHistory(newHistory)
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
    } catch (error) {
      console.error('Failed to update history:', error)
    }
  }

  const value = {
    history,
    addToHistory,
    getHistoryItem,
    clearHistory,
    deleteHistoryItem,
  }

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  const context = useContext(HistoryContext)
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider')
  }
  return context
}

