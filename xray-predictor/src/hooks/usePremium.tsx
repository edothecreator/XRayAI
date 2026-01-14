import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface PremiumContextType {
  isPremium: boolean
  subscriptionType: 'monthly' | 'yearly' | null
  subscribe: (type: 'monthly' | 'yearly') => void
  cancelSubscription: () => void
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined)

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false)
  const [subscriptionType, setSubscriptionType] = useState<'monthly' | 'yearly' | null>(null)

  // Load premium status from localStorage on mount
  useEffect(() => {
    const premiumStatus = localStorage.getItem('xrayai_premium')
    const subscription = localStorage.getItem('xrayai_subscription_type')
    
    if (premiumStatus === 'true') {
      setIsPremium(true)
      setSubscriptionType(subscription as 'monthly' | 'yearly' | null)
    }
  }, [])

  const subscribe = (type: 'monthly' | 'yearly') => {
    setIsPremium(true)
    setSubscriptionType(type)
    localStorage.setItem('xrayai_premium', 'true')
    localStorage.setItem('xrayai_subscription_type', type)
    localStorage.setItem('xrayai_subscription_date', new Date().toISOString())
  }

  const cancelSubscription = () => {
    setIsPremium(false)
    setSubscriptionType(null)
    localStorage.removeItem('xrayai_premium')
    localStorage.removeItem('xrayai_subscription_type')
    localStorage.removeItem('xrayai_subscription_date')
  }

  return (
    <PremiumContext.Provider value={{ isPremium, subscriptionType, subscribe, cancelSubscription }}>
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  const context = useContext(PremiumContext)
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider')
  }
  return context
}

