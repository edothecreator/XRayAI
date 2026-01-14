import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export interface Review {
  id: string
  analysisId: string
  rating: number // 1-5
  comment: string
  date: string
  userName?: string
  helpful?: number // Number of helpful votes
}

interface ReviewsContextType {
  reviews: Review[]
  addReview: (analysisId: string, rating: number, comment: string, userName?: string) => void
  getReviewsByAnalysisId: (analysisId: string) => Review[]
  getReviewByAnalysisId: (analysisId: string) => Review | undefined
  markHelpful: (reviewId: string) => void
  deleteReview: (reviewId: string) => void
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined)
const REVIEWS_KEY = 'xrayai_reviews'

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    // Load reviews from localStorage
    try {
      const savedReviews = localStorage.getItem(REVIEWS_KEY)
      if (savedReviews) {
        const parsed = JSON.parse(savedReviews)
        setReviews(parsed)
      }
    } catch (error) {
      console.error('Failed to load reviews:', error)
    }
  }, [])

  const addReview = (analysisId: string, rating: number, comment: string, userName?: string) => {
    const newReview: Review = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      analysisId,
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
      userName: userName || 'Anonymous',
      helpful: 0,
    }

    const newReviews = [newReview, ...reviews]
    setReviews(newReviews)
    
    try {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(newReviews))
    } catch (error) {
      console.error('Failed to save review:', error)
    }
  }

  const getReviewsByAnalysisId = (analysisId: string): Review[] => {
    return reviews.filter(review => review.analysisId === analysisId)
  }

  const getReviewByAnalysisId = (analysisId: string): Review | undefined => {
    return reviews.find(review => review.analysisId === analysisId)
  }

  const markHelpful = (reviewId: string) => {
    const newReviews = reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: (review.helpful || 0) + 1 }
        : review
    )
    setReviews(newReviews)
    
    try {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(newReviews))
    } catch (error) {
      console.error('Failed to update review:', error)
    }
  }

  const deleteReview = (reviewId: string) => {
    const newReviews = reviews.filter(review => review.id !== reviewId)
    setReviews(newReviews)
    
    try {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(newReviews))
    } catch (error) {
      console.error('Failed to delete review:', error)
    }
  }

  const value = {
    reviews,
    addReview,
    getReviewsByAnalysisId,
    getReviewByAnalysisId,
    markHelpful,
    deleteReview,
  }

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  )
}

export function useReviews() {
  const context = useContext(ReviewsContext)
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider')
  }
  return context
}

