import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from './useAuth'

interface CreditContextType {
  credits: number
  freeCreditsUsed: number
  totalCreditsUsed: number
  purchaseCredits: (packageId: string) => void
  useCredit: () => boolean
  getCreditHistory: () => Array<{ type: 'purchase' | 'usage'; amount: number; date: string; description: string }>
}

const CreditContext = createContext<CreditContextType | undefined>(undefined)

// Account-based storage keys (will be prefixed with user ID)
const getCreditsKey = (userId: string) => `xrayai_credits_${userId}`
const getFreeCreditsUsedKey = (userId: string) => `xrayai_free_credits_used_${userId}`
const getCreditHistoryKey = (userId: string) => `xrayai_credit_history_${userId}`
const INITIAL_FREE_CREDITS = 3

interface CreditPackage {
  credits: number
  price: number
  name: string
  popular?: boolean
}

const CREDIT_PACKAGES: Record<string, CreditPackage> = {
  '5-credits': { credits: 5, price: 20, name: 'Starter Pack' },
  '15-credits': { credits: 15, price: 50, name: 'Popular Pack', popular: true }, // $3.33 per credit
  '30-credits': { credits: 30, price: 90, name: 'Professional Pack' }, // $3 per credit
  '50-credits': { credits: 50, price: 140, name: 'Enterprise Pack' }, // $2.80 per credit
  '100-credits': { credits: 100, price: 250, name: 'Mega Pack' }, // $2.50 per credit
}

export function CreditProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth()
  const [credits, setCredits] = useState(0)
  const [freeCreditsUsed, setFreeCreditsUsed] = useState(0)

  // Load credits from localStorage based on current user account
  useEffect(() => {
    if (!currentUser) {
      setCredits(0)
      setFreeCreditsUsed(0)
      return
    }

    const userId = currentUser.id
    const creditsKey = getCreditsKey(userId)
    const freeCreditsUsedKey = getFreeCreditsUsedKey(userId)
    
    const savedCredits = localStorage.getItem(creditsKey)
    const savedFreeCreditsUsed = localStorage.getItem(freeCreditsUsedKey)
    
    if (savedCredits !== null) {
      setCredits(parseInt(savedCredits, 10))
    } else {
      // First time user for this account - give 3 free credits
      setCredits(INITIAL_FREE_CREDITS)
      localStorage.setItem(creditsKey, INITIAL_FREE_CREDITS.toString())
    }
    
    if (savedFreeCreditsUsed !== null) {
      setFreeCreditsUsed(parseInt(savedFreeCreditsUsed, 10))
    }
  }, [currentUser])

  const purchaseCredits = (packageId: string) => {
    if (!currentUser) {
      throw new Error('User must be logged in to purchase credits')
    }

    const packageData = CREDIT_PACKAGES[packageId]
    if (!packageData) {
      throw new Error('Invalid package ID')
    }

    const userId = currentUser.id
    const creditsKey = getCreditsKey(userId)
    const historyKey = getCreditHistoryKey(userId)

    // In a real app, this would process payment
    // For now, just add credits
    const newCredits = credits + packageData.credits
    setCredits(newCredits)
    localStorage.setItem(creditsKey, newCredits.toString())

    // Add to history
    const history = getCreditHistory()
    history.unshift({
      type: 'purchase',
      amount: packageData.credits,
      date: new Date().toISOString(),
      description: `Purchased ${packageData.name} (${packageData.credits} credits) - $${packageData.price}`,
    })
    localStorage.setItem(historyKey, JSON.stringify(history))
  }

  const useCredit = (): boolean => {
    if (!currentUser) {
      return false
    }

    if (credits <= 0) {
      return false
    }

    const userId = currentUser.id
    const creditsKey = getCreditsKey(userId)
    const freeCreditsUsedKey = getFreeCreditsUsedKey(userId)
    const historyKey = getCreditHistoryKey(userId)

    const newCredits = credits - 1
    setCredits(newCredits)
    localStorage.setItem(creditsKey, newCredits.toString())

    // Track if using free credits
    const currentFreeCreditsUsed = freeCreditsUsed
    if (currentFreeCreditsUsed < INITIAL_FREE_CREDITS) {
      const newFreeCreditsUsed = currentFreeCreditsUsed + 1
      setFreeCreditsUsed(newFreeCreditsUsed)
      localStorage.setItem(freeCreditsUsedKey, newFreeCreditsUsed.toString())
    }

    // Add to history
    const history = getCreditHistory()
    history.unshift({
      type: 'usage',
      amount: -1,
      date: new Date().toISOString(),
      description: 'Used 1 credit for X-ray analysis',
    })
    localStorage.setItem(historyKey, JSON.stringify(history))

    return true
  }

  const getCreditHistory = (): Array<{ type: 'purchase' | 'usage'; amount: number; date: string; description: string }> => {
    if (!currentUser) {
      return []
    }

    try {
      const userId = currentUser.id
      const historyKey = getCreditHistoryKey(userId)
      const history = localStorage.getItem(historyKey)
      return history ? JSON.parse(history) : []
    } catch {
      return []
    }
  }

  const value = {
    credits,
    freeCreditsUsed,
    totalCreditsUsed: INITIAL_FREE_CREDITS - freeCreditsUsed + (credits - (INITIAL_FREE_CREDITS - freeCreditsUsed)),
    purchaseCredits,
    useCredit,
    getCreditHistory,
  }

  return (
    <CreditContext.Provider value={value}>
      {children}
    </CreditContext.Provider>
  )
}

export function useCredits() {
  const context = useContext(CreditContext)
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditProvider')
  }
  return context
}

export { CREDIT_PACKAGES }

